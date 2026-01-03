import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, X, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  project_url: string | null;
  technologies: string[] | null;
  published_date: string | null;
  sort_order: number;
}

export const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_url: '',
    technologies: '',
    published_date: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch projects', variant: 'destructive' });
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    const { error } = await supabase.storage
      .from('portfolio-images')
      .upload(filePath, file);

    if (error) {
      toast({ title: 'Error', description: 'Failed to upload image', variant: 'destructive' });
      return null;
    }

    const { data } = supabase.storage.from('portfolio-images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let imageUrl = editingProject?.image_url || null;
    
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
      if (!imageUrl && imageFile) {
        setSaving(false);
        return;
      }
    }

    const projectData = {
      title: formData.title,
      description: formData.description || null,
      image_url: imageUrl,
      project_url: formData.project_url || null,
      technologies: formData.technologies ? formData.technologies.split(',').map(t => t.trim()) : null,
      published_date: formData.published_date || null,
      sort_order: editingProject?.sort_order ?? projects.length,
    };

    if (editingProject) {
      const { error } = await supabase.functions.invoke('save-project', {
        body: { action: 'update', project: { id: editingProject.id, ...projectData } },
      });

      if (error) {
        toast({ title: 'Error', description: 'Failed to update project', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Project updated successfully' });
        fetchProjects();
        resetForm();
      }
    } else {
      const { error } = await supabase.functions.invoke('save-project', {
        body: { action: 'insert', project: projectData },
      });

      if (error) {
        toast({ title: 'Error', description: 'Failed to create project', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Project created successfully' });
        fetchProjects();
        resetForm();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    const { error } = await supabase.functions.invoke('save-project', {
      body: { action: 'delete', id },
    });
    
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete project', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Project deleted successfully' });
      fetchProjects();
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || '',
      project_url: project.project_url || '',
      technologies: project.technologies?.join(', ') || '',
      published_date: project.published_date || '',
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingProject(null);
    setImageFile(null);
    setFormData({ title: '', description: '', project_url: '', technologies: '', published_date: '' });
    setDialogOpen(false);
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Projects ({projects.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" /> Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="image">Project Image</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                  {(imageFile || editingProject?.image_url) && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setImageFile(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {editingProject?.image_url && !imageFile && (
                  <img src={editingProject.image_url} alt="Current" className="mt-2 h-20 object-cover rounded" />
                )}
              </div>
              <div>
                <Label htmlFor="project_url">Project URL</Label>
                <Input
                  id="project_url"
                  type="url"
                  value={formData.project_url}
                  onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                <Input
                  id="technologies"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React, Node.js, Docker"
                />
              </div>
              <div>
                <Label htmlFor="published_date">Published Date</Label>
                <Input
                  id="published_date"
                  type="date"
                  value={formData.published_date}
                  onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingProject ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border border-border">
            {project.image_url && (
              <img src={project.image_url} alt={project.title} className="w-16 h-16 object-cover rounded" />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{project.title}</h3>
              <p className="text-sm text-muted-foreground truncate">{project.description}</p>
              {project.technologies && (
                <div className="flex gap-1 mt-1 flex-wrap">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No projects yet. Add your first project!</p>
        )}
      </div>
    </div>
  );
};