package com.exxeta.wpgwn.wpgwnapp.utils;

import java.util.Random;
import java.util.stream.Collector;
import java.util.stream.IntStream;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class PasswordGenerator {

    private final Random random;
    private final String legalCharacter = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?-_";

    public String generatePassword(Integer length) {
        return IntStream.range(0, length).boxed()
                .map(i -> random.nextInt(legalCharacter.length()))
                .map(legalCharacter::charAt)
                .collect(Collector.of(
                    StringBuilder::new,
                    StringBuilder::append,
                    StringBuilder::append,
                    StringBuilder::toString));
    }
}
