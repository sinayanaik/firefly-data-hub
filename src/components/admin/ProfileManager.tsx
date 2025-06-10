
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, User, X } from 'lucide-react';

interface Profile {
  id?: string;
  name: string;
  title: string;
  bio: string;
  email?: string;
  phone?: string;
  office_location?: string;
  profile_image_url?: string;
  research_interests: string[];
}

export function ProfileManager() {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    office_location: '',
    profile_image_url: '',
    research_interests: []
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [researchInterest, setResearchInterest] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('professor_profile')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    if (data) {
      setProfile(data);
    }
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
      const fileName = `profile-${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      setProfile({ ...profile, profile_image_url: publicUrl });

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
      if (profile.id) {
        const { error } = await supabase
          .from('professor_profile')
          .update(profile)
          .eq('id', profile.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('professor_profile')
          .insert([profile]);

        if (error) throw error;
      }

      toast({
        title: "Success!",
        description: "Profile updated successfully.",
      });
      
      fetchProfile();
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

  const addResearchInterest = () => {
    if (researchInterest.trim() && !profile.research_interests.includes(researchInterest.trim())) {
      setProfile({
        ...profile,
        research_interests: [...profile.research_interests, researchInterest.trim()]
      });
      setResearchInterest('');
    }
  };

  const removeResearchInterest = (index: number) => {
    setProfile({
      ...profile,
      research_interests: profile.research_interests.filter((_, i) => i !== index)
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Professor Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Profile Image
            </label>
            <div className="flex items-center space-x-6">
              <div className="shrink-0">
                {profile.profile_image_url ? (
                  <img
                    className="h-20 w-20 object-cover rounded-lg border-2 border-slate-200"
                    src={profile.profile_image_url}
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
              placeholder="Full Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              required
            />
            <Input
              placeholder="Title"
              value={profile.title}
              onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              required
            />
            <Input
              placeholder="Email"
              type="email"
              value={profile.email || ''}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
            <Input
              placeholder="Phone"
              value={profile.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
            <Input
              placeholder="Office Location"
              value={profile.office_location || ''}
              onChange={(e) => setProfile({ ...profile, office_location: e.target.value })}
            />
            <Input
              placeholder="Profile Image URL (optional)"
              value={profile.profile_image_url || ''}
              onChange={(e) => setProfile({ ...profile, profile_image_url: e.target.value })}
            />
          </div>
          
          <Textarea
            placeholder="Bio"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={4}
            required
          />

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">Research Interests</label>
            <div className="flex gap-2">
              <Input
                placeholder="Add research interest"
                value={researchInterest}
                onChange={(e) => setResearchInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResearchInterest())}
              />
              <Button type="button" onClick={addResearchInterest} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.research_interests.map((interest, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeResearchInterest(index)}
                    className="text-blue-600 hover:text-blue-800 ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading || uploading} className="w-full bg-blue-600 hover:bg-blue-700">
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
