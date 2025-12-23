CREATE TABLE experience (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    start_date TEXT,
    end_date TEXT,
    position TEXT NOT NULL,
    company TEXT NOT NULL,
    "desc" JSONB,
    skills JSONB,
    order_index INTEGER,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
