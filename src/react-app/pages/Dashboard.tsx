import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@getmocha/users-service/react";
import Sidebar from "@/react-app/components/Sidebar";
import { LayoutDashboard } from "lucide-react";
import type { AppUser } from "@/shared/types";

export default function DashboardPage() {
  const { user, isPending } = useAuth();
  const navigate = useNavigate();
  const [appUser, setAppUser] = useState<AppUser | null>(null);

  useEffect(() => {
    if (!isPending && !user) {
      navigate("/");
      return;
    }

    if (user) {
      fetch("/api/users/me")
        .then((res) => res.json())
        .then((data) => {
          setAppUser(data);
          if (!data.org_id) {
            navigate("/onboarding");
          }
        });
    }
  }, [user, isPending, navigate]);

  if (isPending || !appUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          <p className="mt-4 text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={appUser} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-600">
              Bem-vindo de volta, {appUser.google_user_data.given_name || appUser.email}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <LayoutDashboard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total de Reuniões</p>
                    <p className="text-2xl font-bold text-slate-900">0</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <LayoutDashboard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Tasks Ativas</p>
                    <p className="text-2xl font-bold text-slate-900">0</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <LayoutDashboard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Taxa de Conclusão</p>
                    <p className="text-2xl font-bold text-slate-900">0%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Começar</h2>
            <p className="text-slate-600 mb-6">
              Configure sua primeira reunião com IA para começar a transformar conversas em tarefas acionáveis.
            </p>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-6 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all">
              Conectar Calendário
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
