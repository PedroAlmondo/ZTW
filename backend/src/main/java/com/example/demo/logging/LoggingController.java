package com.example.demo.logging;

import com.example.demo.appuser.AppUser;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "api/v1/login")
@AllArgsConstructor
@CrossOrigin
public class LoggingController {

    private final LoggingService loggingService;

    @PostMapping
    public AppUser login(@RequestBody LoggingRequest request) throws Exception {
        return loggingService.login(request);
    }


}
