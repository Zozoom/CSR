INSERT INTO todo (
    id, title, description, completed,
    created_at, updated_at, version,
    is_deleted, deleted_at
)
SELECT
    id, title, description, completed,
    created_at, ?, ?, 1, ?
FROM todo
WHERE id = ?
ORDER BY version DESC
    LIMIT 1