CREATE TABLE projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    "desc" TEXT,
    url TEXT,
    repo_url TEXT,
    stack JSONB,
    photo_url JSONB,
    type TEXT,
    order_index INTEGER,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
