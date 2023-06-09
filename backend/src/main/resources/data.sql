DELETE FROM visit;
DELETE FROM confirmation_token;
DELETE FROM app_user;
DELETE FROM single_service;




-- Wstawianie użytkowników
INSERT INTO app_user (first_name, last_name, email, password, app_user_role, locked, enabled)
VALUES
    ('pracownik', 'rurkjo', 'e1masf32f4@test.com', 'password', 'USER', false, true),
    ('jan', 'kowalski', 'jan.kowalski@test.com', 'password123', 'ADMIN', false, true),
    ('anna', 'nowak', 'anna.nowak@test.com', 'password456', 'ADMIN', false, true);


-- Wstawianie serwisów
INSERT INTO single_service (name, duration_mins, price, description)
VALUES
    ('cut', 60, 50.0, 'We gonna cut your hair'),
    ('color', 120, 80.0, 'We gonna color your hair'),
    ('trim', 30, 25.0, 'We gonna trim your hair');



select * from app_user;
select * from visit p
         where p.client.id = 3