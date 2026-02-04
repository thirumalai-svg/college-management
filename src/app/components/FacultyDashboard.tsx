import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  LogOut,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  User,
} from 'lucide-react';
import { BlockchainLedger } from './BlockchainLedger';
import { toast } from 'sonner';

export function FacultyDashboard() {
  const { user, logout } = useAuth();
  const { leaves, events, reviewLeave } = useData();
  const [reviewingLeave, setReviewingLeave] = useState<string | null>(null);
  const [comments, setComments] = useState('');

  if (!user) return null;

  const pendingLeaves = leaves.filter(leave => leave.status === 'pending');
  const reviewedLeaves = leaves.filter(leave => leave.status !== 'pending');

  const handleReview = (leaveId: string, status: 'approved' | 'rejected') => {
    reviewLeave(leaveId, status, user.name, comments);
    setReviewingLeave(null);
    setComments('');
    toast.success(`Leave ${status} successfully`);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl">Welcome, {user.name}</h1>
                <p className="text-gray-600">Faculty • {user.department}</p>
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
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Approvals
              {pendingLeaves.length > 0 && (
                <Badge className="ml-2 bg-red-500">{pendingLeaves.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed Applications</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain Ledger</TabsTrigger>
          </TabsList>

          {/* Pending Leave Applications */}
          <TabsContent value="pending" className="space-y-6">
            <div>
              <h2 className="text-2xl mb-2">Pending Leave Applications</h2>
              <p className="text-gray-600">Review and approve/reject student leave requests</p>
            </div>

            <div className="grid gap-4">
              {pendingLeaves.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    No pending leave applications
                  </CardContent>
                </Card>
              ) : (
                pendingLeaves.map(leave => (
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
                          <Clock className="h-3 w-3 mr-1" />
                          {leave.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <span className="text-gray-600">Reason:</span>
                          <p className="mt-1">{leave.reason}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">
                            Applied on: {leave.appliedDate}
                          </span>
                        </div>

                        {reviewingLeave === leave.id ? (
                          <div className="space-y-4 pt-4 border-t">
                            <div className="space-y-2">
                              <Label htmlFor={`comments-${leave.id}`}>Comments (Optional)</Label>
                              <Textarea
                                id={`comments-${leave.id}`}
                                placeholder="Add any comments or instructions..."
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                rows={3}
                              />
                            </div>
                            <div className="flex gap-3">
                              <Button
                                variant="default"
                                onClick={() => handleReview(leave.id, 'approved')}
                                className="flex-1"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleReview(leave.id, 'rejected')}
                                className="flex-1"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setReviewingLeave(null);
                                  setComments('');
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button onClick={() => setReviewingLeave(leave.id)}>
                            Review Application
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Reviewed Applications */}
          <TabsContent value="reviewed" className="space-y-6">
            <div>
              <h2 className="text-2xl mb-2">Reviewed Applications</h2>
              <p className="text-gray-600">History of approved and rejected leaves</p>
            </div>

            <div className="grid gap-4">
              {reviewedLeaves.map(leave => (
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
                        <span className="text-gray-600">Reviewed by:</span> {leave.reviewedBy}
                      </div>
                      <div>
                        <span className="text-gray-600">Reviewed on:</span> {leave.reviewedDate}
                      </div>
                      {leave.comments && (
                        <div>
                          <span className="text-gray-600">Comments:</span> {leave.comments}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events */}
          <TabsContent value="events" className="space-y-6">
            <div>
              <h2 className="text-2xl mb-2">Events Management</h2>
              <p className="text-gray-600">View all events and registrations</p>
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

          {/* Blockchain Ledger */}
          <TabsContent value="blockchain">
            <BlockchainLedger />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
