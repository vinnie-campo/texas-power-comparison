import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Create a Supabase client for use in Client Components
 * This client runs in the browser and uses the public anon key
 *
 * @example
 * ```tsx
 * 'use client';
 * import { createClient } from '@/lib/supabase';
 *
 * export default function MyComponent() {
 *   const supabase = createClient();
 *   // Use supabase client...
 * }
 * ```
 */
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

/**
 * Create a Supabase client for use in Server Components, Server Actions, and Route Handlers
 * This client runs on the server and can access cookies for authentication
 *
 * @example
 * ```tsx
 * import { createServerClient } from '@/lib/supabase';
 *
 * export default async function MyServerComponent() {
 *   const supabase = await createServerClient();
 *   const { data } = await supabase.from('table').select('*');
 *   // Use data...
 * }
 * ```
 */
export async function createServerClient() {
  const cookieStore = await cookies();

  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        cookie: cookieStore.toString(),
      },
    },
  });
}

/**
 * Create a Supabase client for use in static generation (generateStaticParams)
 * This client runs at build time and does NOT use cookies
 *
 * @example
 * ```tsx
 * import { createStaticClient } from '@/lib/supabase';
 *
 * export async function generateStaticParams() {
 *   const supabase = createStaticClient();
 *   const { data } = await supabase.from('table').select('*');
 *   // Use data...
 * }
 * ```
 */
export function createStaticClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
