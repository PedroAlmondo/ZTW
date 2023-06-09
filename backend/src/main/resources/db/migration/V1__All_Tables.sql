-- V1__Create_Tables.sql

CREATE TABLE app_user (
                          id SERIAL PRIMARY KEY,
                          app_user_role VARCHAR(255),
                          email VARCHAR(255),
                          enabled BOOLEAN,
                          first_name VARCHAR(255),
                          last_name VARCHAR(255),
                          locked BOOLEAN,
                          password VARCHAR(255)
);

CREATE TABLE confirmation_token (
                                    id SERIAL PRIMARY KEY,
                                    confirmed_at TIMESTAMP,
                                    created_at TIMESTAMP NOT NULL,
                                    expires_at TIMESTAMP NOT NULL,
                                    token VARCHAR(255) NOT NULL,
                                    app_user_id BIGINT NOT NULL,
                                    CONSTRAINT fk_app_user
                                        FOREIGN KEY (app_user_id)
                                            REFERENCES app_user (id)
);

CREATE TABLE single_service (
                                id SERIAL PRIMARY KEY,
                                description VARCHAR(255),
                                duration_mins INT NOT NULL,
                                name VARCHAR(255),
                                price FLOAT NOT NULL
);

CREATE TABLE visit (
                       id SERIAL PRIMARY KEY,
                       start_time TIMESTAMP,
                       client BIGINT NOT NULL,
                       employee BIGINT NOT NULL,
                       service BIGINT NOT NULL,
                       CONSTRAINT fk_client
                           FOREIGN KEY (client)
                               REFERENCES app_user (id),
                       CONSTRAINT fk_employee
                           FOREIGN KEY (employee)
                               REFERENCES app_user (id),
                       CONSTRAINT fk_service
                           FOREIGN KEY (service)
                               REFERENCES single_service (id)
);

