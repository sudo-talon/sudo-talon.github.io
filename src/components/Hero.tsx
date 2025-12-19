import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Mail, Linkedin, Phone, ChevronDown } from 'lucide-react';
import profileImage from '@/assets/profile.jpeg';

const terminalCommands = [
  '$ kubectl apply -f deployment.yaml',
  '$ docker build -t app:latest .',
  '$ git push origin main',
  '$ terraform apply --auto-approve',
  '$ ansible-playbook deploy.yml',
  '$ helm upgrade --install app ./chart',
];

const roles = ['DevOps Engineer', 'SRE', 'Cloud Architect'];

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export const Hero = () => {
  const [currentCommand, setCurrentCommand] = useState(0);
  const [currentRole, setCurrentRole] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [deploymentPhase, setDeploymentPhase] = useState<'blue' | 'switching' | 'green'>('blue');
  const [trafficPercentage, setTrafficPercentage] = useState(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Initialize particles
  useEffect(() => {
    const initialParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
    }));
    setParticles(initialParticles);
  }, []);

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: ((p.x + p.speedX + 100) % 100),
        y: ((p.y + p.speedY + 100) % 100),
      })));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Terminal commands rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCommand(prev => (prev + 1) % terminalCommands.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Role rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole(prev => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Blue-Green deployment animation
  useEffect(() => {
    const cycle = () => {
      setDeploymentPhase('blue');
      setTrafficPercentage(0);
      
      setTimeout(() => {
        setDeploymentPhase('switching');
        let progress = 0;
        const switchInterval = setInterval(() => {
          progress += 5;
          setTrafficPercentage(progress);
          if (progress >= 100) {
            clearInterval(switchInterval);
            setDeploymentPhase('green');
          }
        }, 100);
      }, 3000);
      
      setTimeout(() => {
        setDeploymentPhase('blue');
        setTrafficPercentage(0);
      }, 8000);
    };

    cycle();
    const mainInterval = setInterval(cycle, 8000);
    return () => clearInterval(mainInterval);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [mouseX, mouseY]);

  const parallaxX = useTransform(springX, [0, 1], [-20, 20]);
  const parallaxY = useTransform(springY, [0, 1], [-20, 20]);

  return (
    <section
      onMouseMove={handleMouseMove}
      className="min-h-screen relative overflow-hidden flex items-center"
      style={{ background: 'radial-gradient(ellipse at top, hsl(222 47% 12%), hsl(222 47% 4%))' }}
    >
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-primary"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              x: parallaxX,
              y: parallaxY,
            }}
          />
        ))}
      </div>

      {/* SVG Data Flow Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Animated flow paths */}
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={`M ${-100 + i * 50} ${200 + i * 100} Q ${400 + i * 100} ${100 + i * 50} ${900 + i * 200} ${300 + i * 80}`}
            stroke="url(#flowGradient)"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 1.5, ease: "linear" }}
          />
        ))}
      </svg>

      {/* CI/CD Pipeline Animation */}
      <div className="absolute top-20 left-10 opacity-30 hidden lg:block">
        <div className="flex items-center gap-4">
          {['Build', 'Test', 'Deploy'].map((stage, i) => (
            <motion.div
              key={stage}
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.3 }}
            >
              <motion.div
                className="w-16 h-8 rounded border border-primary/50 flex items-center justify-center text-xs font-mono text-primary"
                animate={{
                  borderColor: ['hsl(var(--primary) / 0.3)', 'hsl(var(--primary))', 'hsl(var(--primary) / 0.3)'],
                  boxShadow: [
                    '0 0 0 0 hsl(var(--primary) / 0)',
                    '0 0 20px 2px hsl(var(--primary) / 0.3)',
                    '0 0 0 0 hsl(var(--primary) / 0)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              >
                {stage}
              </motion.div>
              {i < 2 && (
                <motion.div
                  className="w-8 h-0.5 bg-primary/30"
                  animate={{ scaleX: [0, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Terminal commands */}
        <div className="mt-6">
          {terminalCommands.map((cmd, i) => (
            <motion.div
              key={i}
              className={`font-mono text-xs transition-all duration-500 ${
                i === currentCommand ? 'text-primary opacity-100' : 'text-muted-foreground opacity-30'
              }`}
              animate={i === currentCommand ? { x: [0, 5, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {cmd}
              {i === currentCommand && (
                <motion.span
                  className="inline-block w-2 h-4 bg-primary ml-1"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Terminal Windows */}
      <motion.div
        className="absolute top-32 right-10 w-64 terminal-window opacity-40 hidden lg:block"
        style={{ x: parallaxX, y: parallaxY }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="terminal-header">
          <span className="terminal-dot bg-red-500" />
          <span className="terminal-dot bg-yellow-500" />
          <span className="terminal-dot bg-green-500" />
          <span className="ml-2 text-xs text-muted-foreground">kubernetes</span>
        </div>
        <div className="terminal-content text-xs">
          <div className="text-primary">➜ ~ kubectl get pods</div>
          <div className="mt-2 text-muted-foreground">
            <div>NAME         READY  STATUS</div>
            <motion.div
              className="text-terminal-green"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              api-prod-1   1/1   Running
            </motion.div>
            <motion.div
              className="text-terminal-green"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            >
              web-prod-2   1/1   Running
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-40 left-20 w-48 terminal-window opacity-30 hidden lg:block"
        style={{ x: useTransform(springX, [0, 1], [10, -10]), y: useTransform(springY, [0, 1], [10, -10]) }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
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
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              CPU: <span className="text-terminal-green">42%</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <motion.div
            className="order-1 lg:order-1 flex justify-center lg:justify-start"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <motion.div
                className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/30"
                animate={{
                  boxShadow: [
                    '0 0 30px 5px hsl(var(--primary) / 0.2)',
                    '0 0 60px 10px hsl(var(--primary) / 0.3)',
                    '0 0 30px 5px hsl(var(--primary) / 0.2)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ y: useTransform(springY, [0, 1], [-5, 5]) }}
              >
                <img src={profileImage} alt="Engr Ikerionwu Ifeanyi" className="w-full h-full object-cover" />
              </motion.div>
              
              {/* Blue-Green Deployment Status */}
              <motion.div
                className="absolute -bottom-2 -right-2 px-4 py-2 rounded-full flex items-center gap-3"
                style={{
                  background: deploymentPhase === 'green' 
                    ? 'rgba(34, 197, 94, 0.2)' 
                    : deploymentPhase === 'blue' 
                    ? 'rgba(59, 130, 246, 0.2)' 
                    : 'rgba(168, 85, 247, 0.2)',
                  border: `1px solid ${
                    deploymentPhase === 'green' 
                      ? 'rgb(34, 197, 94)' 
                      : deploymentPhase === 'blue' 
                      ? 'rgb(59, 130, 246)' 
                      : 'rgb(168, 85, 247)'
                  }`,
                }}
                animate={{
                  scale: deploymentPhase === 'switching' ? [1, 1.05, 1] : 1,
                }}
                transition={{ duration: 0.5, repeat: deploymentPhase === 'switching' ? Infinity : 0 }}
              >
                <span className="text-sm font-mono flex items-center gap-2">
                  <motion.span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: deploymentPhase === 'green' ? 'rgb(34, 197, 94)' : 'rgb(59, 130, 246)',
                    }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span style={{ color: deploymentPhase === 'green' ? 'rgb(34, 197, 94)' : 'rgb(59, 130, 246)' }}>
                    {deploymentPhase === 'switching' ? 'Switching...' : 'Available'}
                  </span>
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-blue-400">Blue</span>
                  <div className="w-12 h-4 rounded-full bg-muted/50 relative overflow-hidden">
                    <motion.div
                      className="absolute left-0 top-0 h-full bg-blue-500/50 rounded-full"
                      animate={{ width: `${100 - trafficPercentage}%` }}
                      transition={{ duration: 0.1 }}
                    />
                    <motion.div
                      className="absolute right-0 top-0 h-full bg-green-500/50 rounded-full"
                      animate={{ width: `${trafficPercentage}%` }}
                      transition={{ duration: 0.1 }}
                    />
                    <motion.div
                      className="absolute top-0.5 w-3 h-3 rounded-full bg-foreground"
                      animate={{ left: `${trafficPercentage}%` }}
                      style={{ transform: 'translateX(-50%)' }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <span className="text-xs text-green-400">Green</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Hero Content */}
          <motion.div
            className="order-2 lg:order-2 text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="font-mono text-muted-foreground mb-2">&gt; Hello, I'm</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Engr Ikerionwu <span className="gradient-text">Ifeanyi</span>
            </h1>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
              {roles.map((role, i) => (
                <motion.span
                  key={role}
                  className={`px-4 py-2 rounded-full font-mono text-sm transition-all duration-300 ${
                    i === currentRole
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                  animate={i === currentRole ? {
                    boxShadow: ['0 0 0 0 hsl(var(--primary) / 0)', '0 0 20px 5px hsl(var(--primary) / 0.3)', '0 0 0 0 hsl(var(--primary) / 0)'],
                  } : {}}
                  transition={{ duration: 1.5 }}
                >
                  {role}
                </motion.span>
              ))}
            </div>

            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              Award-winning IT professional bringing over a decade of experience in web development, 
              Linux system administration, and DevOps engineering, delivering digital transformation 
              solutions for the defence and security industry.
            </p>

            {/* Contact Links */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              {[
                { href: 'mailto:Ikeriifeanyi@gmail.com', icon: Mail, label: 'Email' },
                { href: 'https://linkedin.com/in/ifeanyi-ikerionwu', icon: Linkedin, label: 'LinkedIn' },
                { href: 'tel:+2348038930236', icon: Phone, label: 'Phone' },
              ].map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <link.icon size={18} />
                  <span className="text-sm">{link.label}</span>
                </motion.a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <motion.a
                href="#experience"
                className="hero-button-primary"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px 5px hsl(var(--primary) / 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                View Experience
              </motion.a>
              <motion.a
                href="#contact"
                className="hero-button-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get In Touch
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-muted-foreground text-xs">Scroll</span>
          <ChevronDown className="text-primary" size={20} />
        </motion.div>
      </div>
    </section>
  );
};