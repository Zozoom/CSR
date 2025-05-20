DROP TABLE IF EXISTS todo;

CREATE TABLE todo (
                      id UInt32,
                      title String,
                      description String,
                      completed UInt8,
                      created_at DateTime,
                      updated_at DateTime,
                      deleted_at DateTime DEFAULT toDateTime(0),
                      version UInt32,
                      is_deleted UInt8 DEFAULT 0
) ENGINE = ReplacingMergeTree(updated_at)
ORDER BY id;