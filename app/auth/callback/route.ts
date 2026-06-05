import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Magic-link / PKCE callback. Supabase email links land here with a `code`
// that we exchange for a session (cookies set via @supabase/ssr).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');
  const dest = next && next.startsWith('/') ? next : '/provider/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${dest}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/acceso?error=${encodeURIComponent('No pudimos iniciar tu sesión. El enlace puede haber expirado.')}`,
  );
}
