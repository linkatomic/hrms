import { createClient } from "@supabase/supabase-js";

// Lazy singleton — defers createClient() until first use so Next.js
// static prerendering doesn't fail when env vars aren't available at build time.
let _client = null;
const getClient = () => {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  return _client;
};

export const supabase = new Proxy({}, {
  get(_, prop) { return getClient()[prop]; },
});
