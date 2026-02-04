import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Bell, Megaphone, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { Announcement } from '../contexts/DataContext';

interface AnnouncementsViewProps {
  announcements: Announcement[];
}

export function AnnouncementsView({ announcements }: AnnouncementsViewProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'academic':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'event':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'general':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertCircle className="h-5 w-5" />;
      case 'academic':
        return <Bell className="h-5 w-5" />;
      case 'event':
        return <CalendarIcon className="h-5 w-5" />;
      default:
        return <Megaphone className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Announcements & Notice Board</h2>
        <p className="text-gray-600">Latest updates and notifications</p>
      </div>

      <div className="space-y-4">
        {announcements.map(announcement => (
          <Card
            key={announcement.id}
            className={`${
              announcement.type === 'urgent'
                ? 'border-red-500 border-2 shadow-lg'
                : ''
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getTypeColor(announcement.type)}`}>
                    {getTypeIcon(announcement.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      {announcement.type === 'urgent' && (
                        <Badge variant="destructive" className="animate-pulse">
                          URGENT
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Posted by {announcement.postedBy} • {new Date(announcement.postedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Badge className={getTypeColor(announcement.type)} variant="outline">
                  {announcement.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">{announcement.content}</p>
              {(announcement.department || announcement.year) && (
                <div className="mt-4 flex gap-2">
                  {announcement.department && (
                    <Badge variant="outline">
                      {announcement.department}
                    </Badge>
                  )}
                  {announcement.year && (
                    <Badge variant="outline">
                      Year {announcement.year}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
