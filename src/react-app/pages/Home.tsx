import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/react-app/contexts/AuthContext";
import { motion } from "framer-motion";
import { 
  AudioWaveform, 
  ListChecks, 
  LayoutGrid, 
  ArrowRight,
  Shield,
  Play,
  Loader2
} from "lucide-react";
import Header from "@/react-app/components/Header";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Google Icon SVG Component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function HomePage() {
  const { user, isLoading, isAuthenticated, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Redirecionar para dashboard se já estiver logado
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  /**
   * Handle Google Login
   * Chama a função signInWithGoogle do contexto de autenticação
   */
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="text-center">
          <motion.div 
            className="inline-block w-10 h-10 rounded-full border-2 border-accent-purple border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: AudioWaveform,
      title: "Gravação Inteligente",
      description: "Captura automática de áudio com transcrição em tempo real powered by IA. Integração nativa com Google Meet, Zoom e Teams.",
    },
    {
      icon: ListChecks,
      title: "Extração de Action Items",
      description: "Algoritmos de NLP identificam compromissos, decisões e tarefas mencionadas. Aprovação com um clique.",
    },
    {
      icon: LayoutGrid,
      title: "Sprint Management",
      description: "Quadros Kanban gerados automaticamente. Acompanhe velocity, burndown e métricas de produtividade da equipe.",
    },
  ];

  const stats = [
    { value: "10k+", label: "Reuniões processadas" },
    { value: "98%", label: "Precisão de transcrição" },
    { value: "45min", label: "Economizados por reunião" },
  ];

  return (
    <div className="min-h-screen mesh-gradient-bg">
      {/* Grid overlay */}
      <div className="grid-overlay" />
      
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-32 pb-20">
          <motion.div 
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Enterprise Badge */}
            <motion.div 
              className="flex justify-center mb-8"
              variants={itemVariants}
            >
              <div className="badge-enterprise">
                <Shield className="w-3.5 h-3.5" />
                Enterprise-ready
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
              variants={itemVariants}
            >
              <span className="text-text-primary">Reuniões que</span>
              <br />
              <span className="text-gradient">geram resultados</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed"
              variants={itemVariants}
            >
              Transforme conversas em tarefas acionáveis com IA. 
              Grave, transcreva e extraia action items automaticamente.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              variants={itemVariants}
            >
              {/* Google Login Button - FUNCTIONAL */}
              {isAuthenticated ? (
                <motion.button
                  onClick={() => navigate('/dashboard')}
                  className="group relative flex items-center gap-3 bg-gradient-accent text-white px-6 py-4 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 glow-intense"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Ir para Dashboard</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="group relative flex items-center gap-3 bg-white text-gray-800 px-6 py-4 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 glow-intense disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <GoogleIcon className="w-5 h-5" />
                  )}
                  <span>{isLoading ? 'Conectando...' : 'Continuar com Google'}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                </motion.button>
              )}

              {/* Secondary CTA */}
              <motion.button
                className="group flex items-center gap-2 text-text-secondary hover:text-text-primary px-6 py-4 rounded-xl font-medium transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-4 h-4" />
                <span>Ver demonstração</span>
              </motion.button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div 
              className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16"
              variants={itemVariants}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-text-primary">{stat.value}</div>
                  <div className="text-sm text-text-muted">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-24">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Como funciona
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Três passos para transformar suas reuniões em produtividade mensurável
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="group relative bg-dark-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border-dark/50 hover:border-border-subtle/80 transition-all duration-500"
                  variants={cardVariants}
                  whileHover={{ y: -8 }}
                  custom={index}
                >
                  {/* Step number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-dark-bg border border-border-dark rounded-full flex items-center justify-center text-sm font-medium text-text-muted">
                    {index + 1}
                  </div>

                  {/* Icon - linha fina, profissional */}
                  <div className="w-12 h-12 rounded-xl bg-dark-hover border border-border-dark/50 flex items-center justify-center mb-6 group-hover:border-accent-purple/30 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-text-secondary group-hover:text-accent-purple transition-colors duration-300" strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Subtle hover effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-purple/5 to-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* Social Proof Section */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-border-dark/30">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-text-muted text-sm uppercase tracking-wider mb-8">
              Usado por equipes em empresas líderes
            </p>
            
            {/* Company logos placeholder */}
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-40">
              {['Empresa A', 'Empresa B', 'Empresa C', 'Empresa D', 'Empresa E'].map((company, i) => (
                <motion.div
                  key={company}
                  className="text-xl font-semibold text-text-muted"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  {company}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Final CTA */}
        <section className="max-w-4xl mx-auto px-6 py-24">
          <motion.div 
            className="relative bg-dark-card/30 backdrop-blur-sm rounded-3xl p-12 md:p-16 border border-border-dark/50 text-center overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Pronto para começar?
              </h2>
              <p className="text-text-secondary mb-8 max-w-lg mx-auto">
                Junte-se a milhares de equipes que já transformaram suas reuniões em resultados mensuráveis.
              </p>
              
              {isAuthenticated ? (
                <motion.button
                  onClick={() => navigate('/dashboard')}
                  className="group inline-flex items-center gap-3 bg-gradient-accent text-white px-8 py-4 rounded-xl font-semibold shadow-glow-purple"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Ir para Dashboard</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="group inline-flex items-center gap-3 bg-gradient-accent text-white px-8 py-4 rounded-xl font-semibold shadow-glow-purple disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{isLoading ? 'Conectando...' : 'Começar gratuitamente'}</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </motion.button>
              )}
              
              <p className="mt-4 text-text-muted text-sm">
                Sem cartão de crédito • Setup em 2 minutos
              </p>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-border-dark/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-text-muted text-sm">
              © 2024 MeetSprint AI. Todos os direitos reservados.
            </div>
            <div className="flex items-center gap-6 text-sm text-text-muted">
              <a href="#" className="hover:text-text-primary transition-colors">Termos</a>
              <a href="#" className="hover:text-text-primary transition-colors">Privacidade</a>
              <a href="#" className="hover:text-text-primary transition-colors">Contato</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
