DELETE FROM visit;
DELETE FROM confirmation_token;
DELETE FROM app_user;
DELETE FROM single_service;




-- Wstawianie użytkowników
INSERT INTO app_user (first_name, last_name, email, password, app_user_role, locked, enabled)
VALUES
    ('Jan', 'Kowalski', 'e1masf32f4@test.com', 'password', 'USER', false, true),
    ('Rafał', 'Brodowski', 'jan.kowalski@test.com', 'password123', 'ADMIN', false, true),
    ('Joanna', 'Śliczna', 'anna.nowak@test.com', 'password456', 'ADMIN', false, true);


-- Wstawianie serwisów
INSERT INTO single_service (name, duration_mins, price, description)
VALUES
    ('Strzyżenie męskie', 60, 50.0, 'Klasyczne strzyżenie męskie'),
    ('Strzyżenie męskie długie', 120, 80.0, 'Strzyżenie męskie nożyczkami'),
    ('Combo', 30, 25.0, 'Włosy + broda');


update app_user
set app_user_role = 'ADMIN'
WHERE email = 'piotrekzieba86@gmail.com';

select * from app_user;
select * from visit p
         where p.client.id = 3

