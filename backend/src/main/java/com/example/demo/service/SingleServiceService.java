package com.example.demo.service;

import com.example.demo.appuser.AppUser;
import com.example.demo.appuser.AppUserRepository;
import com.example.demo.appuser.AppUserRole;
import com.example.demo.appuser.AppUserService;
import com.example.demo.email.EmailSender;
import com.example.demo.registration.EmailValidator;
import com.example.demo.registration.token.ConfirmationToken;
import com.example.demo.registration.token.ConfirmationTokenService;
import com.example.demo.visit.Visit;
import com.example.demo.visit.VisitRepository;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import javassist.NotFoundException;
import lombok.AllArgsConstructor;
import org.apache.tomcat.jni.Local;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import com.fasterxml.jackson.databind.module.SimpleModule;

@Service
@AllArgsConstructor
public class SingleServiceService {

    private final AppUserService appUserService;
    private final SingleServiceRepository singleServiceRepository;
    private final VisitRepository visitRepository;

    private final AppUserRepository appUserRepository;


    private final EmailValidator emailValidator;
    private final ConfirmationTokenService confirmationTokenService;
    private final EmailSender emailSender;

    public SingleService addService(SingleService service) {

        return singleServiceRepository.save(service);

//        return "ok";
//        boolean isValidEmail = emailValidator.
//                test(request.getEmail());

//        if (!isValidEmail) {
//            throw new IllegalStateException("email not valid");
//        }

//        String token = appUserService.signUpUser(
//                new AppUser(
//                        request.getFirstName(),
//                        request.getLastName(),
//                        request.getEmail(),
//                        request.getPassword(),
//                        AppUserRole.USER
//
//                )
//        );

//        String link = "http://localhost:8080/api/v1/registration/confirm?token=" + token;
//        emailSender.send(
//                request.getEmail(),
//                buildEmail(request.getFirstName(), link));
//
//        return token;
    }

    public List<SingleService> getAllServices() {
        return singleServiceRepository.findAll();
    }

    public void deleteService(Long id) throws NotFoundException {
        Optional<SingleService> optionalService = singleServiceRepository.findById(id);
        if (optionalService.isPresent()) {

            SingleService service = optionalService.get();
            List<Visit> visitsToDelete = visitRepository.findByServiceId(service.getId());
            visitRepository.deleteAll(visitsToDelete);
            singleServiceRepository.delete(service);

        } else {
            throw new NotFoundException("Visit not found");
        }
    }

    @Transactional
    public String confirmToken(String token) {
        ConfirmationToken confirmationToken = confirmationTokenService
                .getToken(token)
                .orElseThrow(() ->
                        new IllegalStateException("token not found"));

        if (confirmationToken.getConfirmedAt() != null) {
            throw new IllegalStateException("email already confirmed");
        }

        LocalDateTime expiredAt = confirmationToken.getExpiresAt();

        if (expiredAt.isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("token expired");
        }

        confirmationTokenService.setConfirmedAt(token);
        appUserService.enableAppUser(
                confirmationToken.getAppUser().getEmail());
        return "confirmed";
    }


    public String getSpecificServiceAndWorkerAvailability(Long serviceId, Date date) throws NotFoundException, JsonProcessingException {

        Optional<SingleService> optionalChosenService = singleServiceRepository.findById(serviceId);
        SingleService chosenService;
        if (optionalChosenService.isPresent()) {
            chosenService = optionalChosenService.get();
        }
        else throw new NotFoundException("Nie znaleziono usługi o podanym id.");
        int chosenServiceDurationTime = chosenService.getDurationMins();

        HashMap<Long, List<LocalDateTime>> occupiedEmployeeHours = new HashMap<>();
        HashMap<Long, List<LocalDateTime>> freeHoursMap = new HashMap<>();

//        map.put("key", "value");
//        map.put("foo", "bar");
//        map.put("aa", "bb");


        List<AppUser> listUsers = appUserRepository.findAllWorkers(AppUserRole.ADMIN);//change to find with role admin

        for (int i = 0; i < listUsers.size(); i++) {
            List<LocalDateTime> hoursList = new ArrayList<>();
            long userId = listUsers.get(i).getId();
            List<Visit> actualWorkerVisits = visitRepository.findByEmployeeIdAndDate(userId, date, AppUserRole.ADMIN);

            for (int j = 0; j < actualWorkerVisits.size(); j++) {

                Optional<SingleService> optionalService = singleServiceRepository.findById(actualWorkerVisits.get(j).getService().getId());
                if (optionalService.isPresent()) {
                    SingleService service = optionalService.get();

                    int duration = service.getDurationMins();
                    LocalDateTime startServiceTime = actualWorkerVisits.get(j).getStartTime();

                    do {
                        hoursList.add(startServiceTime);
                        startServiceTime = startServiceTime.plusMinutes(15);
                        duration -= 15;
                    }
                    while (duration > 0);

                    startServiceTime = actualWorkerVisits.get(j).getStartTime();
//                    do {
//                        hoursList.add(startServiceTime);
//                        startServiceTime = startServiceTime.plusMinutes(15);
//                        chosenServiceDurationTime -= 15;
//                    }
                    while (chosenServiceDurationTime > 15){
                        chosenServiceDurationTime -= 15;
                        startServiceTime = startServiceTime.minusMinutes(15);
                        hoursList.add(startServiceTime);
                    }

                }


                //hoursList.add(actualWorkerVisits.get(j).getStartTime());

                occupiedEmployeeHours.put(userId, hoursList);

            }
        }
        List<LocalDateTime> dates = getDatesInFifteenMinuteIntervals(date);
        HashSet<LocalDateTime> allFreeHours = new HashSet<>();

        if (occupiedEmployeeHours.isEmpty()){
            allFreeHours.addAll(dates);
            for (AppUser listUser : listUsers) {
                freeHoursMap.put(listUser.getId(), dates);
            }
        }
        else {
            for (Map.Entry<Long, List<LocalDateTime>> entry : occupiedEmployeeHours.entrySet()) {
                Long employeeId = entry.getKey();
                List<LocalDateTime> occupiedHours = entry.getValue();

                // Utworzenie listy wolnych godzin dla danego pracownika
                List<LocalDateTime> freeHours = new ArrayList<>(dates);
                freeHours.removeAll(occupiedHours);
                allFreeHours.addAll(freeHours);

                // Dodanie do mapy wolnych godzin
                freeHoursMap.put(employeeId, freeHours);

            }
            for (AppUser listUser : listUsers) {
                if(!freeHoursMap.containsKey(listUser.getId())){
                    freeHoursMap.put(listUser.getId(), dates);
                }
            }
        }
        TreeSet<LocalDateTime> sortedSet = new TreeSet<>(new DateTimeComparator());

        // Dodawanie wszystkich elementów z HashSet do TreeSet
        sortedSet.addAll(allFreeHours);

        SimpleModule module = new SimpleModule();
        module.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer());
        JsonReturner jsonReturner = new JsonReturner(sortedSet, freeHoursMap);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(module);


        return objectMapper.writeValueAsString(jsonReturner);

    }

    static class DateTimeComparator implements Comparator<LocalDateTime> {
        @Override
        public int compare(LocalDateTime dateTime1, LocalDateTime dateTime2) {
            return dateTime1.compareTo(dateTime2);
        }
    }


    public static List<LocalDateTime> getDatesInFifteenMinuteIntervals(Date currentDate) {
        List<LocalDateTime> dates = new ArrayList<>();
        LocalDateTime today = LocalDateTime.ofInstant(currentDate.toInstant(), ZoneId.systemDefault());
        LocalDateTime dateTime = today.withHour(9).withMinute(0).withSecond(0);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");

        while (dateTime.getHour() < 18) {
            dates.add(LocalDateTime.parse(dateTime.format(formatter)));
            dateTime = dateTime.plusMinutes(15);
        }
    return dates;
    }

}
class LocalDateTimeSerializer extends JsonSerializer<LocalDateTime> {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("HH:mm");


    @Override
    public void serialize(LocalDateTime localDateTime, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeString(localDateTime.format(FORMATTER));
    }

}

class JsonReturner {
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private Map<Long, List<LocalDateTime>> userFreeHours;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private TreeSet<LocalDateTime> freeHours;

    public JsonReturner(TreeSet<LocalDateTime> freeHours, Map<Long, List<LocalDateTime>> userFreeHours) {
        this.userFreeHours = userFreeHours;
        this.freeHours = freeHours;
    }

    public Map<Long, List<LocalDateTime>> getMapField() {
        return userFreeHours;
    }

    public TreeSet<LocalDateTime> getListField() {
        return freeHours;
    }
}
