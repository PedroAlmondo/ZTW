package com.example.demo.logging;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "api/v1/login")
@AllArgsConstructor
@CrossOrigin
public class LoggingController {

    private final LoggingService loggingService;

    @PostMapping
    public long login(@RequestBody LoggingRequest request) throws Exception {
        return loggingService.login(request);
    }


}
