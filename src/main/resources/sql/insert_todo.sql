INSERT INTO todo (
    id, title, description, completed,
    created_at, updated_at, version,
    is_deleted, deleted_at
)
VALUES (?, ?, ?, ?, ?, ?, ?, 0, toDateTime(0))