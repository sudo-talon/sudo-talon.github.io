import { useEffect, useState } from 'react';
import { GraduationCap, Award, BookOpen, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface EducationItem {
  id: string;
  degree: string;
  field_of_study: string | null;
  institution: string;
  start_date: string | null;
  end_date: string | null;
}

interface PublicationItem {
  id: string;
  title: string;
  publication_type: string | null;
  publication_url: string | null;
}

interface AchievementItem {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
}

const memberships = [
  {
    name: 'Cyber Security Experts Association of Nigeria (CSEAN)',
    logo: 'https://csean.org.ng/wp-content/uploads/2020/03/csean-logo.png',
  },
  {
    name: 'Nigerian Army Resource Centre (NARC)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Nigerian_Army_logo.svg/200px-Nigerian_Army_logo.svg.png',
  },
];

export const Education = () => {
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [publications, setPublications] = useState<PublicationItem[]>([]);
  const [certifications, setCertifications] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [eduRes, pubRes, certRes] = await Promise.all([
        supabase.from('education').select('*').order('sort_order', { ascending: true }),
        supabase.from('publications').select('*').order('sort_order', { ascending: true }),
        supabase.from('achievements').select('*').eq('icon', 'certification').order('sort_order', { ascending: true }),
      ]);

      setEducation(eduRes.data || []);
      setPublications(pubRes.data || []);
      setCertifications(certRes.data || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const formatPeriod = (start: string | null, end: string | null) => {
    if (!start) return '';
    const startDate = new Date(start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!end) return startDate;
    const endDate = new Date(end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return `${startDate} - ${endDate}`;
  };

  if (loading) {
    return (
      <section id="certifications" className="py-24 bg-card">
        <div className="container mx-auto px-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section id="certifications" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        {/* Education & Certifications */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <p className="section-label">// Credentials</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Education & <span className="gradient-text">Certifications</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Education */}
            <div className="p-6 rounded-lg bg-secondary border border-border">
              {education.length > 0 ? (
                education.map((edu) => (
                  <div key={edu.id} className="flex items-start gap-4 mb-4 last:mb-0">
                    <div className="p-3 rounded-lg bg-primary/20">
                      <GraduationCap className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                      {edu.field_of_study && <p className="text-primary">{edu.field_of_study}</p>}
                      <p className="text-sm text-muted-foreground mt-1">{edu.institution}</p>
                      <p className="text-xs text-muted-foreground">{formatPeriod(edu.start_date, edu.end_date)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No education records yet.</p>
              )}
            </div>

            {/* Certifications */}
            <div className="space-y-4">
              {certifications.length > 0 ? (
                certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-lg bg-secondary border border-border flex items-center gap-4"
                  >
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Award className="text-primary" size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{cert.title}</h4>
                      {cert.description && <p className="text-sm text-muted-foreground">{cert.description}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-lg bg-secondary border border-border">
                  <p className="text-muted-foreground text-center">No certifications yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Publications & Memberships */}
        <div id="publications">
          <div className="text-center mb-16">
            <p className="section-label">// Thought Leadership</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Publications & <span className="gradient-text">Memberships</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Publications */}
            <div className="space-y-4">
              {publications.length > 0 ? (
                publications.map((pub) => (
                  <a
                    key={pub.id}
                    href={pub.publication_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg bg-secondary border border-border card-hover"
                  >
                    <div className="flex items-start gap-3">
                      <BookOpen className="text-primary mt-1 flex-shrink-0" size={18} />
                      <div>
                        <h4 className="font-medium text-foreground hover:text-primary transition-colors">
                          {pub.title}
                        </h4>
                        {pub.publication_type && (
                          <span className="text-xs font-mono text-primary">{pub.publication_type}</span>
                        )}
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <div className="p-4 rounded-lg bg-secondary border border-border">
                  <p className="text-muted-foreground text-center">No publications yet.</p>
                </div>
              )}
            </div>

            {/* Memberships */}
            <div className="p-6 rounded-lg bg-secondary border border-border">
              <h3 className="font-semibold mb-6 text-foreground">Professional Memberships</h3>
              <div className="space-y-6">
                {memberships.map((membership, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center p-2">
                      <img
                        src={membership.logo}
                        alt={membership.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <p className="text-muted-foreground">{membership.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
