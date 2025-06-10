
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Upload, User } from 'lucide-react';

interface Person {
  id?: string;
  name: string;
  role: string;
  current_status: 'current' | 'former' | 'visiting' | 'emeritus';
  start_date: string;
  end_date?: string;
  profile_image_url?: string;
}

export function PeopleManager() {
  const [people, setPeople] = useState<Person[]>([]);
  const [formData, setFormData] = useState<Person>({
    name: '',
    role: '',
    current_status: 'current',
    start_date: '',
    end_date: '',
    profile_image_url: ''
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `people-${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      setFormData({ ...formData, profile_image_url: publicUrl });

      toast({
        title: "Success!",
        description: "Profile image uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
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
        end_date: '',
        profile_image_url: ''
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
      end_date: '',
      profile_image_url: ''
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
            {/* Profile Image Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Profile Image
              </label>
              <div className="flex items-center space-x-6">
                <div className="shrink-0">
                  {formData.profile_image_url ? (
                    <img
                      className="h-20 w-20 object-cover rounded-lg border-2 border-slate-200"
                      src={formData.profile_image_url}
                      alt="Profile"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <div className="h-20 w-20 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                      <User className="h-8 w-8 text-slate-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="relative cursor-pointer bg-white rounded-md border border-slate-300 py-2 px-3 flex items-center gap-2 hover:bg-slate-50 transition-colors">
                    <Upload className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-700">
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
            </div>

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
              <Button type="submit" disabled={loading || uploading}>
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
                <div className="flex items-center gap-4">
                  {person.profile_image_url ? (
                    <img
                      className="h-12 w-12 object-cover rounded-full border-2 border-slate-200"
                      src={person.profile_image_url}
                      alt={person.name}
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <div className="h-12 w-12 bg-slate-100 rounded-full border-2 border-slate-300 flex items-center justify-center">
                      <User className="h-6 w-6 text-slate-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">{person.name}</h3>
                    <p className="text-gray-600">{person.role}</p>
                    <p className="text-sm text-gray-500">
                      Status: {person.current_status} | {person.start_date} - {person.end_date || 'Present'}
                    </p>
                  </div>
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
