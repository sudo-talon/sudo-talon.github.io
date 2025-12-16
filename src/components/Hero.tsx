import { useEffect, useState } from 'react';
import { Mail, Linkedin, Phone, ChevronDown } from 'lucide-react';
import profileImage from '@/assets/profile.jpeg';

const terminalCommands = [
  '$ kubectl apply -f',
  '$ docker build -t',
  '$ git push origin',
  '$ terraform plan',
  '$ ansible-playbook',
  '$ helm upgrade',
];

const roles = ['DevOps Engineer', 'SRE', 'Cloud Architect'];

export const Hero = () => {
  const [currentCommand, setCurrentCommand] = useState(0);
  const [currentRole, setCurrentRole] = useState(0);

  useEffect(() => {
    const commandInterval = setInterval(() => {
      setCurrentCommand((prev) => (prev + 1) % terminalCommands.length);
    }, 2000);
    return () => clearInterval(commandInterval);
  }, []);

  useEffect(() => {
    const roleInterval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(roleInterval);
  }, []);

  return (
    <section className="min-h-screen relative overflow-hidden flex items-center" style={{ background: 'radial-gradient(ellipse at top, hsl(222 47% 12%), hsl(222 47% 4%))' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 opacity-20">
          {terminalCommands.map((cmd, i) => (
            <div
              key={i}
              className={`font-mono text-xs text-primary transition-opacity duration-500 ${
                i === currentCommand ? 'opacity-100' : 'opacity-30'
              }`}
            >
              {cmd}
              {i === currentCommand && <span className="typing-cursor" />}
            </div>
          ))}
        </div>

        {/* Floating terminal windows */}
        <div className="absolute top-32 right-10 w-64 terminal-window opacity-30 hidden lg:block">
          <div className="terminal-header">
            <span className="terminal-dot bg-red-500" />
            <span className="terminal-dot bg-yellow-500" />
            <span className="terminal-dot bg-green-500" />
            <span className="ml-2 text-xs text-muted-foreground">terminal</span>
          </div>
          <div className="terminal-content text-xs">
            <div className="text-primary">➜ ~ kubectl get pods</div>
            <div className="mt-2 text-muted-foreground">
              <div>NAME         READY  STATUS</div>
              <div className="text-terminal-green">api-prod-1   1/1   Running</div>
              <div className="text-terminal-green">web-prod-2   1/1   Running</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-40 left-20 w-48 terminal-window opacity-20 hidden lg:block">
          <div className="terminal-header">
            <span className="terminal-dot bg-red-500" />
            <span className="terminal-dot bg-yellow-500" />
            <span className="terminal-dot bg-green-500" />
          </div>
          <div className="terminal-content text-xs">
            <div className="text-muted-foreground">CLUSTER STATUS</div>
            <div className="mt-2">
              <div>Nodes: <span className="text-primary">12/12</span></div>
              <div>Pods: <span className="text-primary">156 active</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/30 glow-border animate-float">
                <img
                  src={profileImage}
                  alt="Ifeanyi Ikerionwu"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 px-4 py-2 bg-terminal-green/20 border border-terminal-green rounded-full">
                <span className="text-terminal-green text-sm font-mono flex items-center gap-2">
                  <span className="w-2 h-2 bg-terminal-green rounded-full animate-pulse" />
                  Available
                </span>
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <p className="font-mono text-muted-foreground mb-2">&gt; Hello, I'm</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">Ikerionwu Ifeanyi</span>
            </h1>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
              {roles.map((role, i) => (
                <span
                  key={role}
                  className={`px-4 py-2 rounded-full font-mono text-sm transition-all duration-300 ${
                    i === currentRole
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {role}
                </span>
              ))}
            </div>

            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              Award-winning IT professional bringing over a decade of experience in web development, 
              Linux system administration, and DevOps engineering, delivering digital transformation 
              solutions for the defence and security industry.
            </p>

            {/* Contact Links */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              <a
                href="mailto:Ikeriifeanyi@gmail.com"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail size={18} />
                <span className="text-sm">Email</span>
              </a>
              <a
                href="https://linkedin.com/in/ifeanyi-ikerionwu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin size={18} />
                <span className="text-sm">LinkedIn</span>
              </a>
              <a
                href="tel:+2348038930236"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone size={18} />
                <span className="text-sm">Phone</span>
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <a href="#experience" className="hero-button-primary">
                View Experience
              </a>
              <a href="#contact" className="hero-button-secondary">
                Get In Touch
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-muted-foreground text-xs">Scroll</span>
          <ChevronDown className="text-primary" size={20} />
        </div>
      </div>
    </section>
  );
};
