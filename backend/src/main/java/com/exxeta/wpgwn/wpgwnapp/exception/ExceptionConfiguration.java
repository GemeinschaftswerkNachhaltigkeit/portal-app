package com.exxeta.wpgwn.wpgwnapp.exception;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import lombok.RequiredArgsConstructor;

@ControllerAdvice
@RequiredArgsConstructor
public class ExceptionConfiguration {

    /**
     * Generiert Rückgabeobjekte für (Bean-)Validierungsfehler an Controllern.
     * Die Lokalisierung erfolgt durch Spring.
     *
     * @param exception die geworfene Exception
     * @return Rückgabeobjekt
     */
    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException exception) {
        final HttpStatus statusCode = HttpStatus.BAD_REQUEST;
        final List<ErrorModel> errorMessages = getErrorModels(exception.getBindingResult());
        return ResponseEntity
                .status(statusCode)
                .body(ErrorResponse.builder()
                        .status(statusCode)
                        .errorMessages(errorMessages)
                        .build());
    }

    /**
     * Generiert Rückgabeobjekte für Validierungsfehler resultierend aus manueller Validierung.
     * Die Lokalisierung erfolgt durch Spring.
     *
     * @param validationException die manuell geworfene Exception
     * @return Rückgabeobjekt
     */
    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleValidationException(ValidationException validationException) {
        final BindingResult bindingResult = validationException.getBindingResult();
        final HttpStatus statusCode = getStatusCode(bindingResult);
        final List<ErrorModel> errorMessages = getErrorModels(bindingResult);
        return ResponseEntity
                .status(statusCode)
                .body(ErrorResponse.builder()
                        .status(statusCode)
                        .errorMessages(errorMessages)
                        .build());
    }

    private HttpStatus getStatusCode(BindingResult bindingResult) {
        if (bindingResult.hasGlobalErrors()) {
            return HttpStatus.CONFLICT;
        } else {
            return HttpStatus.BAD_REQUEST;
        }
    }

    /**
     * Generiert Rückgabeobjekte für Validierungsfehler resultierend aus manueller Validierung.
     * Die Lokalisierung erfolgt durch Spring.
     *
     * @param entityNotFoundException die manuell geworfene Exception
     * @return Rückgabeobjekt
     */
    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleEntityNotFoundException(
            EntityNotFoundException entityNotFoundException) {
        final HttpStatus statusCode = HttpStatus.NOT_FOUND;
        return ResponseEntity
                .status(statusCode)
                .body(ErrorResponse.builder()
                        .status(statusCode)
                        .errorMessages(List.of(ErrorModel.builder()
                                .fieldName("id")
                                .message(entityNotFoundException.getMessage())
                                .build()))
                        .build());
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleMaxUploadSizeExceededException(
            MaxUploadSizeExceededException maxUploadSizeExceededException) {
        final HttpStatus statusCode = HttpStatus.PAYLOAD_TOO_LARGE;
        return ResponseEntity
                .status(statusCode)
                .body(ErrorResponse.builder()
                        .status(statusCode)
                        .build());
    }

    private List<ErrorModel> getErrorModels(BindingResult bindingResult) {
        return bindingResult.getAllErrors().stream()
                .map(this::mapToErrorModel)
                .distinct()
                .collect(Collectors.toList());
    }

    private ErrorModel mapToErrorModel(ObjectError objectError) {
        if (objectError instanceof FieldError) {
            FieldError fieldError = (FieldError) objectError;
            return ErrorModel.builder()
                    .fieldName(fieldError.getField())
                    .message(fieldError.getDefaultMessage())
                    .build();
        } else {
            return ErrorModel.builder()
                    .message(objectError.getObjectName() + " - " + objectError.getDefaultMessage())
                    .build();
        }
    }

}
