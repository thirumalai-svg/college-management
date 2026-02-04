import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { AttendanceRecord } from '../contexts/DataContext';

interface AttendanceViewProps {
  attendance: AttendanceRecord[];
}

export function AttendanceView({ attendance }: AttendanceViewProps) {
  // Calculate subject-wise attendance
  const subjectStats = attendance.reduce((acc, record) => {
    if (!acc[record.subject]) {
      acc[record.subject] = { present: 0, absent: 0, late: 0, total: 0 };
    }
    acc[record.subject].total++;
    if (record.status === 'present') acc[record.subject].present++;
    if (record.status === 'absent') acc[record.subject].absent++;
    if (record.status === 'late') acc[record.subject].late++;
    return acc;
  }, {} as Record<string, { present: number; absent: number; late: number; total: number }>);

  const chartData = Object.entries(subjectStats).map(([subject, stats]) => ({
    subject: subject.length > 15 ? subject.substring(0, 15) + '...' : subject,
    fullSubject: subject,
    percentage: ((stats.present + stats.late) / stats.total * 100).toFixed(1),
    present: stats.present,
    late: stats.late,
    absent: stats.absent,
  }));

  // Overall stats
  const totalClasses = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'present').length;
  const lateCount = attendance.filter(a => a.status === 'late').length;
  const absentCount = attendance.filter(a => a.status === 'absent').length;
  const overallPercentage = ((presentCount + lateCount) / totalClasses * 100).toFixed(1);

  const pieData = [
    { name: 'Present', value: presentCount, color: '#10b981' },
    { name: 'Late', value: lateCount, color: '#f59e0b' },
    { name: 'Absent', value: absentCount, color: '#ef4444' },
  ];

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'late':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Attendance Tracking</h2>
        <p className="text-gray-600">View your attendance records and statistics</p>
      </div>

      {/* Overall Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl mb-2 ${getAttendanceColor(parseFloat(overallPercentage))}`}>
              {overallPercentage}%
            </div>
            <Progress value={parseFloat(overallPercentage)} className="h-2" />
            <div className="text-sm text-gray-600 mt-2">
              {presentCount + lateCount}/{totalClasses} classes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl text-green-600">{presentCount}</div>
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Late</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl text-yellow-600">{lateCount}</div>
              <Clock className="h-10 w-10 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl text-red-600">{absentCount}</div>
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Attendance</CardTitle>
            <CardDescription>Attendance percentage by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="percentage" fill="#6366f1" name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Distribution</CardTitle>
            <CardDescription>Overall attendance breakdown</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Subject-wise Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(subjectStats).map(([subject, stats]) => {
              const percentage = ((stats.present + stats.late) / stats.total * 100).toFixed(1);
              return (
                <div key={subject} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{subject}</div>
                      <div className="text-sm text-gray-600">
                        {stats.present + stats.late}/{stats.total} classes attended
                      </div>
                    </div>
                    <div className={`text-2xl ${getAttendanceColor(parseFloat(percentage))}`}>
                      {percentage}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={parseFloat(percentage)} className="flex-1" />
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-green-50">
                        <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                        {stats.present}
                      </Badge>
                      {stats.late > 0 && (
                        <Badge variant="outline" className="bg-yellow-50">
                          <Clock className="h-3 w-3 mr-1 text-yellow-600" />
                          {stats.late}
                        </Badge>
                      )}
                      {stats.absent > 0 && (
                        <Badge variant="outline" className="bg-red-50">
                          <XCircle className="h-3 w-3 mr-1 text-red-600" />
                          {stats.absent}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {attendance.slice().reverse().slice(0, 10).map(record => (
              <div key={record.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  {getStatusIcon(record.status)}
                  <div>
                    <div className="font-medium">{record.subject}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(record.date).toLocaleDateString()} • Period {record.period}
                    </div>
                  </div>
                </div>
                <Badge className={
                  record.status === 'present' ? 'bg-green-100 text-green-800' :
                  record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }>
                  {record.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
