-- LexQuest schema (Supabase / Postgres). RLS: parents see own children, teachers own classes.
create table if not exists users (id uuid primary key default gen_random_uuid(), email text unique, role text check (role in ('parent','teacher')) not null, created_at timestamptz default now());
create table if not exists student_profiles (id uuid primary key default gen_random_uuid(), parent_id uuid references users(id) on delete cascade, nickname text not null, avatar text default '🦊', pin_hash text not null, xp int default 0, level int default 1, streak int default 0, last_played date, freezes int default 1, pet text default 'fox', hair text default 'curls', outfit text default 'cloak', unlocked text[] default '{woods-1}', minutes int default 0, sessions int default 0, created_at timestamptz default now());
create table if not exists classes (id uuid primary key default gen_random_uuid(), teacher_id uuid references users(id) on delete cascade, name text not null, code text unique not null);
create table if not exists class_members (class_id uuid references classes(id) on delete cascade, student_id uuid references student_profiles(id) on delete cascade, primary key (class_id, student_id));
create table if not exists skills (id text primary key, label text not null);
insert into skills (id,label) values ('phonemic-awareness','Hearing sounds'),('letter-sound','Letter sounds'),('blending','Blending sounds'),('segmenting','Breaking words apart'),('spelling','Spelling'),('fluency','Smooth reading') on conflict do nothing;
create table if not exists quests (id text primary key, region text not null, title text not null, story text, skill text references skills(id), minutes int default 12, data jsonb not null);
create table if not exists quest_items (id text primary key, quest_id text references quests(id) on delete cascade, kind text not null, skill text references skills(id), instruction text, prompt text, target text, choices jsonb, tiles jsonb, phonemes jsonb, nonsense boolean default false, hint text, passage text);
create table if not exists attempts (id bigint generated always as identity primary key, student_id uuid references student_profiles(id) on delete cascade, quest_id text, item_id text, skill text references skills(id), correct boolean, latency_ms int, hints_used int, created_at timestamptz default now());
create table if not exists skill_mastery (student_id uuid references student_profiles(id) on delete cascade, skill text references skills(id), score int default 0, updated_at timestamptz default now(), primary key (student_id, skill));
create table if not exists xp_ledger (id bigint generated always as identity primary key, student_id uuid references student_profiles(id) on delete cascade, xp int, reason text, created_at timestamptz default now());
create table if not exists badges (id text primary key, name text, desc text);
create table if not exists student_badges (student_id uuid references student_profiles(id) on delete cascade, badge_id text references badges(id), earned_at timestamptz default now(), primary key (student_id, badge_id));
create table if not exists streaks (student_id uuid primary key references student_profiles(id) on delete cascade, count int default 0, freezes int default 1, last_day date);
create table if not exists voice_sessions (id uuid primary key default gen_random_uuid(), student_id uuid references student_profiles(id) on delete cascade, turns int default 0, transcript jsonb, consented boolean default false, flagged boolean default false, created_at timestamptz default now());
create table if not exists guide_flags (id bigint generated always as identity primary key, session_id uuid references voice_sessions(id) on delete set null, reason text, created_at timestamptz default now());
create table if not exists settings (student_id uuid primary key references student_profiles(id) on delete cascade, data jsonb not null default '{}');
create table if not exists consents (parent_id uuid references users(id) on delete cascade, student_id uuid references student_profiles(id) on delete cascade, voice boolean default false, transcript boolean default false, created_at timestamptz default now(), primary key (parent_id, student_id));

alter table student_profiles enable row level security;
alter table attempts enable row level security;
alter table voice_sessions enable row level security;
-- Parents see only own children (auth.uid() = parent_id); teachers via class_members join. Service role used for demo seed.
-- Example policies (adjust to your auth mapping):
-- create policy "parent own kids" on student_profiles for all using (parent_id = auth.uid());
-- create policy "parent attempts" on attempts for all using (exists (select 1 from student_profiles s where s.id = attempts.student_id and s.parent_id = auth.uid()));
