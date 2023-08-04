CREATE TABLE IF NOT EXISTS migrations (
    id serial PRIMARY KEY,
    name varchar(255) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

