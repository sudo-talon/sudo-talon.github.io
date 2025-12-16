const skillCategories = [
  {
    title: 'Cloud & Infrastructure',
    skills: ['AWS (EC2, S3, EKS, ELB, RDS, Route53)', 'GCP (GKE, Cloud Run, Spanner)', 'VPC', 'IAM', 'CloudFormation'],
  },
  {
    title: 'Container & Orchestration',
    skills: ['Docker', 'Kubernetes', 'Docker Swarm', 'Amazon EKS', 'GKE', 'Helm'],
  },
  {
    title: 'CI/CD & Automation',
    skills: ['Jenkins', 'GitOps (Argo CD)', 'Terraform', 'Ansible', 'Chef', 'Puppet'],
  },
  {
    title: 'Monitoring & Logging',
    skills: ['Prometheus', 'Grafana', 'ELK Stack', 'Kibana', 'AWS CloudWatch', 'Filebeat'],
  },
  {
    title: 'Programming & Scripting',
    skills: ['Python', 'Bash', 'Shell Scripting', 'JavaScript', 'HTML5/CSS3', 'PHP'],
  },
  {
    title: 'Security & Networking',
    skills: ['API Gateways', 'Service Mesh', 'Encryption', 'Security Groups', 'SonarQube', 'ISO 27000'],
  },
  {
    title: 'Databases',
    skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'MariaDB', 'AWS RDS', 'DMS'],
  },
  {
    title: 'Operating Systems',
    skills: ['Linux', 'Red Hat', 'Ubuntu', 'CentOS', 'Zorin', 'Windows Server'],
  },
];

export const Skills = () => {
  return (
    <section id="skills" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-label">// Technical Expertise</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive expertise across the DevOps and Cloud Engineering stack
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category) => (
            <div
              key={category.title}
              className="p-6 rounded-lg bg-card border border-border card-hover"
            >
              <h3 className="font-semibold mb-4 text-foreground">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
