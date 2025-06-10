
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit } from 'lucide-react';

interface Person {
  id?: string;
  name: string;
  role: string;
  current_status: 'current' | 'former' | 'visiting' | 'emeritus';
  start_date: string;
  end_date?: string;
}

export function PeopleManager() {
  const [people, setPeople] = useState<Person[]>([]);
  const [formData, setFormData] = useState<Person>({
    name: '',
    role: '',
    current_status: 'current',
    start_date: '',
    end_date: ''
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    const { data, error } = await supabase
      .from('people')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching people:', error);
      return;
    }

    setPeople(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editing) {
        const { error } = await supabase
          .from('people')
          .update(formData)
          .eq('id', editing);

        if (error) throw error;
        setEditing(null);
      } else {
        const { error } = await supabase
          .from('people')
          .insert([formData]);

        if (error) throw error;
      }

      toast({
        title: "Success!",
        description: `Person ${editing ? 'updated' : 'added'} successfully.`,
      });
      
      setFormData({
        name: '',
        role: '',
        current_status: 'current',
        start_date: '',
        end_date: ''
      });
      fetchPeople();
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

  const handleEdit = (person: Person) => {
    setFormData(person);
    setEditing(person.id!);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this person?')) return;

    const { error } = await supabase
      .from('people')
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
      description: "Person deleted successfully.",
    });
    
    fetchPeople();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      current_status: 'current',
      start_date: '',
      end_date: ''
    });
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editing ? 'Edit Person' : 'Add New Person'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                placeholder="Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              />
              <Select
                value={formData.current_status}
                onValueChange={(value: 'current' | 'former' | 'visiting' | 'emeritus') => 
                  setFormData({ ...formData, current_status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="former">Former</SelectItem>
                  <SelectItem value="visiting">Visiting</SelectItem>
                  <SelectItem value="emeritus">Emeritus</SelectItem>
                </SelectContent>
              </Select>
              <div></div>
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
                {loading ? "Saving..." : (editing ? "Update" : "Add Person")}
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
          <CardTitle>People List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {people.map((person) => (
              <div key={person.id} className="border rounded-lg p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{person.name}</h3>
                  <p className="text-gray-600">{person.role}</p>
                  <p className="text-sm text-gray-500">
                    Status: {person.current_status} | {person.start_date} - {person.end_date || 'Present'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(person)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(person.id!)}
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
