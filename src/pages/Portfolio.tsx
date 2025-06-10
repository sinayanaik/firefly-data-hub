
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Phone, MapPin, User, GraduationCap, Award, Users, BookOpen, Calendar, Newspaper, Image as ImageIcon, Home } from 'lucide-react';

interface Profile {
  name: string;
  title: string;
  bio: string;
  email?: string;
  phone?: string;
  office_location?: string;
  profile_image_url?: string;
  research_interests: string[];
}

interface Experience {
  role: string;
  place: string;
  start_date: string;
  end_date?: string;
}

interface Education {
  degree: string;
  speciality?: string;
  place: string;
  year: number;
}

interface Achievement {
  position: string;
  organization: string;
  date: string;
}

interface Publication {
  title: string;
  authors: string;
  publication_date: string;
  source?: string;
  publisher?: string;
  description?: string;
  total_citations: number;
}

interface TalkEvent {
  event: string;
  description?: string;
  date: string;
  organizer?: string;
}

interface NewsEvent {
  text: string;
  date: string;
}

interface Person {
  name: string;
  role: string;
  current_status: string;
  start_date: string;
  end_date?: string;
  profile_image_url?: string;
}

interface Collaborator {
  name: string;
  designation: string;
  institute: string;
}

interface GalleryItem {
  image_url: string;
  caption?: string;
}

export default function Portfolio() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [talksEvents, setTalksEvents] = useState<TalkEvent[]>([]);
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    // Fetch profile
    const { data: profileData } = await supabase
      .from('professor_profile')
      .select('*')
      .maybeSingle();
    
    if (profileData) setProfile(profileData);

    // Fetch experience
    const { data: experienceData } = await supabase
      .from('experience')
      .select('*')
      .order('start_date', { ascending: false });
    
    setExperience(experienceData || []);

    // Fetch education
    const { data: educationData } = await supabase
      .from('education')
      .select('*')
      .order('year', { ascending: false });
    
    setEducation(educationData || []);

    // Fetch achievements
    const { data: achievementsData } = await supabase
      .from('achievements')
      .select('*')
      .order('date', { ascending: false });
    
    setAchievements(achievementsData || []);

    // Fetch publications
    const { data: publicationsData } = await supabase
      .from('publications')
      .select('*')
      .order('publication_date', { ascending: false });
    
    setPublications(publicationsData || []);

    // Fetch talks and events
    const { data: talksEventsData } = await supabase
      .from('talks_events')
      .select('*')
      .order('date', { ascending: false });
    
    setTalksEvents(talksEventsData || []);

    // Fetch news and events
    const { data: newsEventsData } = await supabase
      .from('news_events')
      .select('*')
      .order('date', { ascending: false });
    
    setNewsEvents(newsEventsData || []);

    // Fetch people
    const { data: peopleData } = await supabase
      .from('people')
      .select('*')
      .order('start_date', { ascending: false });
    
    setPeople(peopleData || []);

    // Fetch collaborators
    const { data: collaboratorsData } = await supabase
      .from('collaborators')
      .select('*')
      .order('name');
    
    setCollaborators(collaboratorsData || []);

    // Fetch gallery
    const { data: galleryData } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
    
    setGallery(galleryData || []);
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 m-0">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-4 animate-pulse"></div>
          <h2 className="text-2xl font-bold mb-4 text-slate-800">Academic Portfolio</h2>
          <p className="text-slate-600 mb-4">Setting up your academic portfolio...</p>
          <div className="text-sm text-slate-500">
            Content will appear here once the profile is configured
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 m-0">
      {/* Modern Top Navigation */}
      <header className="bg-white/95 backdrop-blur-lg shadow-lg border-b sticky top-0 z-50 m-0">
        <div className="w-full px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {profile.name}
                </h1>
                <p className="text-slate-600 font-medium">{profile.title}</p>
              </div>
            </div>
          </div>

          {/* Modern Navigation Tabs */}
          <Tabs defaultValue="home" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 h-auto p-2 bg-slate-100/80 backdrop-blur-sm rounded-xl shadow-inner">
              <TabsTrigger 
                value="home" 
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md text-sm font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:bg-white/50"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </TabsTrigger>
              <TabsTrigger 
                value="experience" 
                className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-md text-sm font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:bg-white/50"
              >
                <User className="w-4 h-4 mr-2" />
                Experience
              </TabsTrigger>
              <TabsTrigger 
                value="education" 
                className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-md text-sm font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:bg-white/50"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Education
              </TabsTrigger>
              <TabsTrigger 
                value="publications" 
                className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md text-sm font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:bg-white/50"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Publications
              </TabsTrigger>
              <TabsTrigger 
                value="people" 
                className="data-[state=active]:bg-white data-[state=active]:text-cyan-600 data-[state=active]:shadow-md text-sm font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:bg-white/50"
              >
                <Users className="w-4 h-4 mr-2" />
                People
              </TabsTrigger>
              <TabsTrigger 
                value="achievements" 
                className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-md text-sm font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:bg-white/50"
              >
                <Award className="w-4 h-4 mr-2" />
                Awards
              </TabsTrigger>
              <TabsTrigger 
                value="talks" 
                className="data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-md text-sm font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:bg-white/50"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Events
              </TabsTrigger>
              <TabsTrigger 
                value="gallery" 
                className="data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-md text-sm font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:bg-white/50"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Gallery
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <div className="mt-8">
              {/* Home/Profile Section */}
              <TabsContent value="home" className="m-0">
                <div className="w-full">
                  <Card className="border-0 shadow-xl bg-gradient-to-r from-white to-slate-50/50 rounded-2xl overflow-hidden">
                    <CardContent className="p-12">
                      <div className="flex flex-col lg:flex-row gap-12 items-start">
                        {profile.profile_image_url && (
                          <div className="flex-shrink-0 mx-auto lg:mx-0">
                            <div className="relative">
                              <img
                                src={profile.profile_image_url}
                                alt={profile.name}
                                className="w-48 h-48 rounded-3xl object-cover shadow-2xl"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder.svg';
                                }}
                              />
                              <div className="absolute inset-0 rounded-3xl ring-8 ring-white/50"></div>
                            </div>
                          </div>
                        )}
                        <div className="flex-1 text-center lg:text-left">
                          <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-4 leading-tight">
                            {profile.name}
                          </h1>
                          <h2 className="text-2xl lg:text-3xl text-slate-600 mb-8 font-medium">
                            {profile.title}
                          </h2>
                          <p className="text-xl text-slate-700 mb-8 leading-relaxed max-w-4xl">
                            {profile.bio}
                          </p>
                          
                          <div className="flex flex-col sm:flex-row gap-4 text-slate-600 mb-8">
                            {profile.email && (
                              <div className="flex items-center justify-center lg:justify-start gap-3 bg-slate-100/70 px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <Mail className="w-5 h-5 text-blue-600" />
                                <span className="font-medium">{profile.email}</span>
                              </div>
                            )}
                            {profile.phone && (
                              <div className="flex items-center justify-center lg:justify-start gap-3 bg-slate-100/70 px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <Phone className="w-5 h-5 text-green-600" />
                                <span className="font-medium">{profile.phone}</span>
                              </div>
                            )}
                            {profile.office_location && (
                              <div className="flex items-center justify-center lg:justify-start gap-3 bg-slate-100/70 px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <MapPin className="w-5 h-5 text-red-600" />
                                <span className="font-medium">{profile.office_location}</span>
                              </div>
                            )}
                          </div>

                          {profile.research_interests && profile.research_interests.length > 0 && (
                            <div className="text-center lg:text-left">
                              <h3 className="font-bold text-slate-800 mb-4 text-lg">Research Interests</h3>
                              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                {profile.research_interests.map((interest, index) => (
                                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2 text-sm font-medium rounded-xl shadow-sm">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Experience Section */}
              <TabsContent value="experience" className="m-0">
                {experience.length > 0 && (
                  <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 p-8">
                      <CardTitle className="flex items-center gap-4 text-slate-800 text-2xl">
                        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        Professional Experience
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="space-y-8">
                        {experience.map((exp, index) => (
                          <div key={index} className="relative pl-8 border-l-4 border-green-200 last:border-l-0 bg-gradient-to-r from-green-50/50 to-transparent p-6 rounded-xl hover:shadow-md transition-shadow">
                            <div className="absolute w-4 h-4 bg-green-600 rounded-full -left-2 top-6 shadow-md"></div>
                            <h3 className="font-bold text-slate-800 text-xl mb-2">{exp.role}</h3>
                            <p className="text-green-600 font-semibold text-lg mb-2">{exp.place}</p>
                            <p className="text-slate-500 font-medium">
                              {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Education Section */}
              <TabsContent value="education" className="m-0">
                {education.length > 0 && (
                  <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 p-8">
                      <CardTitle className="flex items-center gap-4 text-slate-800 text-2xl">
                        <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                          <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        Education
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="space-y-8">
                        {education.map((edu, index) => (
                          <div key={index} className="relative pl-8 border-l-4 border-purple-200 last:border-l-0 bg-gradient-to-r from-purple-50/50 to-transparent p-6 rounded-xl hover:shadow-md transition-shadow">
                            <div className="absolute w-4 h-4 bg-purple-600 rounded-full -left-2 top-6 shadow-md"></div>
                            <h3 className="font-bold text-slate-800 text-xl mb-2">{edu.degree}</h3>
                            {edu.speciality && <p className="text-purple-600 font-semibold text-lg mb-2">{edu.speciality}</p>}
                            <p className="text-slate-600 font-medium mb-2">{edu.place}</p>
                            <p className="text-slate-500 font-medium">{edu.year}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Publications Section */}
              <TabsContent value="publications" className="m-0">
                {publications.length > 0 && (
                  <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 p-8">
                      <CardTitle className="flex items-center gap-4 text-slate-800 text-2xl">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        Publications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid gap-8">
                        {publications.map((pub, index) => (
                          <div key={index} className="p-8 bg-gradient-to-r from-indigo-50/50 to-white rounded-2xl border border-indigo-200/50 hover:shadow-lg transition-all duration-300">
                            <h3 className="font-bold text-xl text-slate-800 mb-3">{pub.title}</h3>
                            <p className="text-slate-600 font-semibold mb-4 text-lg">{pub.authors}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-500 mb-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span className="font-medium">{formatDate(pub.publication_date)}</span>
                              </div>
                              {pub.source && (
                                <div className="flex items-center gap-2">
                                  <BookOpen className="w-4 h-4" />
                                  <span className="font-medium">{pub.source}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Citations:</span>
                                <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-300">{pub.total_citations}</Badge>
                              </div>
                            </div>
                            {pub.description && <p className="text-slate-700 leading-relaxed">{pub.description}</p>}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* People Section with Profile Images */}
              <TabsContent value="people" className="m-0">
                {people.length > 0 && (
                  <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 p-8">
                      <CardTitle className="flex items-center gap-4 text-slate-800 text-2xl">
                        <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        Research Team & Students
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid gap-6">
                        {people.map((person, index) => (
                          <div key={index} className="p-6 bg-gradient-to-r from-cyan-50/50 to-white rounded-xl border border-cyan-200/50 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-6">
                              <Avatar className="w-16 h-16 shadow-lg ring-4 ring-white">
                                <AvatarImage 
                                  src={person.profile_image_url || '/placeholder.svg'} 
                                  alt={person.name}
                                />
                                <AvatarFallback className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg">
                                  {getInitials(person.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h3 className="font-bold text-slate-800 text-xl mb-1">{person.name}</h3>
                                <p className="text-slate-600 font-medium text-lg mb-2">{person.role}</p>
                                <div className="flex items-center gap-4">
                                  <Badge 
                                    variant={person.current_status === 'current' ? 'default' : 'secondary'} 
                                    className={`${person.current_status === 'current' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-700'} px-3 py-1 font-medium rounded-lg`}
                                  >
                                    {person.current_status}
                                  </Badge>
                                  <span className="text-slate-500 font-medium">
                                    {formatDate(person.start_date)} - {person.end_date ? formatDate(person.end_date) : 'Present'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Achievements Section */}
              <TabsContent value="achievements" className="m-0">
                {achievements.length > 0 && (
                  <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 p-8">
                      <CardTitle className="flex items-center gap-4 text-slate-800 text-2xl">
                        <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        Awards & Honors
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        {achievements.map((achievement, index) => (
                          <div key={index} className="p-6 bg-gradient-to-r from-amber-50/50 to-white rounded-xl border border-amber-200/50 hover:shadow-lg transition-all duration-300">
                            <h3 className="font-bold text-slate-800 text-xl mb-2">{achievement.position}</h3>
                            <p className="text-amber-700 font-semibold text-lg mb-2">{achievement.organization}</p>
                            <p className="text-slate-500 font-medium">{formatDate(achievement.date)}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Talks & Events Section */}
              <TabsContent value="talks" className="m-0">
                {talksEvents.length > 0 && (
                  <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 p-8">
                      <CardTitle className="flex items-center gap-4 text-slate-800 text-2xl">
                        <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        Talks & Events
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        {talksEvents.map((event, index) => (
                          <div key={index} className="p-6 bg-gradient-to-r from-orange-50/50 to-white rounded-xl border border-orange-200/50 hover:shadow-lg transition-all duration-300">
                            <h3 className="font-bold text-slate-800 text-xl mb-2">{event.event}</h3>
                            <p className="text-slate-500 font-medium mb-3">{formatDate(event.date)}</p>
                            {event.organizer && <p className="text-orange-700 font-semibold mb-3">Organizer: {event.organizer}</p>}
                            {event.description && <p className="text-slate-700 leading-relaxed">{event.description}</p>}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Gallery Section */}
              <TabsContent value="gallery" className="m-0">
                {gallery.length > 0 && (
                  <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 p-8">
                      <CardTitle className="flex items-center gap-4 text-slate-800 text-2xl">
                        <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                          <ImageIcon className="w-5 h-5 text-white" />
                        </div>
                        Gallery
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {gallery.map((item, index) => (
                          <div key={index} className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
                            <img
                              src={item.image_url}
                              alt={item.caption || 'Gallery item'}
                              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                              }}
                            />
                            {item.caption && (
                              <div className="p-6">
                                <p className="text-slate-600 leading-relaxed">{item.caption}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </header>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-16 m-0">
        <div className="w-full px-8 text-center">
          <p className="text-slate-300 text-lg">
            © {new Date().getFullYear()} {profile.name}. Academic Portfolio.
          </p>
        </div>
      </footer>
    </div>
  );
}
