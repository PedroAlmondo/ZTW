package com.example.demo.service;

import com.example.demo.appuser.AppUserService;
import com.example.demo.email.EmailSender;
import com.example.demo.registration.EmailValidator;
import com.example.demo.registration.token.ConfirmationToken;
import com.example.demo.registration.token.ConfirmationTokenService;
import com.example.demo.visit.Visit;
import com.example.demo.visit.VisitRepository;
import javassist.NotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class SingleServiceService {

    private final AppUserService appUserService;
    private final SingleServiceRepository singleServiceRepository;
    private final VisitRepository visitRepository;


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

            SingleService visit = optionalService.get();
            List<Visit> visitsToDelete = visitRepository.findByServiceId(visit.getId());
            visitRepository.deleteAll(visitsToDelete);
            singleServiceRepository.delete(visit);

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



}
