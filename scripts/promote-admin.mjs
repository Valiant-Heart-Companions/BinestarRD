/**
 * Promote an existing user to the `admin` role.
 *
 * The user must have signed in at least once (via the magic-link flow) so that
 * their auth user + profiles row exist. This looks up the auth user by email
 * and sets their profiles.role to 'admin'.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=... node scripts/promote-admin.mjs admin@correo.com
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in the env
 * (the service role key bypasses RLS — never expose it to the browser).
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.argv[2]?.trim().toLowerCase();

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
if (!email) {
  console.error('Usage: node scripts/promote-admin.mjs <email>');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Find the auth user by email (paginate defensively).
let userId = null;
for (let page = 1; page <= 20 && !userId; page++) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
  if (error) {
    console.error('Failed to list users:', error.message);
    process.exit(1);
  }
  const match = data.users.find((u) => u.email?.toLowerCase() === email);
  if (match) userId = match.id;
  if (data.users.length < 200) break;
}

if (!userId) {
  console.error(`No user found with email ${email}. Have them sign in once first.`);
  process.exit(1);
}

const { error } = await supabase
  .from('profiles')
  .update({ role: 'admin' })
  .eq('id', userId);

if (error) {
  console.error('Failed to promote:', error.message);
  process.exit(1);
}

console.log(`✓ ${email} is now an admin.`);
