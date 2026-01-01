import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Membership {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  member_since: string | null;
  sort_order: number;
}

export const MembershipsManager = () => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Membership | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    website_url: '',
    member_since: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    const { data, error } = await supabase.from('professional_memberships').select('*').order('sort_order', { ascending: true });
    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch memberships', variant: 'destructive' });
    } else {
      setMemberships(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const itemData = {
      name: formData.name,
      logo_url: formData.logo_url || null,
      website_url: formData.website_url || null,
      member_since: formData.member_since || null,
      sort_order: editingItem?.sort_order ?? memberships.length,
    };

    if (editingItem) {
      const { error } = await supabase.from('professional_memberships').update(itemData).eq('id', editingItem.id);
      if (error) {
        toast({ title: 'Error', description: 'Failed to update membership', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Membership updated successfully' });
        fetchMemberships();
        resetForm();
      }
    } else {
      const { error } = await supabase.from('professional_memberships').insert(itemData);
      if (error) {
        toast({ title: 'Error', description: 'Failed to create membership', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Membership created successfully' });
        fetchMemberships();
        resetForm();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this membership?')) return;
    const { error } = await supabase.from('professional_memberships').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete membership', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Membership deleted successfully' });
      fetchMemberships();
    }
  };

  const handleEdit = (item: Membership) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      logo_url: item.logo_url || '',
      website_url: item.website_url || '',
      member_since: item.member_since || '',
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({ name: '', logo_url: '', website_url: '', member_since: '' });
    setDialogOpen(false);
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Professional Memberships ({memberships.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}><Plus className="mr-2 h-4 w-4" /> Add Membership</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Membership' : 'Add New Membership'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Organization Name *</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input id="logo_url" type="url" value={formData.logo_url} onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })} placeholder="https://example.com/logo.png" />
              </div>
              <div>
                <Label htmlFor="website_url">Website URL</Label>
                <Input id="website_url" type="url" value={formData.website_url} onChange={(e) => setFormData({ ...formData, website_url: e.target.value })} placeholder="https://organization.com" />
              </div>
              <div>
                <Label htmlFor="member_since">Member Since</Label>
                <Input id="member_since" type="date" value={formData.member_since} onChange={(e) => setFormData({ ...formData, member_since: e.target.value })} />
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
        {memberships.map((item) => (
          <div key={item.id} className="p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {item.logo_url && (
                  <img src={item.logo_url} alt={item.name} className="w-10 h-10 object-contain rounded" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{item.name}</h3>
                    {item.website_url && (
                      <a href={item.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  {item.member_since && <p className="text-xs text-muted-foreground">Member since {item.member_since}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          </div>
        ))}
        {memberships.length === 0 && <p className="text-center text-muted-foreground py-8">No memberships yet.</p>}
      </div>
    </div>
  );
};