import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const EBOOK_SLUG = 'cyberbezpieczenstwo';

Deno.serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  const increment = Math.floor(Math.random() * 51) + 50; // 50–100

  const { error } = await supabase.rpc('increment_ebook_downloads_by', {
    p_slug: EBOOK_SLUG,
    p_amount: increment,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true, incremented_by: increment }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
