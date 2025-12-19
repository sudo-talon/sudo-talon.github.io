import { useEffect, useState } from 'react';
import { MapPin, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ExperienceItem {
  id: string;
  position: string;
  company: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean | null;
  responsibilities: string[] | null;
}

export const Experience = () => {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      const { data } = await supabase
        .from('experience')
        .select('*')
        .order('sort_order', { ascending: true });
      
      setExperiences(data || []);
      setLoading(false);
    };

    fetchExperiences();
  }, []);

  const formatDate = (startDate: string, endDate: string | null, isCurrent: boolean | null) => {
    const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (isCurrent) return `${start} – Present`;
    if (endDate) {
      const end = new Date(endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      return `${start} – ${end}`;
    }
    return start;
  };

  if (loading) {
    return (
      <section id="experience" className="py-24 bg-card">
        <div className="container mx-auto px-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (experiences.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-label">// Career Journey</p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Professional <span className="gradient-text">Experience</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="relative pl-8 pb-12 last:pb-0">
              <div className="absolute left-0 top-2 w-px h-full bg-border" />
              <div className="absolute left-0 top-2 -translate-x-1/2">
                <div className="timeline-dot" />
              </div>

              <div className="bg-secondary rounded-lg p-6 border border-border card-hover ml-4">
                <h3 className="text-xl font-bold text-foreground mb-1">{exp.position}</h3>
                <p className="text-primary font-medium mb-3">{exp.company}</p>
                
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(exp.start_date, exp.end_date, exp.is_current)}
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {exp.location}
                    </span>
                  )}
                </div>

                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="space-y-2">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground text-sm">
                        <span className="text-primary mt-1">▹</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
