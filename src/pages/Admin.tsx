import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User, Briefcase, GraduationCap, Award, FileText, Loader2, FolderKanban, MessageSquare } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { ProjectsManager } from '@/components/admin/ProjectsManager';
import { ExperienceManager } from '@/components/admin/ExperienceManager';
import { EducationManager } from '@/components/admin/EducationManager';
import { AchievementsManager } from '@/components/admin/AchievementsManager';
import { PublicationsManager } from '@/components/admin/PublicationsManager';
import { TestimonialsManager } from '@/components/admin/TestimonialsManager';

const Admin = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate('/login');
        return;
      }

      setUser(session.user);

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (roleData?.role !== 'admin') {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin privileges.',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    navigate('/');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'publications', label: 'Publications', icon: FileText },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6">
        <div className="mb-8">
          <a href="/" className="font-mono text-primary text-2xl">
            &lt;<span className="text-foreground">II</span>/&gt;
          </a>
          <p className="text-sm text-muted-foreground mt-2">Admin Dashboard</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium text-foreground truncate">{user?.email}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="ml-64 p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {menuItems.find((item) => item.id === activeSection)?.label}
          </h1>
          <p className="text-muted-foreground mb-8">
            Manage your portfolio content from here
          </p>

          {activeSection === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.slice(1).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="p-6 bg-card border border-border rounded-xl cursor-pointer hover:border-primary transition-colors"
                >
                  <item.icon size={24} className="text-primary mb-4" />
                  <h3 className="font-semibold text-foreground">{item.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Click to manage</p>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'projects' && <ProjectsManager />}
          {activeSection === 'experience' && <ExperienceManager />}
          {activeSection === 'education' && <EducationManager />}
          {activeSection === 'achievements' && <AchievementsManager />}
          {activeSection === 'publications' && <PublicationsManager />}
          {activeSection === 'testimonials' && <TestimonialsManager />}
        </div>
      </main>
    </div>
  );
};

export default Admin;