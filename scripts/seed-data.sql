-- Insert sample police stations
INSERT INTO police_stations (name, address, city, state, phone, email, latitude, longitude) VALUES
('Koramangala Police Station', 'Koramangala, Bangalore', 'Bangalore', 'Karnataka', '+91-80-25532470', 'koramangala.police@karnataka.gov.in', 12.9352, 77.6245),
('Whitefield Police Station', 'Whitefield, Bangalore', 'Bangalore', 'Karnataka', '+91-80-28452301', 'whitefield.police@karnataka.gov.in', 12.9698, 77.7500),
('Indiranagar Police Station', 'Indiranagar, Bangalore', 'Bangalore', 'Karnataka', '+91-80-25212020', 'indiranagar.police@karnataka.gov.in', 12.9719, 77.6412),
('MG Road Police Station', 'MG Road, Bangalore', 'Bangalore', 'Karnataka', '+91-80-25584242', 'mgroad.police@karnataka.gov.in', 12.9716, 77.6197),
('Electronic City Police Station', 'Electronic City, Bangalore', 'Bangalore', 'Karnataka', '+91-80-27835533', 'ecity.police@karnataka.gov.in', 12.8456, 77.6603),

-- Delhi stations
('Connaught Place Police Station', 'Connaught Place, New Delhi', 'New Delhi', 'Delhi', '+91-11-23412020', 'cp.police@delhi.gov.in', 28.6315, 77.2167),
('Karol Bagh Police Station', 'Karol Bagh, New Delhi', 'New Delhi', 'Delhi', '+91-11-25782020', 'kb.police@delhi.gov.in', 28.6519, 77.1909),

-- Mumbai stations
('Bandra Police Station', 'Bandra West, Mumbai', 'Mumbai', 'Maharashtra', '+91-22-26420020', 'bandra.police@maharashtra.gov.in', 19.0596, 72.8295),
('Andheri Police Station', 'Andheri West, Mumbai', 'Mumbai', 'Maharashtra', '+91-22-26730020', 'andheri.police@maharashtra.gov.in', 19.1136, 72.8697);

-- Create a demo police officer
INSERT INTO users (email, mobile, name, role, password_hash, state, city, badge_id, police_station, is_verified) VALUES
('officer.sharma@police.gov.in', '+919876543210', 'Officer Rajesh Sharma', 'police', '$2b$10$example_hash_here', 'Karnataka', 'Bangalore', 'KAR001', 'Koramangala Police Station', true);
