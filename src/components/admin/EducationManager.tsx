import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  sort_order: number;
}

export const EducationManager = () => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    description: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    const { data, error } = await supabase.from('education').select('*').order('sort_order', { ascending: true });
    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch education', variant: 'destructive' });
    } else {
      setEducations(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const eduData = {
      institution: formData.institution,
      degree: formData.degree,
      field_of_study: formData.field_of_study || null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      description: formData.description || null,
      sort_order: editingEdu?.sort_order ?? educations.length,
    };

    if (editingEdu) {
      const { error } = await supabase.from('education').update(eduData).eq('id', editingEdu.id);
      if (error) {
        toast({ title: 'Error', description: 'Failed to update education', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Education updated successfully' });
        fetchEducations();
        resetForm();
      }
    } else {
      const { error } = await supabase.from('education').insert(eduData);
      if (error) {
        toast({ title: 'Error', description: 'Failed to create education', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Education created successfully' });
        fetchEducations();
        resetForm();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this education entry?')) return;
    const { error } = await supabase.from('education').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete education', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Education deleted successfully' });
      fetchEducations();
    }
  };

  const handleEdit = (edu: Education) => {
    setEditingEdu(edu);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      field_of_study: edu.field_of_study || '',
      start_date: edu.start_date || '',
      end_date: edu.end_date || '',
      description: edu.description || '',
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingEdu(null);
    setFormData({ institution: '', degree: '', field_of_study: '', start_date: '', end_date: '', description: '' });
    setDialogOpen(false);
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Education ({educations.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}><Plus className="mr-2 h-4 w-4" /> Add Education</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEdu ? 'Edit Education' : 'Add New Education'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="institution">Institution *</Label>
                <Input id="institution" value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="degree">Degree *</Label>
                <Input id="degree" value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="field_of_study">Field of Study</Label>
                <Input id="field_of_study" value={formData.field_of_study} onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input id="start_date" type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input id="end_date" type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingEdu ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {educations.map((edu) => (
          <div key={edu.id} className="p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{edu.degree}</h3>
                <p className="text-sm text-primary">{edu.institution}</p>
                {edu.field_of_study && <p className="text-sm text-muted-foreground">{edu.field_of_study}</p>}
                <p className="text-xs text-muted-foreground mt-1">{edu.start_date} - {edu.end_date}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(edu)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(edu.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          </div>
        ))}
        {educations.length === 0 && <p className="text-center text-muted-foreground py-8">No education entries yet.</p>}
      </div>
    </div>
  );
};