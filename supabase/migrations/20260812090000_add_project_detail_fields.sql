-- Fields needed by the /work/:slug project detail page.
-- All nullable: the UI renders sensible fallbacks while they're empty, so this
-- migration is safe to apply before any of the values are filled in.

ALTER TABLE projects ADD COLUMN IF NOT EXISTS service TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS timeline TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category TEXT;

COMMENT ON COLUMN projects.service IS
  'What was delivered, shown under "Service" on the detail page. Free text, comma separated. e.g. "Full Stack Development, API Design". NULL falls back to a value derived from `stack`.';

COMMENT ON COLUMN projects.timeline IS
  'How long the project took, shown under "Timeline". Free text. e.g. "4 Weeks", "3 Months". NULL hides the Timeline row.';

COMMENT ON COLUMN projects.category IS
  'Drives the Works filter tabs. One of: Web App, Mobile, E-commerce. NULL is treated as "Web App".';

-- Seed categories from what each project actually is. Safe to re-run, and
-- only fills blanks so any hand-edits in the Supabase table editor survive.
UPDATE projects SET category = 'Mobile'
  WHERE category IS NULL AND (stack::text ILIKE '%React Native%' OR name ILIKE '%platabox%');

UPDATE projects SET category = 'E-commerce'
  WHERE category IS NULL AND (
    stack::text ILIKE '%Shopify%'
    OR stack::text ILIKE '%CMS%'
    OR "desc" ILIKE '%e-commerce%'
    OR "desc" ILIKE '%store%'
  );

UPDATE projects SET category = 'Web App' WHERE category IS NULL;
