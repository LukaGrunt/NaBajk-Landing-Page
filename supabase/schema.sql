-- =====================================================
-- NaBajk Admin Dashboard Schema
-- Run this in your Supabase SQL Editor
-- =====================================================

-- 1. ADMINS TABLE
-- Allowlist of users who can access the admin dashboard
-- =====================================================

CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);

-- RLS for admins table
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can read the admins table
CREATE POLICY "Admins can read admins table"
  ON admins
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Only existing admins can insert new admins
CREATE POLICY "Admins can insert admins"
  ON admins
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Only existing admins can delete admins
CREATE POLICY "Admins can delete admins"
  ON admins
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );


-- 2. ANNOUNCEMENTS TABLE
-- In-app announcements/popups for the mobile app
-- =====================================================

CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('sl', 'en')),
  active BOOLEAN DEFAULT false NOT NULL,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for fetching active announcements
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(active, language);
CREATE INDEX IF NOT EXISTS idx_announcements_dates ON announcements(start_date, end_date);

-- RLS for announcements table
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Public users can only read active announcements within date range
CREATE POLICY "Public can read active announcements"
  ON announcements
  FOR SELECT
  TO anon, authenticated
  USING (
    active = true
    AND (start_date IS NULL OR start_date <= NOW())
    AND (end_date IS NULL OR end_date >= NOW())
  );

-- Only admins can read all announcements (including inactive)
CREATE POLICY "Admins can read all announcements"
  ON announcements
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Only admins can insert announcements
CREATE POLICY "Admins can insert announcements"
  ON announcements
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Only admins can update announcements
CREATE POLICY "Admins can update announcements"
  ON announcements
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Only admins can delete announcements
CREATE POLICY "Admins can delete announcements"
  ON announcements
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );


-- 3. HELPER FUNCTION
-- Function to check if current user is an admin
-- =====================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. UPDATED_AT TRIGGER
-- Auto-update the updated_at column
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- 5. ROUTES TABLE
-- Cycling routes with GPX data
-- =====================================================

CREATE TABLE IF NOT EXISTS routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,                                    -- Route overview: "Kranj - Ljubljana - Medvode - Škofja Loka - Kranj"
  gpx_data TEXT,                                          -- Raw GPX file content (XML)
  distance_km NUMERIC(10, 2),                             -- Calculated from GPX
  elevation_m NUMERIC(10, 0),                             -- Elevation gain calculated from GPX
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  region TEXT NOT NULL CHECK (region IN ('gorenjska', 'dolenjska', 'stajerska', 'primorska', 'osrednja_slovenija', 'prekmurje')),
  traffic TEXT,                                           -- Optional: traffic description
  road_condition TEXT,                                    -- Optional: road quality (Kakovost ceste)
  why_good TEXT,                                          -- Optional: why is this route good (Zakaj je dobra)
  published BOOLEAN DEFAULT false NOT NULL,               -- Controls visibility to public
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for routes
CREATE INDEX IF NOT EXISTS idx_routes_region ON routes(region);
CREATE INDEX IF NOT EXISTS idx_routes_difficulty ON routes(difficulty);
CREATE INDEX IF NOT EXISTS idx_routes_published ON routes(published);

-- RLS for routes table
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

-- Public can read published routes
CREATE POLICY "Public can read published routes"
  ON routes
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Admins can read all routes
CREATE POLICY "Admins can read all routes"
  ON routes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Only admins can insert routes
CREATE POLICY "Admins can insert routes"
  ON routes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Only admins can update routes
CREATE POLICY "Admins can update routes"
  ON routes
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Only admins can delete routes
CREATE POLICY "Admins can delete routes"
  ON routes
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Auto-update updated_at for routes
CREATE TRIGGER update_routes_updated_at
  BEFORE UPDATE ON routes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- 6. GROUP RIDES TABLE
-- User-created group cycling rides
-- =====================================================

CREATE TABLE IF NOT EXISTS group_rides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,                                    -- Ride name/title
  ride_date DATE NOT NULL,                                -- Date of the ride
  ride_time TIME NOT NULL,                                -- Start time
  region TEXT NOT NULL CHECK (region IN ('gorenjska', 'dolenjska', 'stajerska', 'primorska', 'osrednja_slovenija', 'prekmurje')),
  meeting_point TEXT NOT NULL,                            -- Where to meet
  notes TEXT,                                             -- Optional additional info
  cancelled BOOLEAN DEFAULT false NOT NULL,               -- Soft delete / cancellation flag
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for group_rides
CREATE INDEX IF NOT EXISTS idx_group_rides_date ON group_rides(ride_date);
CREATE INDEX IF NOT EXISTS idx_group_rides_region ON group_rides(region);
CREATE INDEX IF NOT EXISTS idx_group_rides_cancelled ON group_rides(cancelled);

-- RLS for group_rides table
ALTER TABLE group_rides ENABLE ROW LEVEL SECURITY;

-- Public can read non-cancelled rides
CREATE POLICY "Public can read active group rides"
  ON group_rides
  FOR SELECT
  TO anon, authenticated
  USING (cancelled = false);

-- Admins can read all group rides (including cancelled)
CREATE POLICY "Admins can read all group rides"
  ON group_rides
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Authenticated users can insert group rides (users create their own rides)
CREATE POLICY "Authenticated users can insert group rides"
  ON group_rides
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Admins can update any group ride
CREATE POLICY "Admins can update group rides"
  ON group_rides
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Admins can delete group rides
CREATE POLICY "Admins can delete group rides"
  ON group_rides
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Auto-update updated_at for group_rides
CREATE TRIGGER update_group_rides_updated_at
  BEFORE UPDATE ON group_rides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- 7. RACES TABLE
-- Cycling races and events
-- =====================================================

CREATE TABLE IF NOT EXISTS races (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,                                     -- Race name
  race_date DATE NOT NULL,                                -- Date of the race
  race_type TEXT,                                         -- Type: Cestna, Kronometer, Vzpon, etc.
  region TEXT,                                            -- Optional: location/region
  link TEXT,                                              -- Optional: URL for more info
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for races
CREATE INDEX IF NOT EXISTS idx_races_date ON races(race_date);
CREATE INDEX IF NOT EXISTS idx_races_region ON races(region);

-- RLS for races table
ALTER TABLE races ENABLE ROW LEVEL SECURITY;

-- Public can read all races
CREATE POLICY "Public can read races"
  ON races
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admins can insert races
CREATE POLICY "Admins can insert races"
  ON races
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Admins can update races
CREATE POLICY "Admins can update races"
  ON races
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Admins can delete races
CREATE POLICY "Admins can delete races"
  ON races
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Auto-update updated_at for races
CREATE TRIGGER update_races_updated_at
  BEFORE UPDATE ON races
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- =====================================================
-- IMPORTANT: Add your first admin manually!
-- After creating a user via Supabase Auth, run:
--
-- INSERT INTO admins (user_id)
-- SELECT id FROM auth.users WHERE email = 'your-admin@email.com';
-- =====================================================
