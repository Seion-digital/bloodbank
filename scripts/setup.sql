-- Create the districts table
CREATE TABLE districts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_number VARCHAR(255) NOT NULL,
    district_name VARCHAR(255) NOT NULL,
    governor_name VARCHAR(255),
    headquarters_location VARCHAR(255),
    contact_details VARCHAR(255),
    active_clubs INT,
    total_members INT
);

-- Create the users table
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(255),
    full_name VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(50),
    blood_type VARCHAR(10),
    weight INT,
    medical_conditions TEXT,
    district_id UUID REFERENCES districts(id),
    club_name VARCHAR(255),
    member_id VARCHAR(255),
    user_type VARCHAR(50),
    verification_status VARCHAR(50) DEFAULT 'pending',
    address TEXT,
    city VARCHAR(255),
    state VARCHAR(255),
    coordinates POINT,
    emergency_contact VARCHAR(255),
    preferred_hospital VARCHAR(255),
    last_donation_date DATE,
    total_donations INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    is_active BOOLEAN DEFAULT true,
    profile_image VARCHAR(255)
);

-- Create the blood_requests table
CREATE TABLE blood_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID REFERENCES users(id),
    patient_name VARCHAR(255),
    patient_age INT,
    patient_blood_type VARCHAR(10),
    medical_condition TEXT,
    urgency_level VARCHAR(50),
    units_required INT,
    units_fulfilled INT DEFAULT 0,
    hospital_name VARCHAR(255),
    hospital_address TEXT,
    hospital_contact VARCHAR(255),
    required_by_date TIMESTAMPTZ,
    special_requirements TEXT,
    status VARCHAR(50) DEFAULT 'active',
    contact_person VARCHAR(255),
    contact_number VARCHAR(255),
    district_id UUID REFERENCES districts(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    coordinates POINT
);

-- Create the donations table
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES blood_requests(id),
    donor_id UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'offered',
    donation_date DATE,
    donation_center VARCHAR(255),
    units_donated INT,
    verification_code VARCHAR(255),
    hospital_confirmation BOOLEAN DEFAULT false,
    medical_staff_id UUID,
    notes TEXT,
    created_at TIMESTAMT_Z DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create the messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id),
    receiver_id UUID REFERENCES users(id),
    request_id UUID REFERENCES blood_requests(id),
    content TEXT,
    timestamp TIMESTAMPTZ DEFAULT now(),
    is_read BOOLEAN DEFAULT false
);

-- Create the achievements table
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255),
    description TEXT,
    icon VARCHAR(255),
    threshold INT,
    category VARCHAR(50)
);

-- Create the user_achievements table
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    achievement_id UUID REFERENCES achievements(id),
    earned_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies for districts
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view all districts" ON districts FOR SELECT USING (true);

-- RLS Policies for users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public can view all users" ON users FOR SELECT USING (true);

-- RLS Policies for blood_requests
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can create blood requests" ON blood_requests FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can view their own blood requests" ON blood_requests FOR SELECT USING (auth.uid() = requester_id);
CREATE POLICY "Users can update their own blood requests" ON blood_requests FOR UPDATE USING (auth.uid() = requester_id);
CREATE POLICY "Public can view all blood_requests" ON blood_requests FOR SELECT USING (true);


-- RLS Policies for donations
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can create donations" ON donations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can view their own donations" ON donations FOR SELECT USING (auth.uid() = donor_id);
CREATE POLICY "Users can update their own donations" ON donations FOR UPDATE USING (auth.uid() = donor_id);
CREATE POLICY "Users can view donations for their requests" ON donations FOR SELECT USING (request_id IN (SELECT id FROM blood_requests WHERE requester_id = auth.uid()));

-- RLS Policies for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can view their own messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- RLS Policies for achievements
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view all achievements" ON achievements FOR SELECT USING (true);

-- RLS Policies for user_achievements
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public can view all user_achievements" ON user_achievements FOR SELECT USING (true);

-- Function to check for admin user
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT user_type
        FROM public.users
        WHERE id = auth.uid()
    ) = 'admin';
END;
$$ LANGUAGE plpgsql;

-- Admin bypass policies
CREATE POLICY "Admins can do anything" ON districts FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can do anything" ON users FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can do anything" ON blood_requests FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can do anything" ON donations FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can do anything" ON messages FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can do anything" ON achievements FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can do anything" ON user_achievements FOR ALL USING (is_admin()) WITH CHECK (is_admin());
