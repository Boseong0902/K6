package com.example.demo.service;

import com.example.demo.dto.SignalMessage;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class SignalingService {

    private final ConcurrentHashMap<String, SignalMessage> messageStore = new ConcurrentHashMap<>();

    public void storeMessage(SignalMessage message) {
        messageStore.put(message.getReceiver(), message);
    }

    public SignalMessage getMessage(String receiver) {
        return messageStore.remove(receiver); // 메시지를 한 번 받고 나면 삭제
    }
}