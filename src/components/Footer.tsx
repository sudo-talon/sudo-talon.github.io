import { Mail, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono text-primary">
            &lt;<span className="text-foreground">Ikerionwu Ifeanyi Fredrick</span>/&gt;
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
            © 2025 All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <a
              href="mailto:Ikeriifeanyi@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail size={20} />
            </a>
            <a
              href="https://linkedin.com/in/ifeanyi-ikerionwu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
