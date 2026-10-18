package com.example.starter.reference.application;

public class ReferenceItemNotFoundException extends RuntimeException {
    public ReferenceItemNotFoundException() {
        super("No se encontró el elemento.");
    }
}
