import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  responsibilities: string[] | null;
  sort_order: number;
}

export const ExperienceManager = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    responsibilities: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch experiences', variant: 'destructive' });
    } else {
      setExperiences(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const expData = {
      company: formData.company,
      position: formData.position,
      location: formData.location || null,
      start_date: formData.start_date,
      end_date: formData.is_current ? null : (formData.end_date || null),
      is_current: formData.is_current,
      description: formData.description || null,
      responsibilities: formData.responsibilities ? formData.responsibilities.split('\n').filter(r => r.trim()) : null,
      sort_order: editingExp?.sort_order ?? experiences.length,
    };

    if (editingExp) {
      const { error } = await supabase.from('experience').update(expData).eq('id', editingExp.id);
      if (error) {
        toast({ title: 'Error', description: 'Failed to update experience', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Experience updated successfully' });
        fetchExperiences();
        resetForm();
      }
    } else {
      const { error } = await supabase.from('experience').insert(expData);
      if (error) {
        toast({ title: 'Error', description: 'Failed to create experience', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Experience created successfully' });
        fetchExperiences();
        resetForm();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    const { error } = await supabase.from('experience').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete experience', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Experience deleted successfully' });
      fetchExperiences();
    }
  };

  const handleEdit = (exp: Experience) => {
    setEditingExp(exp);
    setFormData({
      company: exp.company,
      position: exp.position,
      location: exp.location || '',
      start_date: exp.start_date,
      end_date: exp.end_date || '',
      is_current: exp.is_current || false,
      description: exp.description || '',
      responsibilities: exp.responsibilities?.join('\n') || '',
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingExp(null);
    setFormData({ company: '', position: '', location: '', start_date: '', end_date: '', is_current: false, description: '', responsibilities: '' });
    setDialogOpen(false);
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Experience ({experiences.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}><Plus className="mr-2 h-4 w-4" /> Add Experience</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingExp ? 'Edit Experience' : 'Add New Experience'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="company">Company *</Label>
                <Input id="company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="position">Position *</Label>
                <Input id="position" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input id="start_date" type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input id="end_date" type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} disabled={formData.is_current} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="is_current" checked={formData.is_current} onCheckedChange={(checked) => setFormData({ ...formData, is_current: checked as boolean })} />
                <Label htmlFor="is_current">Currently working here</Label>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} />
              </div>
              <div>
                <Label htmlFor="responsibilities">Responsibilities (one per line)</Label>
                <Textarea id="responsibilities" value={formData.responsibilities} onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })} rows={4} placeholder="Managed CI/CD pipelines&#10;Led team of 5 engineers" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingExp ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{exp.position}</h3>
                <p className="text-sm text-primary">{exp.company}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                  {exp.location && ` • ${exp.location}`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(exp)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(exp.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          </div>
        ))}
        {experiences.length === 0 && <p className="text-center text-muted-foreground py-8">No experience entries yet.</p>}
      </div>
    </div>
  );
};