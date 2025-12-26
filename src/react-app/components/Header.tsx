import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Sparkles, LogOut, User, Loader2 } from "lucide-react";
import { useAuth } from "@/react-app/contexts/AuthContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { user, isLoading, isAuthenticated, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navLinks = [
    { label: "Funcionalidades", href: "#features" },
    { label: "Preços", href: "#pricing" },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-strong border-b border-border-dark/50"
          : "bg-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-2.5 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center shadow-glow-purple/50 group-hover:shadow-glow-purple transition-shadow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-text-primary">
              MeetSprint <span className="text-gradient">AI</span>
            </span>
          </motion.a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-accent group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="flex items-center gap-2 text-text-muted">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Carregando...</span>
              </div>
            ) : isAuthenticated && user ? (
              // Logged in state
              <div className="flex items-center gap-3">
                {/* User avatar/info */}
                <motion.button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {user.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt={user.user_metadata?.full_name || 'User'} 
                      className="w-8 h-8 rounded-full ring-2 ring-border-dark"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-dark-card border border-border-dark flex items-center justify-center">
                      <User className="w-4 h-4 text-text-muted" />
                    </div>
                  )}
                  <span className="hidden sm:inline">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </motion.button>

                {/* Dashboard button */}
                <motion.button
                  onClick={() => navigate('/dashboard')}
                  className="relative text-sm font-medium text-white px-4 py-2 rounded-lg bg-gradient-accent overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-accent-purple-light to-accent-blue-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">Dashboard</span>
                </motion.button>

                {/* Logout button */}
                <motion.button
                  onClick={handleLogout}
                  className="p-2 text-text-muted hover:text-red-400 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              // Logged out state
              <>
                <motion.button
                  onClick={handleLogin}
                  className="text-sm text-text-secondary hover:text-text-primary px-4 py-2 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Login
                </motion.button>
                
                <motion.button
                  onClick={handleLogin}
                  className="relative text-sm font-medium text-white px-5 py-2.5 rounded-lg bg-gradient-accent overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Hover glow effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-accent-purple-light to-accent-blue-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">Criar Conta</span>
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
