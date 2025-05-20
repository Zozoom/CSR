package org.example.controllers;

import org.example.model.Todo;
import org.example.utility.SqlLoader;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/todos")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "TODOs", description = "CRUD operations for TODO items")
public class TodoController {

    public static final String GET_MAX_ID = "SELECT MAX(id) FROM todo";

    @Autowired
    private JdbcTemplate jdbc;

    private int nextId() {
        Integer max = jdbc.queryForObject(GET_MAX_ID, Integer.class);
        return (max == null ? 1 : max + 1);
    }

    private String getTimeStampNow() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    @GetMapping
    @Operation(summary = "List active TODOs")
    public List<Map<String, Object>> listTodos() {
        String sql = SqlLoader.load("list_active_todos.sql");
        return jdbc.queryForList(sql);
    }

    @PostMapping
    @Operation(summary = "Create a new TODO")
    public ResponseEntity<String> createTodo(@RequestBody Todo t) {
        int id = nextId();
        String timestamp = getTimeStampNow();

        String sql = SqlLoader.load("insert_todo.sql");
        jdbc.update(sql, id, t.title, t.description, t.completed ? 1 : 0, timestamp, timestamp, 1);
        return ResponseEntity.status(HttpStatus.CREATED).body("TODO created with id " + id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a TODO")
    public ResponseEntity<String> updateTodo(@PathVariable int id, @RequestBody Todo t) {
        String timestamp = getTimeStampNow();
        Integer currentVersion = jdbc.queryForObject(SqlLoader.load("get_max_version.sql"), Integer.class, id);
        int newVersion = currentVersion + 1;

        String sql = SqlLoader.load("update_todo.sql");
        jdbc.update(sql, t.title, t.description, t.completed ? 1 : 0, timestamp, newVersion, id);
        return ResponseEntity.ok("TODO updated");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Logically delete a TODO")
    public ResponseEntity<String> deleteTodo(@PathVariable int id) {
        String timestamp = getTimeStampNow();
        Integer currentVersion = jdbc.queryForObject(SqlLoader.load("get_max_version.sql"), Integer.class, id);
        int newVersion = currentVersion + 1;

        String sql = SqlLoader.load("delete_todo.sql");
        jdbc.update(sql, timestamp, newVersion, timestamp, id);
        return ResponseEntity.ok("TODO logically deleted");
    }
}
