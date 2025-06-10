
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit } from 'lucide-react';

interface Publication {
  id?: string;
  title: string;
  authors: string;
  publication_date: string;
  source?: string;
  publisher?: string;
  description?: string;
  total_citations: number;
}

export function PublicationsManager() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [formData, setFormData] = useState<Publication>({
    title: '',
    authors: '',
    publication_date: '',
    source: '',
    publisher: '',
    description: '',
    total_citations: 0
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .order('publication_date', { ascending: false });

    if (error) {
      console.error('Error fetching publications:', error);
      return;
    }

    setPublications(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editing) {
        const { error } = await supabase
          .from('publications')
          .update(formData)
          .eq('id', editing);

        if (error) throw error;
        setEditing(null);
      } else {
        const { error } = await supabase
          .from('publications')
          .insert([formData]);

        if (error) throw error;
      }

      toast({
        title: "Success!",
        description: `Publication ${editing ? 'updated' : 'added'} successfully.`,
      });
      
      setFormData({
        title: '',
        authors: '',
        publication_date: '',
        source: '',
        publisher: '',
        description: '',
        total_citations: 0
      });
      fetchPublications();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (publication: Publication) => {
    setFormData(publication);
    setEditing(publication.id!);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;

    const { error } = await supabase
      .from('publications')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success!",
      description: "Publication deleted successfully.",
    });
    
    fetchPublications();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      authors: '',
      publication_date: '',
      source: '',
      publisher: '',
      description: '',
      total_citations: 0
    });
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editing ? 'Edit Publication' : 'Add New Publication'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <Input
              placeholder="Authors"
              value={formData.authors}
              onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="date"
                placeholder="Publication Date"
                value={formData.publication_date}
                onChange={(e) => setFormData({ ...formData, publication_date: e.target.value })}
                required
              />
              <Input
                placeholder="Source (optional)"
                value={formData.source || ''}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              />
              <Input
                placeholder="Publisher (optional)"
                value={formData.publisher || ''}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
              />
            </div>
            <Input
              type="number"
              placeholder="Total Citations"
              value={formData.total_citations}
              onChange={(e) => setFormData({ ...formData, total_citations: parseInt(e.target.value) || 0 })}
            />
            <Textarea
              placeholder="Description (optional)"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : (editing ? "Update" : "Add Publication")}
              </Button>
              {editing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publications List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {publications.map((publication) => (
              <div key={publication.id} className="border rounded-lg p-4 flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{publication.title}</h3>
                  <p className="text-gray-600">{publication.authors}</p>
                  <p className="text-sm text-gray-500">
                    {publication.publication_date} | Citations: {publication.total_citations}
                  </p>
                  {publication.source && <p className="text-sm text-gray-500">Source: {publication.source}</p>}
                  {publication.publisher && <p className="text-sm text-gray-500">Publisher: {publication.publisher}</p>}
                  {publication.description && <p className="text-sm mt-2">{publication.description}</p>}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(publication)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(publication.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
