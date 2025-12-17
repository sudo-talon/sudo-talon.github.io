import { GraduationCap, Award, BookOpen } from 'lucide-react';

const education = [
  {
    icon: GraduationCap,
    title: 'Bachelor of Technology',
    subtitle: 'Computer Science',
    institution: 'Federal University of Technology Owerri',
    period: 'Aug 2006 - Jun 2012',
  },
];

const certifications = [
  {
    title: 'Introduction to Generative AI',
    issuer: 'AWS',
    year: '2025',
  },
  {
    title: 'Associate Cloud Engineer',
    issuer: 'Google Cloud',
    year: '2024',
  },
  {
    title: 'Certified Open Source Intelligence Analyst',
    issuer: 'Janes Defense, UK',
    year: '',
  },
];

const publications = [
  {
    title: 'Emergence of Cyber Caliphate and the Quest for Nigerian Army Cyber Command',
    category: 'Cybersecurity',
    link: 'https://blueprint.ng/emergence-of-cyber-caliphate-and-the-quest-for-nigerian-army-cyber-command-by-fredrick-ikerionwu/',
  },
  {
    title: 'Cyber Warfare and National Security: Imperative for Nigerian Army Preparedness',
    category: 'National Security',
    link: 'https://www.military.africa/2018/09/nigerian-army-cyber-warfare-command/',
  },
  {
    title: 'Complete End-to-End DevOps Implementation: CI/CD Pipeline with Terraform and Jenkins on AWS',
    category: 'DevOps',
    link: 'https://medium.com/@sudotalon/complete-end-to-end-devops-implementation-ci-cd-pipeline-with-terraform-and-jenkins-on-aws-to-5648f92d19eb',
  },
  {
    title: 'AI, Robotics & the Future of National Security: Why Nigeria Must Prepare for a Post-Human Labour Economy',
    category: 'AI & Future Tech',
    link: 'https://defencetimesng.africa/2025/10/ai-robotics-the-future-of-national-security-why-nigeria-must-prepare-for-a-post-human-labour-economy/',
  },
];

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
              {education.map((edu, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/20">
                    <edu.icon className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{edu.title}</h3>
                    <p className="text-primary">{edu.subtitle}</p>
                    <p className="text-sm text-muted-foreground mt-1">{edu.institution}</p>
                    <p className="text-xs text-muted-foreground">{edu.period}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-secondary border border-border flex items-center gap-4"
                >
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Award className="text-primary" size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{cert.title}</h4>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  </div>
                  {cert.year && (
                    <span className="text-xs font-mono text-primary">{cert.year}</span>
                  )}
                </div>
              ))}
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
              {publications.map((pub, index) => (
                <a
                  key={index}
                  href={pub.link}
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
                      <span className="text-xs font-mono text-primary">{pub.category}</span>
                    </div>
                  </div>
                </a>
              ))}
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
