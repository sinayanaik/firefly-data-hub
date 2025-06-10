
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
import { User, LogOut, Settings } from 'lucide-react';

export default function Admin() {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-slate-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-slate-500">Manage your academic portfolio</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-lg">
                <User className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-700 font-medium">{user.email}</span>
              </div>
              <Button 
                onClick={signOut} 
                variant="outline" 
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="w-full">
          <div className="mb-8">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-1 h-auto p-1 bg-white/60 backdrop-blur-sm shadow-lg">
              <TabsTrigger value="profile" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-2 sm:px-4">
                Profile
              </TabsTrigger>
              <TabsTrigger value="experience" className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-2 sm:px-4">
                Experience
              </TabsTrigger>
              <TabsTrigger value="education" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-2 sm:px-4">
                Education
              </TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-2 sm:px-4">
                Achievements
              </TabsTrigger>
              <TabsTrigger value="collaborators" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-2 sm:px-4">
                Collaborators
              </TabsTrigger>
              <TabsTrigger value="gallery" className="data-[state=active]:bg-rose-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-2 sm:px-4">
                Gallery
              </TabsTrigger>
              <TabsTrigger value="publications" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-2 sm:px-4">
                Publications
              </TabsTrigger>
              <TabsTrigger value="talks" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-2 sm:px-4">
                Talks
              </TabsTrigger>
              <TabsTrigger value="news" className="data-[state=active]:bg-slate-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-2 sm:px-4">
                News
              </TabsTrigger>
              <TabsTrigger value="people" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-2 sm:px-4">
                People
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
            <TabsContent value="profile" className="p-6 m-0">
              <ProfileManager />
            </TabsContent>
            <TabsContent value="experience" className="p-6 m-0">
              <ExperienceManager />
            </TabsContent>
            <TabsContent value="education" className="p-6 m-0">
              <EducationManager />
            </TabsContent>
            <TabsContent value="achievements" className="p-6 m-0">
              <AchievementsManager />
            </TabsContent>
            <TabsContent value="collaborators" className="p-6 m-0">
              <CollaboratorsManager />
            </TabsContent>
            <TabsContent value="gallery" className="p-6 m-0">
              <GalleryManager />
            </TabsContent>
            <TabsContent value="publications" className="p="6 m-0">
              <PublicationsManager />
            </TabsContent>
            <TabsContent value="talks" className="p-6 m-0">
              <TalksEventsManager />
            </TabsContent>
            <TabsContent value="news" className="p-6 m-0">
              <NewsEventsManager />
            </TabsContent>
            <TabsContent value="people" className="p-6 m-0">
              <PeopleManager />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
