package com.example.demo.service;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;

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
