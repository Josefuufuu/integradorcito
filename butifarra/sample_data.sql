-- Demo dataset for the CADI platform.
-- Execute with: sqlite3 butifarra/db.sqlite3 < butifarra/sample_data.sql

BEGIN TRANSACTION;

-- === Users & profiles ===
INSERT OR IGNORE INTO auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined)
VALUES
    (1001, 'pbkdf2_sha256$390000$hYV8pnVwI64GwM6Y$BDNzWGqXciTzaOB1X0gbyXLrRuPcqmAlhR/apVckDTU=', NULL, 1, 'admin_cadi', 'Ana', 'Cadiz', 'admin.cadi@example.com', 1, 1, '2025-01-10 09:00:00'),
    (1002, 'pbkdf2_sha256$390000$/enNW+J06SvsQ4d1$MkitGgTUkxV5D8b2abZLe35So10zKlLuEIM/raJAJM8=', NULL, 0, 'coordinador_cadi', 'Carlos', 'Arango', 'coordinador.cadi@example.com', 1, 1, '2025-01-10 09:05:00'),
    (1003, 'pbkdf2_sha256$390000$SGjENifMwevwrEsG$5LU8iDcwx9nxlN3XSwjaAqKc5DbzQ+2eromk06GH0/k=', NULL, 0, 'beneficiario_demo', 'Laura', 'Ríos', 'beneficiario.demo@example.com', 0, 1, '2025-01-10 09:10:00');

UPDATE auth_user SET
    password='pbkdf2_sha256$390000$hYV8pnVwI64GwM6Y$BDNzWGqXciTzaOB1X0gbyXLrRuPcqmAlhR/apVckDTU=',
    first_name='Ana', last_name='Cadiz', email='admin.cadi@example.com', is_staff=1, is_superuser=1, is_active=1
WHERE username='admin_cadi';

UPDATE auth_user SET
    password='pbkdf2_sha256$390000$/enNW+J06SvsQ4d1$MkitGgTUkxV5D8b2abZLe35So10zKlLuEIM/raJAJM8=',
    first_name='Carlos', last_name='Arango', email='coordinador.cadi@example.com', is_staff=1, is_superuser=0, is_active=1
WHERE username='coordinador_cadi';

UPDATE auth_user SET
    password='pbkdf2_sha256$390000$SGjENifMwevwrEsG$5LU8iDcwx9nxlN3XSwjaAqKc5DbzQ+2eromk06GH0/k=',
    first_name='Laura', last_name='Ríos', email='beneficiario.demo@example.com', is_staff=0, is_superuser=0, is_active=1
WHERE username='beneficiario_demo';

INSERT OR REPLACE INTO actividades_userprofile (id, user_id, role) VALUES
    (2001, (SELECT id FROM auth_user WHERE username='admin_cadi'), 'ADMIN'),
    (2002, (SELECT id FROM auth_user WHERE username='coordinador_cadi'), 'COORDINATOR'),
    (2003, (SELECT id FROM auth_user WHERE username='beneficiario_demo'), 'BENEFICIARIO');

-- === Activities ===
INSERT OR IGNORE INTO actividades_activity (id, title, category, description, location, start, end, capacity, seats_taken, status, image_url, created_at, updated_at, created_by_id)
VALUES
    (3001, 'Yoga al amanecer', 'DEPORTE', 'Sesión guiada de yoga para iniciar el día con energía.', 'Terraza Bienestar', '2025-02-04 07:00:00', '2025-02-04 09:00:00', 25, 12, 'OPEN', 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, (SELECT id FROM auth_user WHERE username='admin_cadi')),
    (3002, 'Danza urbana intermedia', 'CULTURA', 'Coreografía urbana para mejorar coordinación y ritmo.', 'Salón 302-C', '2025-02-06 18:00:00', '2025-02-06 20:00:00', 30, 8, 'OPEN', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, (SELECT id FROM auth_user WHERE username='coordinador_cadi'));

INSERT OR IGNORE INTO actividades_activityenrollment (id, activity_id, user_id, status, created_at)
VALUES
    (4001, 3001, (SELECT id FROM auth_user WHERE username='beneficiario_demo'), 'CONFIRMED', CURRENT_TIMESTAMP);

-- === Tournaments ===
INSERT OR IGNORE INTO actividades_tournament (id, name, sport, format, max_teams, current_teams, start_date, end_date, description, phase, created_at, updated_at)
VALUES
    (5001, 'Liga interna de baloncesto', 'Baloncesto', 'Todos contra todos', 8, 5, '2025-02-12', '2025-03-14', 'Competencia universitaria con fase final.', 'Convocatoria', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- === Volunteer projects & registrations ===
INSERT OR IGNORE INTO actividades_volunteerproject (id, name, description, type, area, start_date, end_date, state, total_slots, confirmed_slots, location, created_at, updated_at)
VALUES
    (6001, 'Acompañamiento Mindfulness', 'Programa PSU enfocado en respiración consciente para estudiantes de primer semestre.', 'PSU', 'Bienestar emocional', '2025-02-05', '2025-04-10', 'INSCRIPCION', 40, 12, 'Sala múltiple CADI', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (6002, 'Voluntariado Hospitalario', 'Acompañamiento a pacientes pediátricos en clínicas aliadas.', 'VOLUNTARIADO', 'Proyección social', '2025-02-17', '2025-06-15', 'INSCRIPCION', 25, 5, 'Clínica Valle Salud', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO actividades_volunteerregistration (id, project_id, full_name, email, phone, created_at)
VALUES
    (7001, 6001, 'Laura Ríos', 'beneficiario.demo@example.com', '+57 320 000 0000', CURRENT_TIMESTAMP);

-- === Campaigns ===
INSERT OR IGNORE INTO actividades_communicationcampaign (id, name, message, channel, segment, scheduled_at, status, metrics_sent, metrics_opened, created_at, updated_at, created_by_id)
VALUES
    (8001, 'Nueva agenda de acompañamiento', 'Agenda abierta para citas psicológicas del mes de abril.', 'EMAIL', 'ESTUDIANTES', '2025-02-02 09:00:00', 'PROGRAMADA', 120, 86, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, (SELECT id FROM auth_user WHERE username='admin_cadi')),
    (8002, 'Convocatoria voluntariado cultural', 'Inscríbete y comparte tu talento artístico con comunidades aliadas.', 'PUSH', 'TODOS', '2025-02-06 10:00:00', 'BORRADOR', 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, (SELECT id FROM auth_user WHERE username='coordinador_cadi'));

-- === Psychological sessions ===
INSERT OR IGNORE INTO actividades_psychologicalsession (id, title, counselor, start, end, modality, available_slots, location, status, notes, created_at, updated_at)
VALUES
    (9001, 'Sesión grupal manejo del estrés', 'Psic. Diana Torres', '2025-02-03 14:00:00', '2025-02-03 15:30:00', 'PRESENCIAL', 6, 'Consultorio 2', 'DISPONIBLE', 'Traer ropa cómoda.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (9002, 'Orientación individual primeros semestres', 'Psic. Andrés Gil', '2025-02-05 10:00:00', '2025-02-05 11:00:00', 'VIRTUAL', 3, 'Microsoft Teams', 'DISPONIBLE', 'El enlace se enviará 24 horas antes.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

COMMIT;
