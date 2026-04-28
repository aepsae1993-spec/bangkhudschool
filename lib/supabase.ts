import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let _client: SupabaseClient | null = null;

/**
 * Browser/server safe client (uses anon key — read-only public data).
 * Returns null when env vars are missing so the site can still render
 * placeholder content during local development without secrets.
 */
export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!_client) {
    _client = createClient(url, anonKey, {
      auth: { persistSession: false },
    });
  }
  return _client;
}

/**
 * Service-role client — server only. Never import this from a client component.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) return null;
  return createClient(url, service, { auth: { persistSession: false } });
}

/**
 * Build the public URL for the school logo stored in Supabase Storage.
 * Convention: bucket="public-assets", path="logo/school-logo.png"
 */
export function getLogoUrl(): string | null {
  if (!url) return null;
  return `${url}/storage/v1/object/public/public-assets/logo/school-logo.png`;
}
