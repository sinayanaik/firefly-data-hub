
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit } from 'lucide-react';

interface Education {
  id?: string;
  degree: string;
  speciality?: string;
  place: string;
  year: number;
}

export function EducationManager() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [formData, setFormData] = useState<Education>({
    degree: '',
    speciality: '',
    place: '',
    year: new Date().getFullYear()
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('year', { ascending: false });

    if (error) {
      console.error('Error fetching educations:', error);
      return;
    }

    setEducations(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editing) {
        const { error } = await supabase
          .from('education')
          .update(formData)
          .eq('id', editing);

        if (error) throw error;
        setEditing(null);
      } else {
        const { error } = await supabase
          .from('education')
          .insert([formData]);

        if (error) throw error;
      }

      toast({
        title: "Success!",
        description: `Education ${editing ? 'updated' : 'added'} successfully.`,
      });
      
      setFormData({ degree: '', speciality: '', place: '', year: new Date().getFullYear() });
      fetchEducations();
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

  const handleEdit = (education: Education) => {
    setFormData(education);
    setEditing(education.id!);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education?')) return;

    const { error } = await supabase
      .from('education')
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
      description: "Education deleted successfully.",
    });
    
    fetchEducations();
  };

  const resetForm = () => {
    setFormData({ degree: '', speciality: '', place: '', year: new Date().getFullYear() });
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editing ? 'Edit Education' : 'Add New Education'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Degree"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                required
              />
              <Input
                placeholder="Speciality (optional)"
                value={formData.speciality || ''}
                onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
              />
              <Input
                placeholder="Institution"
                value={formData.place}
                onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                required
              />
              <Input
                type="number"
                placeholder="Year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : (editing ? "Update" : "Add Education")}
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
          <CardTitle>Education List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {educations.map((education) => (
              <div key={education.id} className="border rounded-lg p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{education.degree}</h3>
                  {education.speciality && <p className="text-gray-600">{education.speciality}</p>}
                  <p className="text-gray-600">{education.place}</p>
                  <p className="text-sm text-gray-500">{education.year}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(education)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(education.id!)}
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
