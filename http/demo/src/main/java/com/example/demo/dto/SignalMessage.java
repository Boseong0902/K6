package com.example.demo.dto;

public class SignalMessage {
    private String type;
    private String sender;
    private String receiver;
    private String content;

    // 👇 이거 필수!
    public SignalMessage() {}

    // 👇 getter/setter 없으면 Jackson이 JSON → Java 매핑 못함
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public String getReceiver() { return receiver; }
    public void setReceiver(String receiver) { this.receiver = receiver; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}