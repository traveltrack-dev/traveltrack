CREATE TABLE IF NOT EXISTS stays (
    id serial PRIMARY KEY,
    booking_id int NOT NULL,
    operator_id int NOT NULL,
    type varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    address varchar(255),
    arrival_time timestamp NOT NULL,
    departure_time timestamp NOT NULL,
    accommodation varchar(255),
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (operator_id) REFERENCES operators(id) ON DELETE CASCADE
);