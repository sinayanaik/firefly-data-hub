
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit } from 'lucide-react';

interface TalkEvent {
  id?: string;
  event: string;
  description?: string;
  date: string;
  organizer?: string;
}

export function TalksEventsManager() {
  const [talksEvents, setTalksEvents] = useState<TalkEvent[]>([]);
  const [formData, setFormData] = useState<TalkEvent>({
    event: '',
    description: '',
    date: '',
    organizer: ''
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTalksEvents();
  }, []);

  const fetchTalksEvents = async () => {
    const { data, error } = await supabase
      .from('talks_events')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching talks/events:', error);
      return;
    }

    setTalksEvents(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editing) {
        const { error } = await supabase
          .from('talks_events')
          .update(formData)
          .eq('id', editing);

        if (error) throw error;
        setEditing(null);
      } else {
        const { error } = await supabase
          .from('talks_events')
          .insert([formData]);

        if (error) throw error;
      }

      toast({
        title: "Success!",
        description: `Talk/Event ${editing ? 'updated' : 'added'} successfully.`,
      });
      
      setFormData({ event: '', description: '', date: '', organizer: '' });
      fetchTalksEvents();
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

  const handleEdit = (talkEvent: TalkEvent) => {
    setFormData(talkEvent);
    setEditing(talkEvent.id!);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this talk/event?')) return;

    const { error } = await supabase
      .from('talks_events')
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
      description: "Talk/Event deleted successfully.",
    });
    
    fetchTalksEvents();
  };

  const resetForm = () => {
    setFormData({ event: '', description: '', date: '', organizer: '' });
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editing ? 'Edit Talk/Event' : 'Add New Talk/Event'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Event/Talk Title"
              value={formData.event}
              onChange={(e) => setFormData({ ...formData, event: e.target.value })}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                placeholder="Date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
              <Input
                placeholder="Organizer (optional)"
                value={formData.organizer || ''}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
              />
            </div>
            <Textarea
              placeholder="Description (optional)"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : (editing ? "Update" : "Add Talk/Event")}
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
          <CardTitle>Talks & Events List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {talksEvents.map((talkEvent) => (
              <div key={talkEvent.id} className="border rounded-lg p-4 flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{talkEvent.event}</h3>
                  <p className="text-sm text-gray-500">{talkEvent.date}</p>
                  {talkEvent.organizer && <p className="text-sm text-gray-600">Organizer: {talkEvent.organizer}</p>}
                  {talkEvent.description && <p className="text-sm mt-2">{talkEvent.description}</p>}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(talkEvent)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(talkEvent.id!)}
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
