package com.exxeta.wpgwn.wpgwnapp.utils;

import lombok.extern.slf4j.Slf4j;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.List;
import java.util.stream.IntStream;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
class PasswordGeneratorTest {

    PasswordGenerator passwordGenerator;

    @BeforeEach
    public void setUp() {
        passwordGenerator = new PasswordGenerator(
                new SecureRandom("seed".getBytes(StandardCharsets.UTF_8))
        );
    }

    @Test
    public void testGeneratePassword() {
        IntStream.range(1, 101).forEach(run -> {
            String password = passwordGenerator.generatePassword(200);
            assertThat(password).hasSize(200);
            for (int i = 0; i < password.length(); i++) {
                char c = password.charAt(i);
                boolean isLegalCharacter = isUpperChar(c) || isLowerChar(c) || isDigit(c) || isSpecialChar(c);
                if (!isLegalCharacter) {
                    log.error(String.format("Character '%s' at position '%s' for run '%s' is illegal", c, i, run));
                }
                assertThat(isLegalCharacter).isTrue();
            }
        });

    }

    private boolean isSpecialChar(char c) {
        return List.of('!', '?', '-', '_').contains(c);
    }

    private boolean isDigit(char c) {
        return c >= '0' && c <= '9';
    }

    private boolean isUpperChar(char c) {
        return c >= 'A' && c <= 'Z';
    }

    private boolean isLowerChar(char c) {
        return c >= 'a' && c <= 'z';
    }

}
