
import { createClient } from '@supabase/supabase-js';

// W prawdziwym projekcie te wartości powinny być w pliku .env
// Użytkownik powinien podmienić te wartości na swoje z dashboardu Supabase
const supabaseUrl = 'https://colinczaeixvvyzglkyj.supabase.co';
// Provide a fallback key to prevent "supabaseKey is required" error if env var is missing
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvbGluY3phZWl4dnZ5emdsa3lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNTcwMDIsImV4cCI6MjA4MDkzMzAwMn0.YYlV1rL1b_On2N7y-pOo_iBNHmSfCwONoY7gGuHYAGA';

export const supabase = createClient(supabaseUrl, supabaseKey);
