import { useEffect, useState, useCallback, useRef } from 'react';
import { Quote, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import chimeArinzeAvatar from '@/assets/chime-arinze-avatar.png';

interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string | null;
  organization: string | null;
  avatar_url: string | null;
}

// Map of special avatar overrides using imported assets
const avatarOverrides: Record<string, string> = {
  'chime-arinze': chimeArinzeAvatar,
};

const getAvatarUrl = (avatarUrl: string | null): string | null => {
  if (!avatarUrl) return null;
  // Check if it's an override key
  if (avatarOverrides[avatarUrl]) {
    return avatarOverrides[avatarUrl];
  }
  // Otherwise assume it's a full URL
  return avatarUrl;
};

const AUTO_PLAY_INTERVAL = 5000; // 5 seconds

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true });
      
      setTestimonials(data || []);
      setLoading(false);
    };

    fetchTestimonials();
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  }, [testimonials.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  }, [testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (testimonials.length <= 1 || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, AUTO_PLAY_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [testimonials.length, isPaused]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  if (loading) {
    return (
      <section className="py-24">
        <div className="container mx-auto px-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const testimonial = testimonials[currentIndex];

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-label">// Client Feedback</p>
          <h2 className="text-3xl md:text-4xl font-bold">
            What People <span className="gradient-text">Say</span>
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 p-2 rounded-full bg-card border border-border hover:bg-primary/10 hover:border-primary transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 p-2 rounded-full bg-card border border-border hover:bg-primary/10 hover:border-primary transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>

          {/* Testimonial Card */}
          <div 
            className="overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="p-8 md:p-12 rounded-lg bg-card border border-border relative"
              >
                <Quote className="absolute top-6 right-6 text-primary/20" size={60} />
                <p className="text-lg md:text-xl text-muted-foreground mb-8 relative z-10 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  {getAvatarUrl(testimonial.avatar_url) ? (
                    <img 
                      src={getAvatarUrl(testimonial.avatar_url)!} 
                      alt={testimonial.author}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold text-xl">
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-lg text-foreground">{testimonial.author}</p>
                    {testimonial.role && (
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    )}
                    {testimonial.organization && (
                      <p className="text-sm text-primary">{testimonial.organization}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary w-8' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
