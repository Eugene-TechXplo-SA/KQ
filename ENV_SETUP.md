# Environment Configuration - Fixed

## Issue
Getting "Supabase client not initialized" errors during login/signup.

## Root Cause
The Supabase client was trying to initialize during server-side rendering (SSR) in Next.js, but `process.env.NEXT_PUBLIC_*` variables weren't available in the SSR context.

## Solution
Changed to lazy initialization pattern with `getSupabase()` function that only initializes the client when actually called (in browser context).

## Changes Made

### 1. Supabase Client (`apps/web/lib/supabaseClient.ts`)
```typescript
// Lazy initialization - client only created when getSupabase() is called
let supabaseInstance: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance
  }
  // ... initialize client
  return supabaseInstance
}

// Export for compatibility - only initializes in browser
export const supabase = typeof window !== 'undefined' ? getSupabase() : null as any
```

### 2. Updated All Imports
- `lib/authApi.ts` - Uses `getSupabase()`
- `lib/requireAuth.ts` - Uses `getSupabase()`
- `app/layout.jsx` - Uses `getSupabase()`
- `components/auth/LoginOverlay.jsx` - Uses `getSupabase()`

### 3. Environment Files

**API (.env)**
```
SUPABASE_URL=https://igsfzfkncnocanoedpee.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_DB_URL=postgresql://postgres.igsfzfkncnocanoedpee:...
JWT_SECRET=your-BoJiLENsT...
PORT=8787
```

**Web (.env)**
```
NEXT_PUBLIC_SUPABASE_URL=https://igsfzfkncnocanoedpee.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_API_URL=http://localhost:8787
```

## Verification

### Build Test
```bash
npm run build
# ✓ All 5 tasks successful
# ✓ Web app builds without errors
# ✓ API builds successfully
```

### Expected Behavior
- Login form should now work without "client not initialized" errors
- Signup form should work properly
- Auth state changes are tracked correctly
- Session persistence works in browser

## How It Works

1. When user visits page, `supabase` export is `null` during SSR
2. When client-side code runs, `getSupabase()` is called
3. Function checks for existing instance (singleton pattern)
4. If not exists, creates new client with env vars
5. Returns the same instance for all future calls

This ensures:
- No SSR errors from missing env vars
- Client only created once (performance)
- All components use same client instance
- Works with Next.js rendering model
