import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Client Configuration
 * 
 * Para configurar:
 * 1. Crie um projeto em https://supabase.com
 * 2. Vá em Settings > API
 * 3. Copie a Project URL e a anon/public key
 * 4. Crie um arquivo .env na raiz do projeto com:
 *    VITE_SUPABASE_URL=https://seu-projeto.supabase.co
 *    VITE_SUPABASE_ANON_KEY=sua-anon-key
 * 
 * Para habilitar Google OAuth:
 * 1. Vá em Authentication > Providers > Google
 * 2. Habilite o provider
 * 3. Configure o Google Client ID e Secret (do Google Cloud Console)
 * 4. Adicione a Redirect URL no Google Cloud Console
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação das variáveis de ambiente
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase credentials not found. Please create a .env file with:\n' +
    'VITE_SUPABASE_URL=https://your-project.supabase.co\n' +
    'VITE_SUPABASE_ANON_KEY=your-anon-key'
  );
}

// Criar cliente Supabase
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      // Configurar o redirect URL para desenvolvimento local
      flowType: 'pkce',
    },
  }
);

// Tipos úteis exportados
export type { User, Session } from '@supabase/supabase-js';

