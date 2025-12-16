import { Award, Rocket, Server, Shield, Users, Wrench } from 'lucide-react';

const achievements = [
  {
    icon: Award,
    title: 'Golden Star Award',
    description: 'Awarded for National Security Support Through Technological Excellence',
    highlight: true,
  },
  {
    icon: Rocket,
    title: 'Founder, Talongeeks',
    description: "Africa's first defence and intelligence-focused AI company, unlocking insights from scalable & unstructured data to enable real-time actionable intelligence",
  },
  {
    icon: Server,
    title: '40% Faster Deployments',
    description: 'Reduced deployment time of client resources by optimizing CI/CD Pipelines using GitOps',
  },
  {
    icon: Shield,
    title: '99.9% Uptime',
    description: 'Achieved for production environment by implementing robust monitoring with Prometheus and Grafana',
  },
  {
    icon: Users,
    title: 'Cyber Defense',
    description: "Led a multidisciplinary team to redesign the client's official website and create and integrate its social media platforms, enhancing public engagement and civil–military relations",
  },
  {
    icon: Wrench,
    title: 'Technological Support',
    description: 'Delivered comprehensive IT solutions and digital transformation for defence and security sector clients',
  },
];

const happyClients = [
  'HQ Nigerian Army',
  'NACWC',
  'Tukur Buratai Research Centre',
  'Security Watch Africa',
  'Mrtrenergy Systems Limited',
  'Diplomatic Info',
];

export const Achievements = () => {
  return (
    <section id="achievements" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-label">// Recognition</p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Key <span className="gradient-text">Achievements</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg border card-hover ${
                achievement.highlight
                  ? 'bg-primary/10 border-primary/50'
                  : 'bg-card border-border'
              }`}
            >
              {achievement.highlight && (
                <span className="text-xs font-mono text-primary mb-2 block">Award</span>
              )}
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${achievement.highlight ? 'bg-primary/20' : 'bg-secondary'}`}>
                  <achievement.icon className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

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
