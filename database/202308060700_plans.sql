CREATE TABLE IF NOT EXISTS plans (
    id serial PRIMARY KEY,
    owner_id int NOT NULL,
    name varchar(255) NOT NULL,
    start_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    photo_data bytea,
    photo_mime_type varchar(255),
    photo_filename varchar(255),
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);