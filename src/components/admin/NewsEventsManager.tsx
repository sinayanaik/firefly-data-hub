
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit } from 'lucide-react';

interface NewsEvent {
  id?: string;
  text: string;
  date: string;
}

export function NewsEventsManager() {
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>([]);
  const [formData, setFormData] = useState<NewsEvent>({
    text: '',
    date: ''
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchNewsEvents();
  }, []);

  const fetchNewsEvents = async () => {
    const { data, error } = await supabase
      .from('news_events')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching news/events:', error);
      return;
    }

    setNewsEvents(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editing) {
        const { error } = await supabase
          .from('news_events')
          .update(formData)
          .eq('id', editing);

        if (error) throw error;
        setEditing(null);
      } else {
        const { error } = await supabase
          .from('news_events')
          .insert([formData]);

        if (error) throw error;
      }

      toast({
        title: "Success!",
        description: `News/Event ${editing ? 'updated' : 'added'} successfully.`,
      });
      
      setFormData({ text: '', date: '' });
      fetchNewsEvents();
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

  const handleEdit = (newsEvent: NewsEvent) => {
    setFormData(newsEvent);
    setEditing(newsEvent.id!);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news/event?')) return;

    const { error } = await supabase
      .from('news_events')
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
      description: "News/Event deleted successfully.",
    });
    
    fetchNewsEvents();
  };

  const resetForm = () => {
    setFormData({ text: '', date: '' });
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editing ? 'Edit News/Event' : 'Add New News/Event'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="date"
              placeholder="Date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <Textarea
              placeholder="News/Event Text"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              rows={3}
              required
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : (editing ? "Update" : "Add News/Event")}
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
          <CardTitle>News & Events List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {newsEvents.map((newsEvent) => (
              <div key={newsEvent.id} className="border rounded-lg p-4 flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-2">{newsEvent.date}</p>
                  <p>{newsEvent.text}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(newsEvent)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(newsEvent.id!)}
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
