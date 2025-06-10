
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExperienceManager } from '@/components/admin/ExperienceManager';
import { EducationManager } from '@/components/admin/EducationManager';
import { AchievementsManager } from '@/components/admin/AchievementsManager';
import { CollaboratorsManager } from '@/components/admin/CollaboratorsManager';
import { GalleryManager } from '@/components/admin/GalleryManager';
import { PublicationsManager } from '@/components/admin/PublicationsManager';
import { TalksEventsManager } from '@/components/admin/TalksEventsManager';
import { NewsEventsManager } from '@/components/admin/NewsEventsManager';
import { PeopleManager } from '@/components/admin/PeopleManager';
import { ProfileManager } from '@/components/admin/ProfileManager';

export default function Admin() {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <Button onClick={signOut} variant="outline">Sign Out</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="publications">Publications</TabsTrigger>
            <TabsTrigger value="talks">Talks</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
          </TabsList>

          <TabsContent value="profile"><ProfileManager /></TabsContent>
          <TabsContent value="experience"><ExperienceManager /></TabsContent>
          <TabsContent value="education"><EducationManager /></TabsContent>
          <TabsContent value="achievements"><AchievementsManager /></TabsContent>
          <TabsContent value="collaborators"><CollaboratorsManager /></TabsContent>
          <TabsContent value="gallery"><GalleryManager /></TabsContent>
          <TabsContent value="publications"><PublicationsManager /></TabsContent>
          <TabsContent value="talks"><TalksEventsManager /></TabsContent>
          <TabsContent value="news"><NewsEventsManager /></TabsContent>
          <TabsContent value="people"><PeopleManager /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
