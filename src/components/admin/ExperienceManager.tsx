
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit } from 'lucide-react';

interface Experience {
  id?: string;
  role: string;
  place: string;
  start_date: string;
  end_date?: string;
}

export function ExperienceManager() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [formData, setFormData] = useState<Experience>({
    role: '',
    place: '',
    start_date: '',
    end_date: ''
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching experiences:', error);
      return;
    }

    setExperiences(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editing) {
        const { error } = await supabase
          .from('experience')
          .update(formData)
          .eq('id', editing);

        if (error) throw error;
        setEditing(null);
      } else {
        const { error } = await supabase
          .from('experience')
          .insert([formData]);

        if (error) throw error;
      }

      toast({
        title: "Success!",
        description: `Experience ${editing ? 'updated' : 'added'} successfully.`,
      });
      
      setFormData({ role: '', place: '', start_date: '', end_date: '' });
      fetchExperiences();
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

  const handleEdit = (experience: Experience) => {
    setFormData(experience);
    setEditing(experience.id!);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    const { error } = await supabase
      .from('experience')
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
      description: "Experience deleted successfully.",
    });
    
    fetchExperiences();
  };

  const resetForm = () => {
    setFormData({ role: '', place: '', start_date: '', end_date: '' });
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editing ? 'Edit Experience' : 'Add New Experience'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Role/Position"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              />
              <Input
                placeholder="Organization/Place"
                value={formData.place}
                onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                required
              />
              <Input
                type="date"
                placeholder="Start Date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
              <Input
                type="date"
                placeholder="End Date (optional)"
                value={formData.end_date || ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : (editing ? "Update" : "Add Experience")}
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
          <CardTitle>Experience List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {experiences.map((experience) => (
              <div key={experience.id} className="border rounded-lg p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{experience.role}</h3>
                  <p className="text-gray-600">{experience.place}</p>
                  <p className="text-sm text-gray-500">
                    {experience.start_date} - {experience.end_date || 'Present'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(experience)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(experience.id!)}
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
