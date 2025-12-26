import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/react-app/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import Sidebar from "@/react-app/components/Sidebar";
import { 
  Calendar, 
  CheckCircle2, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  Sparkles,
  Play,
  Users,
  Video,
  Plus,
  CalendarPlus,
} from "lucide-react";
import type { Meeting, Task, DashboardMetrics } from "@/lib/database.types";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const slideUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Mini chart component
function MiniChart({ data, color }: { data: number[]; color: string }) {
  if (data.length === 0) {
    return (
      <div className="w-full h-12 flex items-center justify-center">
        <div className="w-full h-px bg-border-dark" />
      </div>
    );
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1 || 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="w-full h-12" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <polygon
        fill={`url(#gradient-${color.replace('#', '')})`}
        points={`0,100 ${points} 100,100`}
      />
    </svg>
  );
}

// Metric card component
function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  gradient, 
  chartData,
  chartColor,
  isLoading = false,
}: { 
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  gradient: string;
  chartData: number[];
  chartColor: string;
  isLoading?: boolean;
}) {
  const isPositive = change.startsWith('+');
  
  return (
    <motion.div
      className="bg-dark-card rounded-2xl border border-border-dark p-6 hover:border-border-subtle transition-all duration-300 hover-glow group"
      variants={cardVariants}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between mb-4">
        <motion.div 
          className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        {!isLoading && change && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            isPositive ? 'text-emerald-400' : change === '0%' ? 'text-text-muted' : 'text-red-400'
          }`}>
            {change !== '0%' && <ArrowUpRight className={`w-4 h-4 ${!isPositive && change !== '0%' && 'rotate-180'}`} />}
            {change}
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <p className="text-text-muted text-sm mb-1">{title}</p>
        {isLoading ? (
          <div className="h-9 w-20 bg-dark-hover rounded animate-pulse" />
        ) : (
          <p className="text-3xl font-bold text-text-primary">{value}</p>
        )}
      </div>

      {/* Mini chart */}
      <div className="opacity-60 group-hover:opacity-100 transition-opacity">
        {isLoading ? (
          <div className="h-12 bg-dark-hover rounded animate-pulse" />
        ) : (
          <MiniChart data={chartData} color={chartColor} />
        )}
      </div>
    </motion.div>
  );
}

// Empty State Component
function EmptyState({ onCreateMeeting }: { onCreateMeeting: () => void }) {
  return (
    <motion.div 
      className="bg-dark-card rounded-2xl border border-border-dark p-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="w-24 h-24 mx-auto mb-6 bg-gradient-accent rounded-3xl flex items-center justify-center shadow-glow-purple"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
      >
        <Video className="w-12 h-12 text-white" />
      </motion.div>
      
      <motion.h3 
        className="text-2xl font-bold text-text-primary mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Você ainda não tem reuniões gravadas
      </motion.h3>
      
      <motion.p 
        className="text-text-secondary mb-8 max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Comece gravando sua primeira reunião para extrair tarefas automaticamente com IA e acompanhar a produtividade da sua equipe.
      </motion.p>
      
      <motion.div 
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={onCreateMeeting}
          className="flex items-center gap-2 bg-gradient-accent text-white px-6 py-3 rounded-xl font-medium shadow-glow-purple"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          Gravar Primeira Reunião
        </motion.button>
        
        <motion.button
          className="flex items-center gap-2 bg-dark-hover text-text-primary px-6 py-3 rounded-xl font-medium border border-border-dark hover:border-accent-purple/50 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <CalendarPlus className="w-5 h-5" />
          Conectar Calendário
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// Activity item component
function ActivityItem({ 
  title, 
  time, 
  type,
  delay = 0 
}: { 
  title: string;
  time: string;
  type: 'meeting' | 'task' | 'sprint';
  delay?: number;
}) {
  const typeConfig = {
    meeting: { icon: Calendar, color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
    task: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    sprint: { icon: TrendingUp, color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
  };
  
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div 
      className="flex items-center gap-4 p-4 rounded-xl hover:bg-dark-hover transition-colors group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <div className={`w-10 h-10 ${config.bg} rounded-xl flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-text-primary text-sm font-medium truncate group-hover:text-gradient transition-all">
          {title}
        </p>
        <p className="text-text-muted text-xs">{time}</p>
      </div>
    </motion.div>
  );
}

// Format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `Há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
  if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `Há ${diffDays} dias`;
  return date.toLocaleDateString('pt-BR');
}

export default function DashboardPage() {
  const { user, profile, isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Data states
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalMeetings: 0,
    completedMeetings: 0,
    totalTasks: 0,
    completedTasks: 0,
    todoTasks: 0,
    doingTasks: 0,
    completionRate: 0,
    hoursRecorded: 0,
  });

  // Fetch meetings and tasks from Supabase
  const fetchData = useCallback(async () => {
    if (!user) return;

    setIsLoadingData(true);
    try {
      // Fetch meetings
      const { data: meetingsData, error: meetingsError } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (meetingsError) {
        console.error('Error fetching meetings:', meetingsError);
      } else {
        setMeetings(meetingsData || []);
      }

      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
      } else {
        setTasks(tasksData || []);
      }

      // Calculate metrics
      const totalMeetings = meetingsData?.length || 0;
      const completedMeetings = meetingsData?.filter(m => m.status === 'completed').length || 0;
      const totalTasks = tasksData?.length || 0;
      const completedTasks = tasksData?.filter(t => t.status === 'done').length || 0;
      const todoTasks = tasksData?.filter(t => t.status === 'todo').length || 0;
      const doingTasks = tasksData?.filter(t => t.status === 'doing').length || 0;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      const hoursRecorded = meetingsData?.reduce((acc, m) => acc + (m.duration_minutes || 0), 0) / 60 || 0;

      setMetrics({
        totalMeetings,
        completedMeetings,
        totalTasks,
        completedTasks,
        todoTasks,
        doingTasks,
        completionRate,
        hoursRecorded: Math.round(hoursRecorded),
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoadingData(false);
    }
  }, [user]);

  // Proteger rota - redirecionar se não autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch data when user is available
  useEffect(() => {
    if (user && isAuthenticated) {
      fetchData();
    }
  }, [user, isAuthenticated, fetchData]);

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="text-center">
          <motion.div 
            className="inline-block w-12 h-12 rounded-full border-2 border-accent-purple border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="mt-4 text-text-secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Carregando...
          </motion.p>
        </div>
      </div>
    );
  }

  // Se não está logado, não renderizar (vai redirecionar)
  if (!isAuthenticated || !user) {
    return null;
  }

  // Extrair dados do usuário
  const userName = profile?.full_name || 
                   user.user_metadata?.full_name || 
                   user.user_metadata?.name || 
                   user.email?.split('@')[0] || 
                   'Usuário';
  const userFirstName = userName.split(' ')[0];
  const userEmail = profile?.email || user.email || '';
  const userAvatar = profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || '';
  const userRole = profile?.role || 'member';

  // Dados do usuário para a Sidebar
  const sidebarUser = {
    email: userEmail,
    role: userRole as 'admin' | 'member',
    google_user_data: {
      name: userName,
      given_name: userFirstName,
      picture: userAvatar,
    },
  };

  // Metric cards data
  const metricCards = [
    {
      title: "Total de Reuniões",
      value: metrics.totalMeetings.toString(),
      change: metrics.totalMeetings > 0 ? "+0%" : "0%",
      icon: Calendar,
      gradient: "from-accent-purple to-accent-blue",
      chartData: meetings.slice(0, 12).map((_, i) => i + 1),
      chartColor: "#8b5cf6",
    },
    {
      title: "Tasks Concluídas",
      value: metrics.completedTasks.toString(),
      change: metrics.completedTasks > 0 ? `+${metrics.completedTasks}` : "0",
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-teal-500",
      chartData: tasks.filter(t => t.status === 'done').slice(0, 12).map((_, i) => i + 1),
      chartColor: "#10b981",
    },
    {
      title: "Taxa de Conclusão",
      value: `${metrics.completionRate}%`,
      change: metrics.completionRate > 0 ? `+${metrics.completionRate}%` : "0%",
      icon: TrendingUp,
      gradient: "from-amber-500 to-orange-500",
      chartData: [metrics.completionRate],
      chartColor: "#f59e0b",
    },
    {
      title: "Horas Gravadas",
      value: `${metrics.hoursRecorded}h`,
      change: metrics.hoursRecorded > 0 ? `+${metrics.hoursRecorded}h` : "0h",
      icon: Clock,
      gradient: "from-pink-500 to-rose-500",
      chartData: [metrics.hoursRecorded],
      chartColor: "#ec4899",
    },
  ];

  // Recent activity from meetings and tasks
  const recentActivity = [
    ...meetings.slice(0, 3).map(m => ({
      title: m.title,
      time: formatRelativeTime(m.date),
      type: 'meeting' as const,
    })),
    ...tasks.slice(0, 2).map(t => ({
      title: t.title,
      time: formatRelativeTime(t.created_at),
      type: 'task' as const,
    })),
  ].sort((a, b) => 0); // Keep original order

  const hasData = meetings.length > 0 || tasks.length > 0;

  return (
    <div className="flex h-screen bg-dark-bg">
      <Sidebar user={sidebarUser} />
      
      <main className="flex-1 overflow-y-auto relative">
        {/* Background effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-8">
          {/* Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  Olá, {userFirstName} 👋
                </h1>
                <p className="text-text-secondary">
                  {hasData 
                    ? "Aqui está o resumo da sua produtividade"
                    : "Bem-vindo ao MeetSprint AI! Vamos começar?"
                  }
                </p>
              </div>
              <motion.button
                className="flex items-center gap-2 bg-gradient-accent text-white px-5 py-3 rounded-xl font-medium shadow-glow-purple"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-4 h-4" />
                Nova Reunião
              </motion.button>
            </div>
          </motion.div>

          {/* Metrics Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {metricCards.map((metric) => (
              <MetricCard 
                key={metric.title} 
                {...metric} 
                isLoading={isLoadingData}
              />
            ))}
          </motion.div>

          {/* Main Content */}
          {!hasData && !isLoadingData ? (
            // Empty State
            <EmptyState onCreateMeeting={() => console.log('Create meeting')} />
          ) : (
            // Content Grid
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart Section */}
              <motion.div 
                className="lg:col-span-2 bg-dark-card rounded-2xl border border-border-dark p-6"
                variants={slideUpVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-text-primary">Produtividade Semanal</h2>
                    <p className="text-text-muted text-sm">Reuniões vs Tasks concluídas</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-accent-purple" />
                      Reuniões
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      Tasks
                    </span>
                  </div>
                </div>
                
                {/* Chart */}
                <div className="h-64 relative">
                  {isLoadingData ? (
                    <div className="w-full h-full bg-dark-hover rounded animate-pulse" />
                  ) : (
                    <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="chartGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      
                      {/* Grid lines */}
                      {[0, 1, 2, 3, 4].map((i) => (
                        <line
                          key={i}
                          x1="0"
                          y1={i * 50}
                          x2="400"
                          y2={i * 50}
                          stroke="#1f2937"
                          strokeWidth="1"
                        />
                      ))}
                      
                      {/* Placeholder chart when no data */}
                      {meetings.length === 0 && tasks.length === 0 ? (
                        <text x="200" y="100" textAnchor="middle" fill="#71717a" fontSize="14">
                          Dados aparecerão aqui
                        </text>
                      ) : (
                        <>
                          {/* Area 1 - Meetings */}
                          <motion.path
                            d="M0,150 C50,140 100,120 150,100 C200,80 250,90 300,70 C350,50 380,60 400,40 L400,200 L0,200 Z"
                            fill="url(#chartGradient1)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                          />
                          <motion.path
                            d="M0,150 C50,140 100,120 150,100 C200,80 250,90 300,70 C350,50 380,60 400,40"
                            fill="none"
                            stroke="#8b5cf6"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.3, duration: 1.5, ease: "easeInOut" }}
                          />
                          
                          {/* Area 2 - Tasks */}
                          <motion.path
                            d="M0,180 C50,170 100,150 150,130 C200,110 250,100 300,80 C350,60 380,50 400,30 L400,200 L0,200 Z"
                            fill="url(#chartGradient2)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 1 }}
                          />
                          <motion.path
                            d="M0,180 C50,170 100,150 150,130 C200,110 250,100 300,80 C350,60 380,50 400,30"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
                          />
                        </>
                      )}
                    </svg>
                  )}
                  
                  {/* X-axis labels */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-text-muted text-xs px-2">
                    {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day) => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div 
                className="bg-dark-card rounded-2xl border border-border-dark p-6"
                variants={slideUpVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-text-primary">Atividade Recente</h2>
                  {recentActivity.length > 0 && (
                    <button className="text-accent-purple text-sm hover:underline">Ver tudo</button>
                  )}
                </div>
                
                {isLoadingData ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-4">
                        <div className="w-10 h-10 bg-dark-hover rounded-xl animate-pulse" />
                        <div className="flex-1">
                          <div className="h-4 w-32 bg-dark-hover rounded animate-pulse mb-2" />
                          <div className="h-3 w-20 bg-dark-hover rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentActivity.length > 0 ? (
                  <div className="space-y-2">
                    {recentActivity.map((activity, index) => (
                      <ActivityItem key={index} {...activity} delay={0.3 + index * 0.1} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-text-muted mx-auto mb-3" />
                    <p className="text-text-muted text-sm">Nenhuma atividade recente</p>
                  </div>
                )}
              </motion.div>
            </div>
          )}

          {/* Quick Actions */}
          <motion.div 
            className="mt-8 bg-dark-card rounded-2xl border border-border-dark p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center shadow-glow-purple">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">
                  {hasData ? "Ações Rápidas" : "Comece Agora"}
                </h2>
                <p className="text-text-secondary">
                  {hasData 
                    ? "Gerencie suas reuniões e equipe"
                    : "Configure sua primeira reunião com IA para começar"
                  }
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <motion.button 
                className="flex items-center gap-2 bg-gradient-accent text-white py-3 px-6 rounded-xl font-medium shadow-glow-purple"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Calendar className="w-5 h-5" />
                Conectar Calendário
              </motion.button>
              <motion.button 
                className="flex items-center gap-2 bg-dark-hover text-text-primary py-3 px-6 rounded-xl font-medium border border-border-dark hover:border-accent-purple/50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Users className="w-5 h-5" />
                Convidar Equipe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
