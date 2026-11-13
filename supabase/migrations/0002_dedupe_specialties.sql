-- Collapse case-insensitive duplicate specialty rows and stop them recurring.
-- Seeded lookup data accumulated near-duplicates like "Terapia de pareja" vs
-- "Terapia de Pareja". Keep one canonical row per normalized name, repoint the
-- provider_specialties links onto it, delete the orphaned rows, and add a
-- uniqueness guard. Data-agnostic (no hardcoded ids) so it is safe to re-run:
-- once deduped there is nothing left to collapse. Applied to project
-- nigjhvhpyowruhxytdpy.

-- Map every duplicate row -> the canonical row for its normalized name.
-- Canonical pick: most uppercase letters first (prefer "Terapia de Pareja"
-- over "terapia de pareja"), then lowest id for determinism.
create temporary table _spec_dupes as
select s.id as dupe_id, keep.keep_id
from specialties s
join (
  select distinct on (lower(trim(name)))
    lower(trim(name)) as key,
    id as keep_id
  from specialties
  order by
    lower(trim(name)),
    length(name) - length(regexp_replace(name, '[A-ZÁÉÍÓÚÑ]', '', 'g')) desc,
    id
) keep on lower(trim(s.name)) = keep.key
where s.id <> keep.keep_id;

-- Repoint provider links onto the canonical row, skipping any that would
-- collide with a link the provider already has.
update provider_specialties ps
set specialty_id = d.keep_id
from _spec_dupes d
where ps.specialty_id = d.dupe_id
  and not exists (
    select 1
    from provider_specialties x
    where x.provider_id = ps.provider_id
      and x.specialty_id = d.keep_id
  );

-- Drop the leftover colliding links still pointing at a duplicate row.
delete from provider_specialties ps
using _spec_dupes d
where ps.specialty_id = d.dupe_id;

-- Delete the now-orphaned duplicate specialty rows.
delete from specialties s
using _spec_dupes d
where s.id = d.dupe_id;

drop table _spec_dupes;

-- Prevent case-insensitive duplicates from being seeded again.
create unique index if not exists specialties_name_ci_key
  on specialties (lower(trim(name)));
