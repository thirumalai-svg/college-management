import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Trophy, Award, Star, Lightbulb, Heart } from 'lucide-react';
import { Achievement } from '../contexts/DataContext';

interface AchievementsViewProps {
  achievements: Achievement[];
}

export function AchievementsView({ achievements }: AchievementsViewProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic':
        return <Award className="h-6 w-6" />;
      case 'technical':
        return <Lightbulb className="h-6 w-6" />;
      case 'sports':
        return <Trophy className="h-6 w-6" />;
      case 'cultural':
        return <Star className="h-6 w-6" />;
      case 'social':
        return <Heart className="h-6 w-6" />;
      default:
        return <Award className="h-6 w-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic':
        return 'bg-blue-100 text-blue-800';
      case 'technical':
        return 'bg-purple-100 text-purple-800';
      case 'sports':
        return 'bg-green-100 text-green-800';
      case 'cultural':
        return 'bg-pink-100 text-pink-800';
      case 'social':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const categoryStats = achievements.reduce((acc, achievement) => {
    acc[achievement.category] = (acc[achievement.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Achievements & Certificates</h2>
        <p className="text-gray-600">Your accomplishments and recognitions</p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-5 gap-4">
        {(['academic', 'technical', 'sports', 'cultural', 'social'] as const).map(category => (
          <Card key={category}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 ${getCategoryColor(category)}`}>
                  {getCategoryIcon(category)}
                </div>
                <div className="text-2xl mb-1">{categoryStats[category] || 0}</div>
                <div className="text-sm text-gray-600 capitalize">{category}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievements List */}
      <div className="grid md:grid-cols-2 gap-6">
        {achievements.map(achievement => (
          <Card key={achievement.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${getCategoryColor(achievement.category)}`}>
                  {getCategoryIcon(achievement.category)}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{achievement.title}</CardTitle>
                  <CardDescription>
                    {new Date(achievement.date).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge className={getCategoryColor(achievement.category)} variant="outline">
                  {achievement.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{achievement.description}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-600">
                  Verified by: <span className="font-medium">{achievement.verifiedBy}</span>
                </div>
                {achievement.certificateUrl && (
                  <Badge variant="outline" className="cursor-pointer">
                    View Certificate
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {achievements.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p>No achievements yet. Keep working hard!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
