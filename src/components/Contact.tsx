import { useState } from 'react';
import { Mail, Phone, Linkedin, MapPin, Send, Bot } from 'lucide-react';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'info@talongeeks.com',
    href: 'mailto:Ikeriifeanyi@gmail.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+234 903 985 6466',
    href: 'tel:+234 903 985 6466',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/in/ifeanyi-ikerionwu',
    href: 'https://linkedin.com/in/ifeanyi-ikerionwu',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Abuja, Nigeria',
    href: null,
  },
];

const aiResponses: Record<string, string> = {
  default: "Hi! I'm Ifeanyi's AI assistant. How can I help you today? Whether you need DevOps consulting, cloud infrastructure setup, or have questions about my services, I'm here to help!",
  devops: "I specialize in designing and implementing CI/CD pipelines, Infrastructure as Code (IaC) with Terraform, and Kubernetes orchestration. Would you like to discuss a specific project?",
  cloud: "I have extensive experience with AWS and GCP, including services like EKS, GKE, EC2, S3, and more. I can help architect scalable, secure cloud solutions for your organization.",
  consulting: "I offer consulting services for DevOps transformation, cloud migration, security implementation, and infrastructure optimization. Let's schedule a call to discuss your needs.",
  contact: "You can reach Ifeanyi directly via email at Ikeriifeanyi@gmail.com or call +234 903 985 6466. He's available for both remote and on-site engagements.",
};

export const Contact = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: aiResponses.default },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.toLowerCase();
    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    setInput('');

    // Simple keyword-based response
    setTimeout(() => {
      let response = aiResponses.default;
      if (userMessage.includes('devops') || userMessage.includes('ci/cd') || userMessage.includes('pipeline')) {
        response = aiResponses.devops;
      } else if (userMessage.includes('cloud') || userMessage.includes('aws') || userMessage.includes('gcp')) {
        response = aiResponses.cloud;
      } else if (userMessage.includes('consult') || userMessage.includes('hire') || userMessage.includes('service')) {
        response = aiResponses.consulting;
      } else if (userMessage.includes('contact') || userMessage.includes('email') || userMessage.includes('phone')) {
        response = aiResponses.contact;
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    }, 500);
  };

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-label">// Let's Connect</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Chat with my AI assistant or reach out directly. Let's discuss how I can help 
            with your DevOps and cloud infrastructure needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
            <div className="space-y-4">
              {contactInfo.map((item) => (
                <div key={item.label}>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border card-hover"
                    >
                      <div className="p-3 rounded-lg bg-primary/20">
                        <item.icon className="text-primary" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="text-foreground">{item.value}</p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border">
                      <div className="p-3 rounded-lg bg-primary/20">
                        <item.icon className="text-primary" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="text-foreground">{item.value}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Chatbot */}
          <div className="terminal-window">
            <div className="terminal-header justify-between">
              <div className="flex items-center gap-2">
                <span className="terminal-dot bg-red-500" />
                <span className="terminal-dot bg-yellow-500" />
                <span className="terminal-dot bg-green-500" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">talon-assistant.tsx</span>
              </div>
              <div className="flex items-center gap-2 text-primary text-xs">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Online
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="text-primary" size={16} />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything about DevOps, cloud, or services..."
                  className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
                <button
                  onClick={handleSend}
                  className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
