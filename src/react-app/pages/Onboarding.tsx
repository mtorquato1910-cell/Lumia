import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Building2, Sparkles, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/react-app/contexts/AuthContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function OnboardingPage() {
  const [orgName, setOrgName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implementar criação de organização no Supabase
      // Por enquanto, apenas simula e redireciona
      console.log('Creating organization:', orgName);
      
      // Simular delay de criação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating organization:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    "Gravação automática de reuniões",
    "Transcrição com IA",
    "Geração de tarefas automática",
    "Quadros Kanban integrados",
  ];

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <motion.div 
          className="w-10 h-10 rounded-full border-2 border-accent-purple border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  // Se não está autenticado, não renderizar (vai redirecionar)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl" />

      <motion.div 
        className="relative z-10 w-full max-w-lg px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Card */}
        <motion.div 
          className="glass-strong rounded-3xl border border-border-dark p-8 shadow-2xl"
          variants={itemVariants}
        >
          {/* Logo */}
          <motion.div 
            className="flex items-center justify-center mb-8"
            variants={itemVariants}
          >
            <div className="relative">
              <motion.div 
                className="w-20 h-20 bg-gradient-accent rounded-2xl flex items-center justify-center shadow-glow-purple"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-accent opacity-20 blur-xl animate-pulse" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <h1 className="text-3xl font-bold text-gradient mb-3">
              Bem-vindo, {user?.user_metadata?.full_name?.split(' ')[0] || 'Usuário'}!
            </h1>
            <p className="text-text-secondary">
              Vamos configurar sua organização para começar
            </p>
          </motion.div>

          {/* Features list */}
          <motion.div 
            className="mb-8 space-y-3"
            variants={itemVariants}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={feature}
                className="flex items-center gap-3 text-text-secondary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-accent flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm">{feature}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.form 
            onSubmit={handleCreateOrg} 
            className="space-y-6"
            variants={itemVariants}
          >
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Nome da Organização
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building2 className="w-5 h-5 text-text-muted" />
                </div>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Ex: Minha Empresa"
                  className="w-full pl-12 pr-4 py-4 bg-dark-card border border-border-dark rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 transition-all"
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading || !orgName.trim()}
              className="group w-full relative bg-gradient-accent text-white py-4 px-6 rounded-xl font-semibold shadow-glow-purple overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {/* Animated gradient overlay */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-accent-purple-light to-accent-blue-light opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <motion.div 
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Criando...
                  </>
                ) : (
                  <>
                    Criar Organização
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.p 
            className="text-center text-text-muted text-xs mt-6"
            variants={itemVariants}
          >
            Ao continuar, você concorda com nossos{" "}
            <a href="#" className="text-accent-purple hover:underline">Termos de Uso</a>
            {" "}e{" "}
            <a href="#" className="text-accent-purple hover:underline">Política de Privacidade</a>
          </motion.p>
        </motion.div>

        {/* Bottom decoration */}
        <motion.div 
          className="flex justify-center mt-8 gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="w-8 h-1 rounded-full bg-accent-purple" />
          <div className="w-8 h-1 rounded-full bg-border-dark" />
          <div className="w-8 h-1 rounded-full bg-border-dark" />
        </motion.div>
      </motion.div>
    </div>
  );
}
