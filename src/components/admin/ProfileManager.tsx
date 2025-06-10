
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

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
    <Card>
      <CardHeader>
        <CardTitle>Professor Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Profile Image URL"
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Research Interests</label>
            <div className="flex gap-2">
              <Input
                placeholder="Add research interest"
                value={researchInterest}
                onChange={(e) => setResearchInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResearchInterest())}
              />
              <Button type="button" onClick={addResearchInterest}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.research_interests.map((interest, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeResearchInterest(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
