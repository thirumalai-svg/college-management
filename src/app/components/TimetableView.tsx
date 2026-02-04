import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, MapPin, User } from 'lucide-react';
import { TimeTableEntry } from '../contexts/DataContext';

interface TimetableViewProps {
  timetable: TimeTableEntry[];
}

export function TimetableView({ timetable }: TimetableViewProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
  const maxPeriod = Math.max(...timetable.map(entry => entry.period));

  const getCurrentDay = () => {
    const today = new Date().getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[today];
  };

  const currentDay = getCurrentDay();

  const getTodayClasses = () => {
    return timetable
      .filter(entry => entry.day === currentDay)
      .sort((a, b) => a.period - b.period);
  };

  const todayClasses = getTodayClasses();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Class Timetable</h2>
        <p className="text-gray-600">Your weekly class schedule</p>
      </div>

      {/* Today's Classes */}
      {todayClasses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Today's Classes - {currentDay}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayClasses.map((entry) => (
                <div key={entry.id} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <span className="text-lg">P{entry.period}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg mb-1">{entry.subject}</div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {entry.startTime} - {entry.endTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {entry.room}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {entry.faculty}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Timetable Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-7 gap-2">
              {/* Header */}
              <div className="font-semibold p-3 bg-gray-100 rounded-lg text-center">
                Period
              </div>
              {days.map(day => (
                <div
                  key={day}
                  className={`font-semibold p-3 rounded-lg text-center ${
                    day === currentDay
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  {day}
                </div>
              ))}

              {/* Timetable Rows */}
              {Array.from({ length: maxPeriod }, (_, i) => i + 1).map(period => (
                <React.Fragment key={period}>
                  <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-center font-medium">
                    Period {period}
                  </div>
                  {days.map(day => {
                    const entry = timetable.find(
                      e => e.day === day && e.period === period
                    );
                    return (
                      <div
                        key={`${day}-${period}`}
                        className={`p-3 rounded-lg border min-h-[100px] ${
                          day === currentDay
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        {entry ? (
                          <div className="space-y-1">
                            <div className="font-semibold text-sm">
                              {entry.subject}
                            </div>
                            <div className="text-xs text-gray-600">
                              {entry.startTime} - {entry.endTime}
                            </div>
                            <div className="text-xs text-gray-600">
                              {entry.room}
                            </div>
                            <div className="text-xs text-gray-500">
                              {entry.faculty}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                            -
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject List */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {Array.from(new Set(timetable.map(e => e.subject))).map(subject => {
              const entry = timetable.find(e => e.subject === subject);
              const count = timetable.filter(e => e.subject === subject).length;
              return (
                <div key={subject} className="p-4 border rounded-lg">
                  <div className="font-semibold mb-2">{subject}</div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {entry?.faculty}
                    </div>
                    <div>
                      <Badge variant="outline">{count} periods/week</Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
