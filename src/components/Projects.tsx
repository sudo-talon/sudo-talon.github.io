import { ExternalLink, Github } from 'lucide-react';
import project1Image from '@/assets/project1.png';
import project2Image from '@/assets/project2.png';
import project3Image from '@/assets/project3.png';

const projects = [
  {
    title: 'Upwork: DevOps engagement',
    description: 'Engagement details and deliverables available on the Upwork project page.',
    image: project1Image,
    technologies: ['DevOps', 'Consulting', 'Upwork'],
    link: 'https://www.upwork.com/freelancers/~01959a6d6548cff4b8?p=1811493937702604800',
    highlights: [
      'Process optimization and CI/CD guidance',
      'On-demand DevOps consulting',
      'Deliverables documented on Upwork',
    ],
  },
  {
    title: 'Upwork: CI/CD pipeline work',
    description: 'Highlights from a CI/CD implementation documented on Upwork work history.',
    image: project2Image,
    technologies: ['CI/CD', 'Jenkins', 'GitOps'],
    link: 'https://www.upwork.com/freelancers/~01959a6d6548cff4b8?p=1813513341475491840',
    highlights: [
      'Fully automated infrastructure provisioning',
      'GitOps workflow with ArgoCD',
      'Complete monitoring stack setup',
    ],
  },
  {
    title: 'Medium: End-to-end DevOps CI/CD with Terraform and Jenkins on AWS',
    description: 'Case study documenting a complete CI/CD pipeline and cloud-native tooling.',
    image: project3Image,
    technologies: ['Terraform', 'AWS', 'Jenkins'],
    link: 'https://medium.com/@sudotalon/complete-end-to-end-devops-implementation-ci-cd-pipeline-with-terraform-and-jenkins-on-aws-to-5648f92d19eb',
    highlights: [
      'Infrastructure as Code with Terraform',
      'CI/CD orchestration via Jenkins',
      'Monitoring and observability with Prometheus & Grafana',
    ],
  },
  {
    title: 'Comprehensive Malware Scan, Removal and Restoration (Big Database)',
    description: 'The blog was recently compromised by malware, affecting its functionality, security, and user experience with pages and links not opening, others redirecting to strange websites. The project includes malware removal, website restoration, security hardening, and performance optimization.',
    image: project1Image,
    technologies: ['SQL', 'phpMyAdmin', 'FTP', 'Database Management', 'WordPress'],
    link: 'https://example.com/',
    highlights: [
      'Malware scan and removal',
      'Site restoration and link fix',
      'Security hardening and patching',
      'Performance optimization',
    ],
    publishedDate: 'Jul 11, 2024',
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
                <div className="flex items-center gap-4">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink size={16} />
                    <span>View Project Details</span>
                  </a>
                  {(project as any).publishedDate && (
                    <span className="text-xs text-muted-foreground">
                      Published {(project as any).publishedDate}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
