CREATE TABLE IF NOT EXISTS booking_documents (
    id serial PRIMARY KEY,
    name varchar(255) NOT NULL,
    booking_id int NOT NULL,
    document_data bytea,
    document_type varchar(255),
    document_filename varchar(255),   
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);