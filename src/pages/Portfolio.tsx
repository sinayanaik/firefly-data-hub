
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, User, GraduationCap, Award, Users, BookOpen, Calendar, Newspaper, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Academic Portfolio</h2>
          <p className="text-gray-600 mb-4">No profile data available yet.</p>
          <Link to="/admin" className="text-blue-600 hover:underline">
            Go to Admin Panel to add content
          </Link>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Academic Portfolio</h1>
            <Link 
              to="/admin" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {profile.profile_image_url && (
                <div className="flex-shrink-0">
                  <img
                    src={profile.profile_image_url}
                    alt={profile.name}
                    className="w-32 h-32 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                <h2 className="text-xl text-gray-600 mb-4">{profile.title}</h2>
                <p className="text-gray-700 mb-4">{profile.bio}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  {profile.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {profile.email}
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {profile.phone}
                    </div>
                  )}
                  {profile.office_location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profile.office_location}
                    </div>
                  )}
                </div>

                {profile.research_interests && profile.research_interests.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Research Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.research_interests.map((interest, index) => (
                        <Badge key={index} variant="secondary">{interest}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experience Section */}
        {experience.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <div key={index}>
                    <h3 className="font-semibold">{exp.role}</h3>
                    <p className="text-gray-600">{exp.place}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                    </p>
                    {index < experience.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold">{edu.degree}</h3>
                    {edu.speciality && <p className="text-gray-600">{edu.speciality}</p>}
                    <p className="text-gray-600">{edu.place}</p>
                    <p className="text-sm text-gray-500">{edu.year}</p>
                    {index < education.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Achievements Section */}
        {achievements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Professional Achievements & Honours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index}>
                    <h3 className="font-semibold">{achievement.position}</h3>
                    <p className="text-gray-600">{achievement.organization}</p>
                    <p className="text-sm text-gray-500">{formatDate(achievement.date)}</p>
                    {index < achievements.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Publications Section */}
        {publications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Publications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {publications.map((pub, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-lg">{pub.title}</h3>
                    <p className="text-gray-600 font-medium">{pub.authors}</p>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>Published: {formatDate(pub.publication_date)}</p>
                      {pub.source && <p>Source: {pub.source}</p>}
                      {pub.publisher && <p>Publisher: {pub.publisher}</p>}
                      <p>Citations: {pub.total_citations}</p>
                    </div>
                    {pub.description && <p className="text-gray-700 mt-2">{pub.description}</p>}
                    {index < publications.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Talks & Events Section */}
        {talksEvents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Talks & Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {talksEvents.map((event, index) => (
                  <div key={index}>
                    <h3 className="font-semibold">{event.event}</h3>
                    <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                    {event.organizer && <p className="text-gray-600">Organizer: {event.organizer}</p>}
                    {event.description && <p className="text-gray-700 mt-1">{event.description}</p>}
                    {index < talksEvents.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* People Section */}
        {people.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                People
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {people.map((person, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <h3 className="font-semibold">{person.name}</h3>
                    <p className="text-gray-600">{person.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={person.current_status === 'current' ? 'default' : 'secondary'}>
                        {person.current_status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {formatDate(person.start_date)} - {person.end_date ? formatDate(person.end_date) : 'Present'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Collaborators Section */}
        {collaborators.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Collaborators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collaborators.map((collaborator, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <h3 className="font-semibold">{collaborator.name}</h3>
                    <p className="text-gray-600">{collaborator.designation}</p>
                    <p className="text-gray-600">{collaborator.institute}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gallery Section */}
        {gallery.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Gallery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gallery.map((item, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.caption || 'Gallery item'}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    {item.caption && (
                      <div className="p-3">
                        <p className="text-sm text-gray-600">{item.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* News & Events Section */}
        {newsEvents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="w-5 h-5" />
                News & Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newsEvents.map((news, index) => (
                  <div key={index}>
                    <p className="text-sm text-gray-500 mb-1">{formatDate(news.date)}</p>
                    <p className="text-gray-700">{news.text}</p>
                    {index < newsEvents.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
