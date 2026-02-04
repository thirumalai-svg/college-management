import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  LogOut,
  Users,
  FileText,
  Calendar,
  BookOpen,
  TrendingUp,
  User,
  CheckCircle,
  Clock,
  XCircle,
  Megaphone,
  Trophy,
  DollarSign,
  CalendarClock,
} from 'lucide-react';
import { BlockchainLedger } from './BlockchainLedger';
import { AnnouncementsView } from './AnnouncementsView';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const { leaves, events, resources, blockchain } = useData();

  if (!user) return null;

  const pendingLeaves = leaves.filter(leave => leave.status === 'pending').length;
  const approvedLeaves = leaves.filter(leave => leave.status === 'approved').length;
  const rejectedLeaves = leaves.filter(leave => leave.status === 'rejected').length;
  const upcomingEvents = events.filter(event => event.status === 'upcoming').length;
  const totalRegistrations = events.reduce((sum, event) => sum + event.registered, 0);
  const blockchainRecords = blockchain.getChain().length;

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-white">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl">Welcome, {user.name}</h1>
                <p className="text-gray-600">Administrator • {user.department}</p>
              </div>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="leaves">Leave Management</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain Ledger</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div>
              <h2 className="text-2xl mb-2">System Overview</h2>
              <p className="text-gray-600">Complete statistics and analytics</p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-600">Total Leaves</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl">{leaves.length}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {pendingLeaves} pending
                      </div>
                    </div>
                    <FileText className="h-10 w-10 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-600">Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl">{events.length}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {upcomingEvents} upcoming
                      </div>
                    </div>
                    <Calendar className="h-10 w-10 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-600">Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl">{resources.length}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        study materials
                      </div>
                    </div>
                    <BookOpen className="h-10 w-10 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-600">Blockchain</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl">{blockchainRecords}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        immutable records
                      </div>
                    </div>
                    <TrendingUp className="h-10 w-10 text-indigo-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Leave Status Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Leave Applications Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-yellow-50 rounded-lg">
                    <Clock className="h-12 w-12 text-yellow-600 mx-auto mb-2" />
                    <div className="text-3xl mb-1">{pendingLeaves}</div>
                    <div className="text-gray-600">Pending</div>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                    <div className="text-3xl mb-1">{approvedLeaves}</div>
                    <div className="text-gray-600">Approved</div>
                  </div>
                  <div className="text-center p-6 bg-red-50 rounded-lg">
                    <XCircle className="h-12 w-12 text-red-600 mx-auto mb-2" />
                    <div className="text-3xl mb-1">{rejectedLeaves}</div>
                    <div className="text-gray-600">Rejected</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Registrations */}
            <Card>
              <CardHeader>
                <CardTitle>Event Registration Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map(event => (
                    <div key={event.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span>{event.title}</span>
                          <Badge className={getEventTypeColor(event.type)}>
                            {event.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(event.date).toLocaleDateString()} • {event.venue}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl">{event.registered}</div>
                        <div className="text-sm text-gray-600">
                          of {event.capacity}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span>Total Registrations</span>
                      <span className="text-2xl">{totalRegistrations}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leave Management Tab */}
          <TabsContent value="leaves" className="space-y-6">
            <div>
              <h2 className="text-2xl mb-2">Leave Management</h2>
              <p className="text-gray-600">All leave applications across departments</p>
            </div>

            <div className="grid gap-4">
              {leaves.map(leave => (
                <Card key={leave.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>
                          {leave.studentName} ({leave.registerNumber})
                        </CardTitle>
                        <CardDescription className="capitalize">
                          {leave.leaveType} Leave • {leave.fromDate} to {leave.toDate}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(leave.status)}>
                        {leave.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {leave.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                        {leave.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                        {leave.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
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
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div>
              <h2 className="text-2xl mb-2">Event Management</h2>
              <p className="text-gray-600">All events and registrations</p>
            </div>

            <div className="grid gap-4">
              {events.map(event => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>
                          {new Date(event.date).toLocaleDateString()} • {event.venue}
                        </CardDescription>
                      </div>
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Organizer: {event.organizer}
                      </span>
                      <span className="text-gray-600">
                        Registrations: {event.registered}/{event.capacity}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div>
              <h2 className="text-2xl mb-2">Study Resources</h2>
              <p className="text-gray-600">All study materials across departments</p>
            </div>

            <div className="grid gap-4">
              {resources.map(resource => (
                <Card key={resource.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle>{resource.title}</CardTitle>
                        <CardDescription>
                          {resource.subject} • {resource.department} • Year {resource.year}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {resource.type.replace('-', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{resource.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-600">
                        Uploaded by: {resource.uploadedBy}
                      </div>
                      <div className="text-gray-600">
                        {resource.downloads} downloads
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Blockchain Ledger Tab */}
          <TabsContent value="blockchain">
            <BlockchainLedger />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}