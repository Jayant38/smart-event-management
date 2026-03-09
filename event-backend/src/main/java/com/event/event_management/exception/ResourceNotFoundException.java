package com.event.event_management.exception;

public class ResourceNotFoundException extends RuntimeException  {
	public ResourceNotFoundException(String message) {
        super(message);
    }
}
