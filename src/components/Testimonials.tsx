import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Ifeanyi's expertise in DevOps and cloud infrastructure transformed our deployment processes. His implementation of CI/CD pipelines reduced our deployment time by 40% while improving system reliability.",
    author: 'Lt. Col. A. Ibrahim',
    role: 'Director of IT Operations',
    organization: 'Ministry of Defence',
  },
  {
    quote: "Working with Ifeanyi on our digital transformation project was exceptional. His deep understanding of security protocols and cloud architecture helped us achieve ISO 27000 compliance seamlessly.",
    author: 'Brig. Gen. M. Usman',
    role: 'Chief Information Officer',
    organization: 'Nigerian Army HQ',
  },
  {
    quote: "The infrastructure automation solutions delivered by Ifeanyi exceeded our expectations. His proactive approach to monitoring and security has been invaluable to our operations.",
    author: 'Dr. O. Adeyemi',
    role: 'CEO',
    organization: 'Security Watch Africa',
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-label">// Client Feedback</p>
          <h2 className="text-3xl md:text-4xl font-bold">
            What People <span className="gradient-text">Say</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-8 rounded-lg bg-card border border-border card-hover relative"
            >
              <Quote className="absolute top-6 right-6 text-primary/20" size={40} />
              <p className="text-muted-foreground mb-6 relative z-10">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-xs text-primary">{testimonial.organization}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
