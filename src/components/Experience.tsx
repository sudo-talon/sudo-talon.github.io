import { MapPin, Calendar } from 'lucide-react';

const experiences = [
  {
    title: 'Tech Support (DevOps)',
    company: 'Ministry of Defence, Nigeria',
    location: 'Abuja',
    period: 'May 2023 – Present',
    responsibilities: [
      'Designed and implemented end-to-end CI/CD pipelines for containerization of 4-tier microservice Java application deployed on the Joint Intelligence Fusion Centre on-premise server',
      'Optimized traffic management and deployment strategies to reduce deployment time by 35%',
      'Utilized SonarQube for code quality checks, enhancing application security and ISO 27000 compliance',
      'Implemented Prometheus and Grafana for real-time monitoring to ensure operational efficiency across distributed teams',
      'Implemented collaborative tools like Slack, Confluence and Jira to streamline team workflows',
    ],
  },
  {
    title: 'Cybersecurity Consultant / Web Developer',
    company: 'Headquarters Nigerian Army',
    location: 'Abuja',
    period: 'February 2013 – April 2023',
    responsibilities: [
      "Lead a team that redesigned the client's official Website, created and integrated its constituent social media platforms for enhanced civil-military relations",
      'Architected resilient, secure on-premise infrastructures to support remote deployment of containerized microservices',
      'Led secure, multi-stage deployments using Terraform and Docker, ensuring zero downtime',
      'Managed deployment workflows via GitHub, enabling secure rollouts to GKE clusters with built-in rollback',
      "Directed the Command's web security, data backup and redundancy frameworks",
      'Secured client online digital infrastructure during Anonymous (EndSARS) cyber-attacks',
    ],
  },
];

export const Experience = () => {
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
            <div key={index} className="relative pl-8 pb-12 last:pb-0">
              {/* Timeline */}
              <div className="absolute left-0 top-2 w-px h-full bg-border" />
              <div className="absolute left-0 top-2 -translate-x-1/2">
                <div className="timeline-dot" />
              </div>

              {/* Content */}
              <div className="bg-secondary rounded-lg p-6 border border-border card-hover ml-4">
                <h3 className="text-xl font-bold text-foreground mb-1">{exp.title}</h3>
                <p className="text-primary font-medium mb-3">{exp.company}</p>
                
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {exp.period}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {exp.location}
                  </span>
                </div>

                <ul className="space-y-2">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground text-sm">
                      <span className="text-primary mt-1">▹</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
