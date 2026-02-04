import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Bell, FileText, Calendar, Megaphone, DollarSign, Award, CheckCircle } from 'lucide-react';
import { Notification } from '../contexts/DataContext';

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkRead: (notificationId: string) => void;
}

export function NotificationPanel({ notifications, onMarkRead }: NotificationPanelProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'leave':
        return <FileText className="h-5 w-5" />;
      case 'event':
        return <Calendar className="h-5 w-5" />;
      case 'announcement':
        return <Megaphone className="h-5 w-5" />;
      case 'fee':
        return <DollarSign className="h-5 w-5" />;
      case 'grade':
        return <Award className="h-5 w-5" />;
      case 'achievement':
        return <Award className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'leave':
        return 'bg-blue-100 text-blue-800';
      case 'event':
        return 'bg-purple-100 text-purple-800';
      case 'announcement':
        return 'bg-orange-100 text-orange-800';
      case 'fee':
        return 'bg-green-100 text-green-800';
      case 'grade':
        return 'bg-indigo-100 text-indigo-800';
      case 'achievement':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="rounded-full h-5 w-5 p-0 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => notifications.forEach(n => !n.read && onMarkRead(n.id))}
          >
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No notifications</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map(notification => (
            <Card
              key={notification.id}
              className={`${!notification.read ? 'border-indigo-500 bg-indigo-50' : ''} cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => !notification.read && onMarkRead(notification.id)}
            >
              <CardContent className="py-3">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{notification.title}</span>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-indigo-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleString()}
                      </span>
                      <Badge variant="outline" className={`text-xs ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </Badge>
                    </div>
                  </div>
                  {notification.read && (
                    <CheckCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
