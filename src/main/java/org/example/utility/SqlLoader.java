package org.example.utility;

import org.springframework.core.io.ClassPathResource;

import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public class SqlLoader {

    public static String load(String fileName) {
        try (Scanner scanner = new Scanner(
                new ClassPathResource("sql/" + fileName).getInputStream(),
                StandardCharsets.UTF_8)) {
            return scanner.useDelimiter("\\A").next();
        } catch (Exception e) {
            throw new RuntimeException("Failed to load SQL file: " + fileName, e);
        }
    }
}