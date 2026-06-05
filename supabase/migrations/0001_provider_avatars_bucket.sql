-- Storage bucket for provider profile photos.
-- Public read (photos appear on public profiles); writes are scoped by RLS to
-- the owner's own auth.uid() folder. Applied to project nigjhvhpyowruhxytdpy.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'provider-avatars',
  'provider-avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "provider avatars public read"
  on storage.objects for select
  using (bucket_id = 'provider-avatars');

create policy "provider avatars owner insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'provider-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "provider avatars owner update"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'provider-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'provider-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "provider avatars owner delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'provider-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
