package com.example.demo.visit;

import com.example.demo.registration.RegistrationRequest;
import com.example.demo.registration.RegistrationService;
import com.example.demo.service.SingleService;
import javassist.NotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/visits")
public class VisitController {

//    @Autowired
    private final VisitService visitService;

    VisitController(VisitService visitService){
        this.visitService = visitService;
    }

    @PostMapping
    public ResponseEntity<?> makeAReservation(@RequestBody Visit visit) throws NotFoundException {
        return ResponseEntity.ok(visitService.makeAReservation(visit));
    }

    @GetMapping
    public ResponseEntity<List<Visit>> getAllVisits() {
        return ResponseEntity.ok(visitService.getAllVisits());
    }

    @GetMapping("/clients/{id}")
    public ResponseEntity<List<Visit>> specificUserVisits(@PathVariable Long id) {
        return ResponseEntity.ok(visitService.specificUserVisits(id));
    }

    @GetMapping("/employees/{id}")
    public ResponseEntity<List<Visit>> specificEmployeeVisits(@PathVariable Long id) {
        return ResponseEntity.ok(visitService.specificEmployeeVisits(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        try {
            visitService.deleteReservation(id);
            return ResponseEntity.ok("Visit deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid request");
        }
    }



    @GetMapping(path = "confirm")
    public String confirm(@RequestParam("token") String token) {
        return "";//registrationService.confirmToken(token);
    }

}
