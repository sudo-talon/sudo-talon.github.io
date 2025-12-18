import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Publication {
  id: string;
  title: string;
  description: string | null;
  publication_url: string | null;
  publication_date: string | null;
  publication_type: string | null;
  sort_order: number;
}

const publicationTypes = ['Article', 'Research Paper', 'Blog Post', 'Book', 'Whitepaper', 'Other'];

export const PublicationsManager = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Publication | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    publication_url: '',
    publication_date: '',
    publication_type: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    const { data, error } = await supabase.from('publications').select('*').order('sort_order', { ascending: true });
    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch publications', variant: 'destructive' });
    } else {
      setPublications(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const itemData = {
      title: formData.title,
      description: formData.description || null,
      publication_url: formData.publication_url || null,
      publication_date: formData.publication_date || null,
      publication_type: formData.publication_type || null,
      sort_order: editingItem?.sort_order ?? publications.length,
    };

    if (editingItem) {
      const { error } = await supabase.from('publications').update(itemData).eq('id', editingItem.id);
      if (error) {
        toast({ title: 'Error', description: 'Failed to update publication', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Publication updated successfully' });
        fetchPublications();
        resetForm();
      }
    } else {
      const { error } = await supabase.from('publications').insert(itemData);
      if (error) {
        toast({ title: 'Error', description: 'Failed to create publication', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Publication created successfully' });
        fetchPublications();
        resetForm();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this publication?')) return;
    const { error } = await supabase.from('publications').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete publication', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Publication deleted successfully' });
      fetchPublications();
    }
  };

  const handleEdit = (item: Publication) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      publication_url: item.publication_url || '',
      publication_date: item.publication_date || '',
      publication_type: item.publication_type || '',
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({ title: '', description: '', publication_url: '', publication_date: '', publication_type: '' });
    setDialogOpen(false);
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Publications ({publications.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}><Plus className="mr-2 h-4 w-4" /> Add Publication</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Publication' : 'Add New Publication'}</DialogTitle>
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
                <Label htmlFor="publication_url">URL</Label>
                <Input id="publication_url" type="url" value={formData.publication_url} onChange={(e) => setFormData({ ...formData, publication_url: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="publication_date">Date</Label>
                  <Input id="publication_date" type="date" value={formData.publication_date} onChange={(e) => setFormData({ ...formData, publication_date: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="publication_type">Type</Label>
                  <Select value={formData.publication_type} onValueChange={(value) => setFormData({ ...formData, publication_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {publicationTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
        {publications.map((item) => (
          <div key={item.id} className="p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{item.title}</h3>
                  {item.publication_url && (
                    <a href={item.publication_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                <div className="flex gap-2 mt-2">
                  {item.publication_type && <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">{item.publication_type}</span>}
                  {item.publication_date && <span className="text-xs text-muted-foreground">{item.publication_date}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          </div>
        ))}
        {publications.length === 0 && <p className="text-center text-muted-foreground py-8">No publications yet.</p>}
      </div>
    </div>
  );
};