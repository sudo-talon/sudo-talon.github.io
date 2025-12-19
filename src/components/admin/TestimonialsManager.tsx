import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string | null;
  organization: string | null;
  sort_order: number | null;
}

export const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    quote: '',
    author: '',
    role: '',
    organization: '',
    sort_order: 0,
  });
  const { toast } = useToast();

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setTestimonials(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const testimonialData = {
      quote: formData.quote,
      author: formData.author,
      role: formData.role || null,
      organization: formData.organization || null,
      sort_order: formData.sort_order,
    };

    if (editingTestimonial) {
      const { error } = await supabase
        .from('testimonials')
        .update(testimonialData)
        .eq('id', editingTestimonial.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Testimonial updated successfully' });
      }
    } else {
      const { error } = await supabase
        .from('testimonials')
        .insert(testimonialData);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Testimonial added successfully' });
      }
    }

    setIsDialogOpen(false);
    setEditingTestimonial(null);
    setFormData({ quote: '', author: '', role: '', organization: '', sort_order: 0 });
    fetchTestimonials();
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      quote: testimonial.quote,
      author: testimonial.author,
      role: testimonial.role || '',
      organization: testimonial.organization || '',
      sort_order: testimonial.sort_order || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    const { error } = await supabase.from('testimonials').delete().eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Testimonial deleted successfully' });
      fetchTestimonials();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Client Testimonials</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingTestimonial(null);
              setFormData({ quote: '', author: '', role: '', organization: '', sort_order: 0 });
            }}>
              <Plus size={18} className="mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingTestimonial ? 'Edit' : 'Add'} Testimonial</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Quote *</label>
                <Textarea
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  required
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Author *</label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g., CTO, Director of IT"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Organization</label>
                <Input
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="e.g., Ministry of Defence"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Sort Order</label>
                <Input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingTestimonial ? 'Update' : 'Add'} Testimonial
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {testimonials.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No testimonials yet. Add your first one!</p>
        ) : (
          testimonials.map((testimonial) => (
            <div key={testimonial.id} className="p-4 bg-card border border-border rounded-lg">
              <p className="text-muted-foreground italic mb-3">"{testimonial.quote}"</p>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  {testimonial.role && <p className="text-sm text-muted-foreground">{testimonial.role}</p>}
                  {testimonial.organization && <p className="text-xs text-primary">{testimonial.organization}</p>}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(testimonial)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(testimonial.id)}>
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
