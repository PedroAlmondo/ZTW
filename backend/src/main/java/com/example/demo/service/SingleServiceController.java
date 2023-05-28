package com.example.demo.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import javassist.NotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "api/v1/services")
@AllArgsConstructor
public class SingleServiceController {

    private final SingleServiceService singleServiceService;

    @PostMapping
    public ResponseEntity<SingleService> addService(@RequestBody SingleService singleService) {
        return ResponseEntity.ok(singleServiceService.addService(singleService));
    }

    @GetMapping
    public ResponseEntity<List<SingleService>> getAllServices() {
        return ResponseEntity.ok(singleServiceService.getAllServices());
    }

    //example use: localhost:8080/api/v1/services/2023-05-27
    @GetMapping("/{date}")
    public ResponseEntity<String> getSpecificServiceAndWorkerAvailability(@PathVariable("date") @DateTimeFormat(pattern = "yyyy-MM-dd") Date date) throws NotFoundException, JsonProcessingException {
        return ResponseEntity.ok(singleServiceService.getSpecificServiceAndWorkerAvailability(date));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        try {
            singleServiceService.deleteService(id);
            return ResponseEntity.ok("Service deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid request");
        }
    }


    @GetMapping(path = "confirm")
    public String confirm(@RequestParam("token") String token) {
        return "";//registrationService.confirmToken(token);
    }

}
