export const About = () => {
  const stats = [
    { value: '10+', label: 'Years Experience' },
    { value: 'AWS & GCP', label: 'Cloud Platforms' },
    { value: '99.9%', label: 'Uptime Achieved' },
    { value: 'Golden Star', label: 'Awards' },
  ];

  return (
    <section id="about" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Terminal Window */}
          <div className="terminal-window">
            <div className="terminal-header">
              <span className="terminal-dot bg-red-500" />
              <span className="terminal-dot bg-yellow-500" />
              <span className="terminal-dot bg-green-500" />
              <span className="ml-4 text-xs text-muted-foreground font-mono">About Ikerionwu Ifeanyi Fredrick</span>
            </div>
            <div className="terminal-content space-y-4 text-muted-foreground">
              <p>
                Award-winning IT professional with over 10 years of progressive experience 
                driving digital transformation through Web Development, Linux System 
                Administration and DevOps Engineering from a background of Cybersecurity 
              </p>
              <p>
                Recognized for architecting and securing scalable on-premise and cloud 
                infrastructures on AWS and GCP. Certified Google Cloud Associate Engineer 
                with proven track record in leading the design and implementation of CI/CD pipelines,
                Infrastructure as Code (IaC) and Kubernetes orchestration within DevSecOps environments. 
              </p>
              <p>
                Strategic thinker with a strong focus on cost optimization, compliance 
                and automation to enhance enterprise-wide efficiency. A collaborative 
                leader adept at guiding cross-functional teams to deliver high-availability, 
                secure and resilient technology solutions.
              </p>
            </div>
          </div>

          {/* About Content */}
          <div>
            <p className="section-label">// About Me</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Building <span className="gradient-text">Resilient Infrastructure</span>
            </h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="p-6 rounded-lg bg-secondary border border-border card-hover"
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
