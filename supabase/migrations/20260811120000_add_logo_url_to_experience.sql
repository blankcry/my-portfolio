ALTER TABLE experience ADD COLUMN IF NOT EXISTS logo_url TEXT;

COMMENT ON COLUMN experience.logo_url IS
  'Square company logo. Absolute https URL (Supabase Storage public bucket) or a /public path. SVG or transparent PNG, at least 128x128. NULL renders a gradient monogram built from the company initials.';
