package com.example.demo.controller;

import com.example.demo.dto.SignalMessage;
import com.example.demo.service.SignalingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/signal")
@RequiredArgsConstructor
public class SignalingController {

    private final SignalingService signalingService;

    @PostMapping("/send")
    public ResponseEntity<String> sendSignal(@RequestBody SignalMessage message) {
        signalingService.storeMessage(message);
        return ResponseEntity.ok("Message stored");
    }

    @GetMapping("/receive")
    public ResponseEntity<SignalMessage> receiveSignal(@RequestParam String receiver) {
        SignalMessage message = signalingService.getMessage(receiver);
        return ResponseEntity.ok(message);
    }
}