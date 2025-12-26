import { useNavigate, useLocation } from "react-router";
import { useAuth } from "@/react-app/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  ListTodo,
  Users,
  Settings,
  LogOut,
  Sparkles,
  User,
} from "lucide-react";

// Tipo para o usuário da sidebar (compatível com profile do Supabase)
interface SidebarUser {
  email: string;
  role: 'admin' | 'member';
  google_user_data: {
    name?: string;
    given_name?: string;
    picture?: string;
  };
}

interface SidebarProps {
  user: SidebarUser;
}

export default function Sidebar({ user }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, profile } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Usar dados do profile se disponível, senão usar props
  const displayName = profile?.full_name || user.google_user_data.name || user.email;
  const displayAvatar = profile?.avatar_url || user.google_user_data.picture;
  const displayRole = profile?.role || user.role;

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Calendar, label: "Reuniões", path: "/meetings" },
    { icon: ListTodo, label: "Sprint Board", path: "/sprints" },
    ...(displayRole === "admin"
      ? [{ icon: Users, label: "Equipe", path: "/team" }]
      : []),
    { icon: Settings, label: "Configurações", path: "/settings" },
  ];

  return (
    <aside className="w-64 glass-strong border-r border-border-dark flex flex-col relative z-10">
      {/* Logo / Branding */}
      <div className="p-6 border-b border-border-dark">
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center shadow-glow-purple">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gradient">MeetSprint AI</h1>
            <p className="text-xs text-text-muted">Sistema de Reuniões</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <motion.li 
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive
                      ? "bg-gradient-accent text-white font-medium shadow-glow-purple"
                      : "text-text-secondary hover:text-text-primary hover:bg-dark-hover"
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${
                    isActive ? "" : "group-hover:scale-110"
                  }`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-0 w-1 h-6 bg-gradient-to-b from-accent-purple to-accent-blue rounded-l-full"
                    />
                  )}
                </button>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border-dark">
        <motion.div 
          className="flex items-center space-x-3 mb-4 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative">
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-10 h-10 rounded-full ring-2 ring-border-dark object-cover"
                onError={(e) => {
                  // Fallback se a imagem falhar
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-10 h-10 rounded-full bg-dark-card border border-border-dark flex items-center justify-center ${displayAvatar ? 'hidden' : ''}`}>
              <User className="w-5 h-5 text-text-muted" />
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-dark-card" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {displayName}
            </p>
            <p className="text-xs text-text-muted truncate capitalize flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-accent inline-block" />
              {displayRole}
            </p>
          </div>
        </motion.div>
        
        <motion.button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
          <span>Sair</span>
        </motion.button>
      </div>
    </aside>
  );
}
