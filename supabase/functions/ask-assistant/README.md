# ask-assistant — Stage 2 setup

This Edge Function is what makes the AI assistant actually intelligent. It
receives a visitor's question, sends it to Gemini along with Avika's
portfolio content as grounding, and returns a plain-text answer. The Gemini
API key lives here only — never in the React frontend.

## One-time setup

1. **Get a Gemini API key** — go to https://aistudio.google.com/apikey and
   create a key (free tier is fine to start).

2. **Install the Supabase CLI** (if you don't have it):
   ```bash
   npm install -g supabase
   ```

3. **Log in and link this project** (run from the repo root):
   ```bash
   supabase login
   supabase link --project-ref ezmajvffdxswamfqxmpd
   ```
   (The project ref is the ID in `supabase/config.toml`.)

4. **Set the Gemini key as a secret** (this is the "don't put it in the
   frontend" step — the key only lives on Supabase's servers):
   ```bash
   supabase secrets set GEMINI_API_KEY=your-real-key-here
   ```

5. **Deploy the function:**
   ```bash
   supabase functions deploy ask-assistant
   ```

That's it — no changes needed on the Vercel/frontend side. The frontend
already calls this function through `supabase.functions.invoke("ask-assistant", ...)`
using the existing `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` you
already have set up for the contact form.

## Testing it

Once deployed, open the site, click "TALK TO ME", and type a question like
"What projects has Avika built?" — if everything is wired correctly you'll
get a Gemini-generated answer grounded in the portfolio content instead of
the old canned Stage 1 replies.

If the function isn't deployed yet, or the Gemini key is missing/invalid,
the assistant will silently fall back to the local Stage 1 answers (see
`src/lib/assistantKnowledge.ts`) so it never goes fully silent — but you
won't get real AI answers until this setup is done.

## If Google retires the model

This function defaults to `gemini-2.5-flash`. If Google discontinues it,
set a replacement without redeploying code:
```bash
supabase secrets set GEMINI_MODEL=gemini-3.5-flash
```
Check https://ai.google.dev/gemini-api/docs/models for current model names.
