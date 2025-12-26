import { useNavigate, useLocation } from "react-router";
import { useAuth } from "@getmocha/users-service/react";
import {
  LayoutDashboard,
  Calendar,
  ListTodo,
  Users,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import type { AppUser } from "@/shared/types";

interface SidebarProps {
  user: AppUser;
}

export default function Sidebar({ user }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Calendar, label: "Reuniões", path: "/meetings" },
    { icon: ListTodo, label: "Sprint Board", path: "/sprints" },
    ...(user.role === "admin"
      ? [{ icon: Users, label: "Equipe", path: "/team" }]
      : []),
    { icon: Settings, label: "Configurações", path: "/settings" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">MeetSprint AI</h1>
            <p className="text-xs text-slate-500">Sistema de Reuniões</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 font-medium"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center space-x-3 mb-4 px-4">
          <img
            src={user.google_user_data.picture || ""}
            alt={user.google_user_data.name || user.email}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user.google_user_data.name || user.email}
            </p>
            <p className="text-xs text-slate-500 truncate capitalize">
              {user.role}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
