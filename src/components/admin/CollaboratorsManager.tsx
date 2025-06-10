
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit } from 'lucide-react';

interface Collaborator {
  id?: string;
  name: string;
  designation: string;
  institute: string;
}

export function CollaboratorsManager() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [formData, setFormData] = useState<Collaborator>({
    name: '',
    designation: '',
    institute: ''
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCollaborators();
  }, []);

  const fetchCollaborators = async () => {
    const { data, error } = await supabase
      .from('collaborators')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching collaborators:', error);
      return;
    }

    setCollaborators(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editing) {
        const { error } = await supabase
          .from('collaborators')
          .update(formData)
          .eq('id', editing);

        if (error) throw error;
        setEditing(null);
      } else {
        const { error } = await supabase
          .from('collaborators')
          .insert([formData]);

        if (error) throw error;
      }

      toast({
        title: "Success!",
        description: `Collaborator ${editing ? 'updated' : 'added'} successfully.`,
      });
      
      setFormData({ name: '', designation: '', institute: '' });
      fetchCollaborators();
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

  const handleEdit = (collaborator: Collaborator) => {
    setFormData(collaborator);
    setEditing(collaborator.id!);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collaborator?')) return;

    const { error } = await supabase
      .from('collaborators')
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
      description: "Collaborator deleted successfully.",
    });
    
    fetchCollaborators();
  };

  const resetForm = () => {
    setFormData({ name: '', designation: '', institute: '' });
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editing ? 'Edit Collaborator' : 'Add New Collaborator'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                placeholder="Designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                required
              />
              <Input
                placeholder="Institute"
                value={formData.institute}
                onChange={(e) => setFormData({ ...formData, institute: e.target.value })}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : (editing ? "Update" : "Add Collaborator")}
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
          <CardTitle>Collaborators List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {collaborators.map((collaborator) => (
              <div key={collaborator.id} className="border rounded-lg p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{collaborator.name}</h3>
                  <p className="text-gray-600">{collaborator.designation}</p>
                  <p className="text-gray-600">{collaborator.institute}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(collaborator)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(collaborator.id!)}
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
