import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

type CallbackStatus = 'processing' | 'success' | 'error';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<CallbackStatus>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // O Supabase automaticamente processa o hash da URL
        // quando detectSessionInUrl está habilitado
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          setStatus('error');
          setErrorMessage(error.message);
          return;
        }

        if (data.session) {
          setStatus('success');
          
          // Pequeno delay para mostrar o estado de sucesso
          setTimeout(() => {
            // TODO: Verificar se o usuário tem organização
            // Se não tiver, redirecionar para onboarding
            // Por enquanto, vai direto para o dashboard
            navigate('/dashboard', { replace: true });
          }, 1000);
        } else {
          // Sem sessão, pode ser que o usuário cancelou o login
          setStatus('error');
          setErrorMessage('Nenhuma sessão encontrada. Tente fazer login novamente.');
          
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 3000);
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error);
        setStatus('error');
        setErrorMessage('Ocorreu um erro inesperado. Tente novamente.');
        
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl" />

      <motion.div 
        className="relative z-10 text-center p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {status === 'processing' && (
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-12 h-12 text-accent-purple" />
            </motion.div>
            <p className="text-text-secondary text-lg">Autenticando...</p>
            <p className="text-text-muted text-sm">Por favor, aguarde enquanto verificamos suas credenciais</p>
          </div>
        )}

        {status === 'success' && (
          <motion.div 
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <CheckCircle2 className="w-16 h-16 text-emerald-500" />
            </motion.div>
            <p className="text-text-primary text-xl font-semibold">Login realizado com sucesso!</p>
            <p className="text-text-muted text-sm">Redirecionando para o dashboard...</p>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div 
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <XCircle className="w-16 h-16 text-red-500" />
            </motion.div>
            <p className="text-text-primary text-xl font-semibold">Erro na autenticação</p>
            <p className="text-text-muted text-sm max-w-md">{errorMessage}</p>
            <motion.button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-dark-card border border-border-dark rounded-lg text-text-secondary hover:text-text-primary hover:border-border-subtle transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Voltar para Home
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
