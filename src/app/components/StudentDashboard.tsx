import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import {
  LogOut,
  FileText,
  Calendar,
  BookOpen,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  User,
  Bell,
  GraduationCap,
  CalendarClock,
  Megaphone,
  Trophy,
  DollarSign,
  Link as LinkIcon,
} from 'lucide-react';
import { LeaveApplicationForm } from './LeaveApplicationForm';
import { BlockchainLedger } from './BlockchainLedger';
import { AttendanceView } from './AttendanceView';
import { TimetableView } from './TimetableView';
import { AnnouncementsView } from './AnnouncementsView';
import { AchievementsView } from './AchievementsView';
import { GradesView } from './GradesView';
import { FeesView } from './FeesView';
import { NotificationPanel } from './NotificationPanel';
import { toast } from 'sonner';

export function StudentDashboard() {
  const { user, logout } = useAuth();
  const { 
    leaves, 
    events, 
    resources, 
    attendance,
    timetable,
    announcements,
    achievements,
    fees,
    grades,
    notifications,
    blockchain, 
    registerForEvent,
    markNotificationRead,
  } = useData();
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  if (!user) return null;

  const myLeaves = leaves.filter(leave => leave.studentId === user.id);
  const myEvents = events.filter(event => event.registrations.includes(user.id));
  const availableEvents = events.filter(
    event => !event.registrations.includes(user.id) && event.status === 'upcoming'
  );
  const myResources = resources.filter(
    res => res.department === user.department && res.year === user.year
  );
  const myAttendance = attendance.filter(att => att.studentId === user.id);
  const myTimetable = timetable.filter(tt => tt.department === user.department && tt.year === user.year);
  const myAchievements = achievements.filter(ach => ach.studentId === user.id);
  const myFees = fees.filter(fee => fee.studentId === user.id);
  const myGrades = grades.filter(grade => grade.studentId === user.id);
  const myNotifications = notifications.filter(notif => notif.userId === user.id);
  const myBlockchainRecords = blockchain.getRecordsByUser(user.id);
  const unreadNotifications = myNotifications.filter(n => !n.read).length;

  const handleRegisterEvent = (eventId: string) => {
    registerForEvent(eventId, user.id, user.name);
    toast.success('Successfully registered for event!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'hackathon':
        return 'bg-purple-100 text-purple-800';
      case 'workshop':
        return 'bg-blue-100 text-blue-800';
      case 'fest':
        return 'bg-pink-100 text-pink-800';
      case 'seminar':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate attendance percentage
  const totalClasses = myAttendance.length;
  const presentCount = myAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const attendancePercentage = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl">Welcome, {user.name}</h1>
                <p className="text-gray-600">
                  {user.registerNumber} • {user.department} • Year {user.year}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full"
                  >
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-4 top-20 w-96 bg-white border rounded-lg shadow-xl p-4 z-50">
              <NotificationPanel 
                notifications={myNotifications}
                onMarkRead={markNotificationRead}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendance">
              <CalendarClock className="h-4 w-4 mr-2" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="timetable">
              <Calendar className="h-4 w-4 mr-2" />
              Timetable
            </TabsTrigger>
            <TabsTrigger value="grades">
              <GraduationCap className="h-4 w-4 mr-2" />
              Grades
            </TabsTrigger>
            <TabsTrigger value="leaves">
              <FileText className="h-4 w-4 mr-2" />
              Leaves
            </TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="fees">
              <DollarSign className="h-4 w-4 mr-2" />
              Fees
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <Trophy className="h-4 w-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="announcements">
              <Megaphone className="h-4 w-4 mr-2" />
              Announcements
            </TabsTrigger>
            <TabsTrigger value="blockchain">
              <LinkIcon className="h-4 w-4 mr-2" />
              Blockchain
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Attendance</div>
                      <div className="text-3xl">{attendancePercentage}%</div>
                    </div>
                    <CalendarClock className="h-10 w-10 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">GPA</div>
                      <div className="text-3xl">
                        {myGrades.length > 0 
                          ? ((myGrades.reduce((sum, g) => sum + (g.grade === 'A+' ? 10 : g.grade === 'A' ? 9 : 8) * g.credits, 0)) / 
                             myGrades.reduce((sum, g) => sum + g.credits, 0)).toFixed(2)
                          : 'N/A'}
                      </div>
                    </div>
                    <GraduationCap className="h-10 w-10 text-indigo-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Events</div>
                      <div className="text-3xl">{myEvents.length}</div>
                    </div>
                    <Calendar className="h-10 w-10 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Achievements</div>
                      <div className="text-3xl">{myAchievements.length}</div>
                    </div>
                    <Trophy className="h-10 w-10 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="grid md:grid-cols-4 gap-3">
                  <Button onClick={() => setShowLeaveForm(true)} className="justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Apply Leave
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Download Timetable
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Pay Fees
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    View Results
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {myBlockchainRecords.slice(-5).reverse().map(record => (
                    <div key={record.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        {record.type === 'leave' && <FileText className="h-4 w-4 text-indigo-600" />}
                        {record.type === 'event' && <Calendar className="h-4 w-4 text-indigo-600" />}
                        {record.type === 'resource' && <BookOpen className="h-4 w-4 text-indigo-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{record.action}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(record.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <Badge variant="outline">{record.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance">
            <AttendanceView attendance={myAttendance} />
          </TabsContent>

          {/* Timetable Tab */}
          <TabsContent value="timetable">
            <TimetableView timetable={myTimetable} />
          </TabsContent>

          {/* Grades Tab */}
          <TabsContent value="grades">
            <GradesView grades={myGrades} />
          </TabsContent>

          {/* Leaves Tab */}
          <TabsContent value="leaves" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl">Leave Applications</h2>
                <p className="text-gray-600">Manage your leave requests</p>
              </div>
              <Button onClick={() => setShowLeaveForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Apply for Leave
              </Button>
            </div>

            {showLeaveForm && (
              <LeaveApplicationForm onClose={() => setShowLeaveForm(false)} />
            )}

            <div className="grid gap-4">
              {myLeaves.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    No leave applications yet. Click "Apply for Leave" to get started.
                  </CardContent>
                </Card>
              ) : (
                myLeaves.slice().reverse().map(leave => (
                  <Card key={leave.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="font-semibold text-lg capitalize">{leave.leaveType} Leave</div>
                          <div className="text-gray-600">{leave.fromDate} to {leave.toDate}</div>
                        </div>
                        <Badge className={getStatusColor(leave.status)}>
                          {leave.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {leave.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                          {leave.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                          {leave.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-gray-600">Reason:</span> {leave.reason}
                        </div>
                        <div>
                          <span className="text-gray-600">Applied on:</span> {leave.appliedDate}
                        </div>
                        {leave.reviewedBy && (
                          <>
                            <div>
                              <span className="text-gray-600">Reviewed by:</span> {leave.reviewedBy}
                            </div>
                            {leave.comments && (
                              <div>
                                <span className="text-gray-600">Comments:</span> {leave.comments}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div>
              <h2 className="text-2xl mb-2">Event Registration</h2>
              <p className="text-gray-600">Hackathons, workshops, fests, and more</p>
            </div>

            {myEvents.length > 0 && (
              <div>
                <h3 className="text-xl mb-4">My Registered Events</h3>
                <div className="grid gap-4">
                  {myEvents.map(event => (
                    <Card key={event.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="font-semibold text-lg">{event.title}</div>
                            <div className="text-gray-600">
                              {new Date(event.date).toLocaleDateString()} • {event.venue}
                            </div>
                          </div>
                          <Badge className={getEventTypeColor(event.type)}>
                            {event.type}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{event.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            Organizer: {event.organizer}
                          </span>
                          <span className="text-gray-600">
                            {event.registered}/{event.capacity} registered
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xl mb-4">Available Events</h3>
              <div className="grid gap-4">
                {availableEvents.map(event => (
                  <Card key={event.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="font-semibold text-lg">{event.title}</div>
                          <div className="text-gray-600">
                            {new Date(event.date).toLocaleDateString()} • {event.venue}
                          </div>
                        </div>
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {event.registered}/{event.capacity} registered
                        </span>
                        <Button
                          onClick={() => handleRegisterEvent(event.id)}
                          disabled={event.registered >= event.capacity}
                        >
                          {event.registered >= event.capacity ? 'Full' : 'Register'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div>
              <h2 className="text-2xl mb-2">Study Resources</h2>
              <p className="text-gray-600">
                {user.department} • Year {user.year}
              </p>
            </div>

            <div className="grid gap-4">
              {myResources.map(resource => (
                <Card key={resource.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{resource.title}</div>
                        <div className="text-gray-600">{resource.subject}</div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {resource.type.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{resource.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <div className="text-gray-600">
                          Uploaded by: {resource.uploadedBy}
                        </div>
                        <div className="text-gray-600">
                          Date: {new Date(resource.uploadDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600">
                          <Download className="h-4 w-4 inline mr-1" />
                          {resource.downloads} downloads
                        </span>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Fees Tab */}
          <TabsContent value="fees">
            <FeesView fees={myFees} />
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <AchievementsView achievements={myAchievements} />
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements">
            <AnnouncementsView announcements={announcements} />
          </TabsContent>

          {/* Blockchain Tab */}
          <TabsContent value="blockchain">
            <BlockchainLedger userFilter={user.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
