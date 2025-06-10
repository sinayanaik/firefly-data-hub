import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, User, GraduationCap, Award, Users, BookOpen, Calendar, Newspaper, Image as ImageIcon } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Academic Portfolio
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Profile Section */}
        <div className="mb-12">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-slate-50/50">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {profile.profile_image_url && (
                  <div className="flex-shrink-0 mx-auto lg:mx-0">
                    <div className="relative">
                      <img
                        src={profile.profile_image_url}
                        alt={profile.name}
                        className="w-40 h-40 rounded-2xl object-cover shadow-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                      <div className="absolute inset-0 rounded-2xl ring-4 ring-white/50"></div>
                    </div>
                  </div>
                )}
                <div className="flex-1 text-center lg:text-left">
                  <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-3 leading-tight">
                    {profile.name}
                  </h1>
                  <h2 className="text-xl lg:text-2xl text-slate-600 mb-6 font-medium">
                    {profile.title}
                  </h2>
                  <p className="text-lg text-slate-700 mb-6 leading-relaxed max-w-3xl">
                    {profile.bio}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 text-slate-600 mb-6">
                    {profile.email && (
                      <div className="flex items-center justify-center lg:justify-start gap-2 bg-slate-100/70 px-4 py-2 rounded-lg">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">{profile.email}</span>
                      </div>
                    )}
                    {profile.phone && (
                      <div className="flex items-center justify-center lg:justify-start gap-2 bg-slate-100/70 px-4 py-2 rounded-lg">
                        <Phone className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">{profile.phone}</span>
                      </div>
                    )}
                    {profile.office_location && (
                      <div className="flex items-center justify-center lg:justify-start gap-2 bg-slate-100/70 px-4 py-2 rounded-lg">
                        <MapPin className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium">{profile.office_location}</span>
                      </div>
                    )}
                  </div>

                  {profile.research_interests && profile.research_interests.length > 0 && (
                    <div className="text-center lg:text-left">
                      <h3 className="font-semibold text-slate-800 mb-3">Research Interests</h3>
                      <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                        {profile.research_interests.map((interest, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
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

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Experience Section */}
          {experience.length > 0 && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-slate-800">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index} className="relative pl-6 border-l-2 border-blue-100 last:border-l-0">
                      <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-2 top-1"></div>
                      <h3 className="font-semibold text-slate-800 text-lg">{exp.role}</h3>
                      <p className="text-blue-600 font-medium">{exp.place}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Education Section */}
          {education.length > 0 && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-slate-800">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={index} className="relative pl-6 border-l-2 border-green-100 last:border-l-0">
                      <div className="absolute w-3 h-3 bg-green-600 rounded-full -left-2 top-1"></div>
                      <h3 className="font-semibold text-slate-800 text-lg">{edu.degree}</h3>
                      {edu.speciality && <p className="text-green-600 font-medium">{edu.speciality}</p>}
                      <p className="text-slate-600">{edu.place}</p>
                      <p className="text-sm text-slate-500 mt-1">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Full Width Sections */}
        <div className="space-y-8 mt-8">
          {/* Publications Section */}
          {publications.length > 0 && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-slate-800">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  Publications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  {publications.map((pub, index) => (
                    <div key={index} className="p-5 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-200">
                      <h3 className="font-semibold text-lg text-slate-800 mb-2">{pub.title}</h3>
                      <p className="text-slate-600 font-medium mb-3">{pub.authors}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-500">
                        <div>
                          <span className="font-medium">Published:</span> {formatDate(pub.publication_date)}
                        </div>
                        {pub.source && (
                          <div>
                            <span className="font-medium">Source:</span> {pub.source}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Citations:</span> 
                          <Badge variant="outline" className="ml-2">{pub.total_citations}</Badge>
                        </div>
                      </div>
                      {pub.description && <p className="text-slate-700 mt-3">{pub.description}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Achievements and People Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Achievements Section */}
            {achievements.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    Achievements & Honours
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-amber-50 to-white rounded-lg border border-amber-200">
                        <h3 className="font-semibold text-slate-800">{achievement.position}</h3>
                        <p className="text-amber-700 font-medium">{achievement.organization}</p>
                        <p className="text-sm text-slate-500">{formatDate(achievement.date)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* People Section */}
            {people.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    People
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-4">
                    {people.map((person, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-indigo-50 to-white rounded-lg border border-indigo-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-800">{person.name}</h3>
                            <p className="text-slate-600">{person.role}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={person.current_status === 'current' ? 'default' : 'secondary'} className="mb-1">
                              {person.current_status}
                            </Badge>
                            <p className="text-xs text-slate-500">
                              {formatDate(person.start_date)} - {person.end_date ? formatDate(person.end_date) : 'Present'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Gallery Section */}
          {gallery.length > 0 && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-slate-800">
                  <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-white" />
                  </div>
                  Gallery
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gallery.map((item, index) => (
                    <div key={index} className="group overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                      <img
                        src={item.image_url}
                        alt={item.caption || 'Gallery item'}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                      {item.caption && (
                        <div className="p-4 bg-white">
                          <p className="text-sm text-slate-600">{item.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bottom sections in grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Collaborators Section */}
            {collaborators.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    Collaborators
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-4">
                    {collaborators.map((collaborator, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-teal-50 to-white rounded-lg border border-teal-200">
                        <h3 className="font-semibold text-slate-800">{collaborator.name}</h3>
                        <p className="text-teal-700 font-medium">{collaborator.designation}</p>
                        <p className="text-slate-600">{collaborator.institute}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Talks & Events Section */}
            {talksEvents.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    Talks & Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {talksEvents.map((event, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-orange-50 to-white rounded-lg border border-orange-200">
                        <h3 className="font-semibold text-slate-800">{event.event}</h3>
                        <p className="text-sm text-slate-500 mb-2">{formatDate(event.date)}</p>
                        {event.organizer && <p className="text-orange-700 font-medium mb-1">Organizer: {event.organizer}</p>}
                        {event.description && <p className="text-slate-700">{event.description}</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* News & Events Section */}
          {newsEvents.length > 0 && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-slate-800">
                  <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
                    <Newspaper className="w-4 h-4 text-white" />
                  </div>
                  News & Events
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {newsEvents.map((news, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-200">
                      <p className="text-sm text-slate-500 mb-2">{formatDate(news.date)}</p>
                      <p className="text-slate-700">{news.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-300">
            © {new Date().getFullYear()} {profile.name}. Academic Portfolio.
          </p>
        </div>
      </footer>
    </div>
  );
}
