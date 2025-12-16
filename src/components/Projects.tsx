import { ExternalLink, Github } from 'lucide-react';
import project1Image from '@/assets/project1.png';
import project2Image from '@/assets/project2.png';
import project3Image from '@/assets/project3.png';

const projects = [
  {
    title: 'CI/CD Pipeline with Terraform & Jenkins on AWS',
    description: 'Complete End-to-End DevOps Implementation deploying a NodeJS Application using Terraform, Jenkins, Docker, Kubernetes (EKS), Prometheus, Grafana, and ArgoCD for GitOps.',
    image: project1Image,
    technologies: ['Terraform', 'Jenkins', 'AWS EKS', 'Docker', 'Helm', 'ArgoCD', 'Prometheus', 'Grafana'],
    link: 'https://www.upwork.com/freelancers/~01959a6d6548cff4b8?p=1811493937702604800',
    highlights: [
      'Fully automated infrastructure provisioning',
      'GitOps workflow with ArgoCD',
      'Complete monitoring stack setup',
    ],
  },
  {
    title: 'AWS Infrastructure Automation',
    description: 'Comprehensive cloud infrastructure automation project implementing IaC principles with Terraform for scalable, secure, and cost-optimized AWS deployments.',
    image: project2Image,
    technologies: ['AWS', 'Terraform', 'CloudFormation', 'IAM', 'VPC', 'S3', 'RDS'],
    link: 'https://www.upwork.com/freelancers/~01959a6d6548cff4b8?p=1813513341475491840',
    highlights: [
      'Multi-region deployment strategy',
      'Security-first architecture',
      'Cost optimization implementation',
    ],
  },
  {
    title: 'Amazon Prime Clone - DevOps Project',
    description: 'End-to-end DevOps implementation for deploying an Amazon Prime Video clone using modern CI/CD practices, container orchestration, and cloud-native technologies.',
    image: project3Image,
    technologies: ['GitHub', 'Jenkins', 'SonarQube', 'Docker', 'Trivy', 'Kubernetes', 'Terraform', 'Grafana'],
    link: 'https://medium.com/@sudotalon/complete-end-to-end-devops-implementation-ci-cd-pipeline-with-terraform-and-jenkins-on-aws-to-5648f92d19eb',
    highlights: [
      'Security scanning with SonarQube & Trivy',
      'Container orchestration with EKS',
      'Comprehensive documentation on Medium',
    ],
  },
];

export const Projects = () => {
  return (
    <section id="projects" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-label">// Portfolio</p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Real-world DevOps implementations showcasing end-to-end CI/CD pipelines, 
            infrastructure automation, and cloud-native deployments
          </p>
        </div>

        <div className="space-y-12">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`grid lg:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Project Image */}
              <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="terminal-window overflow-hidden">
                  <div className="terminal-header">
                    <span className="terminal-dot bg-red-500" />
                    <span className="terminal-dot bg-yellow-500" />
                    <span className="terminal-dot bg-green-500" />
                    <span className="ml-4 text-xs text-muted-foreground font-mono">
                      project-{index + 1}.png
                    </span>
                  </div>
                  <div className="relative aspect-video">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <span className="text-xs font-mono text-primary mb-2 block">
                  Project {index + 1}
                </span>
                <h3 className="text-2xl font-bold mb-4 text-foreground">{project.title}</h3>
                <p className="text-muted-foreground mb-6">{project.description}</p>

                {/* Highlights */}
                <ul className="space-y-2 mb-6">
                  {project.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {highlight}
                    </li>
                  ))}
                </ul>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="skill-tag">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink size={16} />
                  <span>View Project Details</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
