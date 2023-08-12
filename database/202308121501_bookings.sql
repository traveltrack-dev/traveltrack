CREATE TABLE IF NOT EXISTS bookings (
    id serial PRIMARY KEY,
    plan_id int NOT NULL,
    booking_date timestamp DEFAULT CURRENT_TIMESTAMP,
    booking_code varchar(255),
    booking_price decimal(10,2),
    booking_currency varchar(3),
    booking_operator_id int NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_operator_id) REFERENCES operators(id) ON DELETE CASCADE
);