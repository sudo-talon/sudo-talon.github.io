import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, Award } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Achievement {
  id: string;
  title: string;
  description: string | null;
  date_achieved: string | null;
  icon: string | null;
  sort_order: number;
}

export const AchievementsManager = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date_achieved: '',
    icon: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    const { data, error } = await supabase.from('achievements').select('*').order('sort_order', { ascending: true });
    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch achievements', variant: 'destructive' });
    } else {
      setAchievements(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const itemData = {
      title: formData.title,
      description: formData.description || null,
      date_achieved: formData.date_achieved || null,
      icon: formData.icon || null,
      sort_order: editingItem?.sort_order ?? achievements.length,
    };

    if (editingItem) {
      const { error } = await supabase.from('achievements').update(itemData).eq('id', editingItem.id);
      if (error) {
        toast({ title: 'Error', description: 'Failed to update achievement', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Achievement updated successfully' });
        fetchAchievements();
        resetForm();
      }
    } else {
      const { error } = await supabase.from('achievements').insert(itemData);
      if (error) {
        toast({ title: 'Error', description: 'Failed to create achievement', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Achievement created successfully' });
        fetchAchievements();
        resetForm();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this achievement?')) return;
    const { error } = await supabase.from('achievements').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete achievement', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Achievement deleted successfully' });
      fetchAchievements();
    }
  };

  const handleEdit = (item: Achievement) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      date_achieved: item.date_achieved || '',
      icon: item.icon || '',
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({ title: '', description: '', date_achieved: '', icon: '' });
    setDialogOpen(false);
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Achievements ({achievements.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}><Plus className="mr-2 h-4 w-4" /> Add Achievement</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Achievement' : 'Add New Achievement'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>
              <div>
                <Label htmlFor="date_achieved">Date Achieved</Label>
                <Input id="date_achieved" type="date" value={formData.date_achieved} onChange={(e) => setFormData({ ...formData, date_achieved: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="icon">Icon (emoji or icon name)</Label>
                <Input id="icon" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="🏆 or trophy" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingItem ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {achievements.map((item) => (
          <div key={item.id} className="p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  {item.icon ? <span className="text-lg">{item.icon}</span> : <Award className="h-5 w-5 text-primary" />}
                </div>
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                  {item.date_achieved && <p className="text-xs text-muted-foreground mt-1">{item.date_achieved}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          </div>
        ))}
        {achievements.length === 0 && <p className="text-center text-muted-foreground py-8">No achievements yet.</p>}
      </div>
    </div>
  );
};