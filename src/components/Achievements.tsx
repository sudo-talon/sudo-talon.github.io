import { useEffect, useState } from 'react';
import { Award, Rocket, Server, Shield, Users, Wrench, Loader2, LucideIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AchievementItem {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
}

const iconMap: Record<string, LucideIcon> = {
  award: Award,
  rocket: Rocket,
  server: Server,
  shield: Shield,
  users: Users,
  wrench: Wrench,
};

const happyClients = [
  'HQ Nigerian Army',
  'NACWC',
  'Tukur Buratai Research Centre',
  'Security Watch Africa',
  'Mrtrenergy Systems Limited',
  'Diplomatic Info',
];

export const Achievements = () => {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      const { data } = await supabase
        .from('achievements')
        .select('*')
        .neq('icon', 'certification')
        .order('sort_order', { ascending: true });
      
      setAchievements(data || []);
      setLoading(false);
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <section id="achievements" className="py-24">
        <div className="container mx-auto px-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section id="achievements" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-label">// Recognition</p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Key <span className="gradient-text">Achievements</span>
          </h2>
        </div>

        {achievements.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {achievements.map((achievement) => {
              const IconComponent = iconMap[achievement.icon || 'award'] || Award;
              const isHighlight = achievement.icon === 'award';
              
              return (
                <div
                  key={achievement.id}
                  className={`p-6 rounded-lg border card-hover ${
                    isHighlight
                      ? 'bg-primary/10 border-primary/50'
                      : 'bg-card border-border'
                  }`}
                >
                  {isHighlight && (
                    <span className="text-xs font-mono text-primary mb-2 block">Award</span>
                  )}
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${isHighlight ? 'bg-primary/20' : 'bg-secondary'}`}>
                      <IconComponent className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{achievement.title}</h3>
                      {achievement.description && (
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Happy Clients */}
        <div className="bg-card rounded-lg p-8 border border-border">
          <h3 className="text-xl font-semibold mb-6 text-center">Happy Clients</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {happyClients.map((client) => (
              <span
                key={client}
                className="px-4 py-2 bg-secondary rounded-lg text-sm text-muted-foreground border border-border"
              >
                {client}
              </span>
            ))}
            <span className="px-4 py-2 bg-secondary rounded-lg text-sm text-muted-foreground border border-border">
              etc.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
