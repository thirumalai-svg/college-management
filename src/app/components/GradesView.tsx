import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { GradeRecord } from '../contexts/DataContext';

interface GradesViewProps {
  grades: GradeRecord[];
}

export function GradesView({ grades }: GradesViewProps) {
  // Calculate GPA
  const gradePoints: Record<string, number> = {
    'A+': 10,
    'A': 9,
    'B+': 8,
    'B': 7,
    'C+': 6,
    'C': 5,
    'D': 4,
    'F': 0,
  };

  const calculateGPA = (gradesList: GradeRecord[]) => {
    const totalCredits = gradesList.reduce((sum, g) => sum + g.credits, 0);
    const totalPoints = gradesList.reduce((sum, g) => sum + (gradePoints[g.grade] || 0) * g.credits, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const semesters = Array.from(new Set(grades.map(g => g.semester)));
  const currentSemester = semesters[semesters.length - 1];
  const currentGrades = grades.filter(g => g.semester === currentSemester);
  
  const overallGPA = calculateGPA(grades);
  const semesterGPA = calculateGPA(currentGrades);

  // Chart data
  const barChartData = currentGrades.map(grade => ({
    subject: grade.subject.length > 15 ? grade.subject.substring(0, 15) + '...' : grade.subject,
    internal: grade.internalMarks,
    external: grade.externalMarks,
    total: grade.totalMarks,
  }));

  const radarData = currentGrades.map(grade => ({
    subject: grade.subject.split(' ')[0],
    percentage: (grade.totalMarks / 150 * 100).toFixed(0),
  }));

  const getGradeColor = (grade: string) => {
    if (grade === 'A+' || grade === 'A') return 'bg-green-100 text-green-800';
    if (grade === 'B+' || grade === 'B') return 'bg-blue-100 text-blue-800';
    if (grade === 'C+' || grade === 'C') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Academic Performance</h2>
        <p className="text-gray-600">Your grades and GPA</p>
      </div>

      {/* GPA Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Overall GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl mb-2 text-indigo-600">{overallGPA}</div>
            <Progress value={parseFloat(overallGPA) * 10} className="h-2" />
            <div className="text-sm text-gray-600 mt-2">Out of 10.0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Semester GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl mb-2 text-blue-600">{semesterGPA}</div>
            <Progress value={parseFloat(semesterGPA) * 10} className="h-2" />
            <div className="text-sm text-gray-600 mt-2">{currentSemester}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Total Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl mb-2 text-purple-600">
              {grades.reduce((sum, g) => sum + g.credits, 0)}
            </div>
            <div className="text-sm text-gray-600 mt-2">Credits Earned</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Marks</CardTitle>
            <CardDescription>{currentSemester}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="internal" fill="#8b5cf6" name="Internal" stackId="a" />
                <Bar dataKey="external" fill="#6366f1" name="External" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Radar</CardTitle>
            <CardDescription>Overall subject performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name="Percentage" dataKey="percentage" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Semester-wise Grades */}
      {semesters.map(semester => {
        const semesterGrades = grades.filter(g => g.semester === semester);
        const gpa = calculateGPA(semesterGrades);

        return (
          <Card key={semester}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{semester}</CardTitle>
                  <CardDescription>GPA: {gpa}</CardDescription>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {semesterGrades.reduce((sum, g) => sum + g.credits, 0)} Credits
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Subject</th>
                      <th className="text-center py-3 px-4">Internal</th>
                      <th className="text-center py-3 px-4">External</th>
                      <th className="text-center py-3 px-4">Total</th>
                      <th className="text-center py-3 px-4">Grade</th>
                      <th className="text-center py-3 px-4">Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semesterGrades.map(grade => (
                      <tr key={grade.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{grade.subject}</td>
                        <td className="text-center py-3 px-4">{grade.internalMarks}/50</td>
                        <td className="text-center py-3 px-4">{grade.externalMarks}/100</td>
                        <td className="text-center py-3 px-4">{grade.totalMarks}/150</td>
                        <td className="text-center py-3 px-4">
                          <Badge className={getGradeColor(grade.grade)}>
                            {grade.grade}
                          </Badge>
                        </td>
                        <td className="text-center py-3 px-4">{grade.credits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
