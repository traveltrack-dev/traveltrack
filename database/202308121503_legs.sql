CREATE TABLE IF NOT EXISTS legs (
    id serial PRIMARY KEY,
    booking_id int NOT NULL,
    operator_id int NOT NULL,
    type varchar(255) NOT NULL,
    departure_name varchar(255) NOT NULL,
    departure_iata_code varchar(3),
    departure_time timestamp NOT NULL,
    arrival_name varchar(255) NOT NULL,
    arrival_iata_code varchar(3),
    arrival_time timestamp NOT NULL,
    trip_number varchar(255),
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (operator_id) REFERENCES operators(id) ON DELETE CASCADE
);