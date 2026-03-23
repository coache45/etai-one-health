-- ELI5 Guide Library: accessible plain-language health guides
-- Each guide has chapters stored as JSONB for flexible content structure

create table if not exists public.eli5_guides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tagline text not null default '',
  emoji text not null default '📖',
  slug text not null unique,
  category text not null default 'general',
  difficulty text not null default 'beginner' check (difficulty in ('beginner', 'intermediate', 'advanced')),
  chapters jsonb not null default '[]'::jsonb,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for public listing (published guides by category)
create index if not exists idx_eli5_guides_published on public.eli5_guides (is_published, category);
create index if not exists idx_eli5_guides_slug on public.eli5_guides (slug);

-- Auto-update updated_at
create or replace function public.update_eli5_guides_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_eli5_guides_updated_at
  before update on public.eli5_guides
  for each row
  execute function public.update_eli5_guides_updated_at();

-- RLS: anyone can read published guides, only authenticated users can write
alter table public.eli5_guides enable row level security;

create policy "Anyone can read published guides"
  on public.eli5_guides for select
  using (is_published = true);

create policy "Authenticated users can manage guides"
  on public.eli5_guides for all
  using (auth.role() = 'authenticated');

comment on table public.eli5_guides is 'ELI5 (Explain Like I''m 5) health guides with chapter-based content';
comment on column public.eli5_guides.chapters is 'JSONB array of {title, emoji, content, analogy?, steps?[]} objects';
