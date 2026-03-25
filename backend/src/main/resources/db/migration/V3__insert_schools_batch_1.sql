INSERT INTO schools (code, name, domain) 
VALUES 
    ('YALE', 'Yale University', 'yale.edu'),
    ('HARVARD', 'Harvard University', 'harvard.edu'),
    ('PRINCETON', 'Princeton University', 'princeton.edu')
ON CONFLICT (code) DO NOTHING;