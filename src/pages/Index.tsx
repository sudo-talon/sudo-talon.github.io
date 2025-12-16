import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Skills } from '@/components/Skills';
import { Experience } from '@/components/Experience';
import { Achievements } from '@/components/Achievements';
import { Projects } from '@/components/Projects';
import { Testimonials } from '@/components/Testimonials';
import { Education } from '@/components/Education';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Achievements />
      <Projects />
      <Testimonials />
      <Education />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
