
import { createClient } from '@supabase/supabase-js';

// W prawdziwym projekcie te wartości powinny być w pliku .env
// Użytkownik powinien podmienić te wartości na swoje z dashboardu Supabase
const supabaseUrl = 'https://colinczaeixvvyzglkyj.supabase.co';
// Provide a fallback key to prevent "supabaseKey is required" error if env var is missing
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'MISSING_SUPABASE_KEY_PLACEHOLDER';

export const supabase = createClient(supabaseUrl, supabaseKey);
