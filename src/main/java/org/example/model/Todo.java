package org.example.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "A Todo item representing a task")
public class Todo {

    @Schema(description = "Unique identifier of the todo", example = "1")
    public int id;

    @Schema(description = "Title of the todo item", example = "Buy milk")
    public String title;

    @Schema(description = "Description of the todo item", example = "Buy milk")
    public String description;

    @Schema(description = "Completion status of the todo", example = "false")
    public boolean completed;

    @Schema(description = "Creation timestamp of the todo", example = "2025-05-20T14:30:00Z")
    public String createdAt;

    @Schema(description = "Update timestamp")
    public String updatedAt;

    @Schema(description = "Logical deletion flag")
    public boolean isDeleted;

    @Schema(description = "Version number")
    public int version;

    @Schema(description = "Deletion timestamp")
    public String deletedAt;
}
