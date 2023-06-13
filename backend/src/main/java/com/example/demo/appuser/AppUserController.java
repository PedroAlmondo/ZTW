package com.example.demo.appuser;

import javassist.NotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("api/v1/users")
public class AppUserController {

    private final AppUserRepository appUserRepository;

    public AppUserController(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppUser> getUserById(@PathVariable Long id) {
        Optional<AppUser> userOptional = appUserRepository.findById(id);
        if (userOptional.isPresent()) {
            AppUser user = userOptional.get();
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/workers")
    public ResponseEntity<List<AppUser>> getAllWorkers() {
        List<AppUser> allWorkers = appUserRepository.findAllWorkers(AppUserRole.ADMIN);
        return ResponseEntity.ok(allWorkers);
    }
}
