package com.realestatemarket.authenticationservice.exception;

public class PhoneExitsException extends RuntimeException{
    public PhoneExitsException(String message) {
        super(message);
    }

    public PhoneExitsException(String message, Throwable cause) {
        super(message, cause);
    }

    public PhoneExitsException(Throwable cause) {
        super(cause);
    }

}
