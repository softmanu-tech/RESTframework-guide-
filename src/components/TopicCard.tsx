
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TopicCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  link: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  className?: string;
}

const TopicCard: React.FC<TopicCardProps> = ({
  title,
  description,
  icon = <BookOpen className="h-6 w-6" />,
  link,
  difficulty = 'beginner',
  className
}) => {
  const difficultyColor = {
    'beginner': 'text-green-600 bg-green-50',
    'intermediate': 'text-amber-600 bg-amber-50',
    'advanced': 'text-red-600 bg-red-50'
  };

  return (
    <Card className={cn("card-hover", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon}
            <CardTitle>{title}</CardTitle>
          </div>
          <span className={cn("text-xs px-2 py-1 rounded-full font-medium", difficultyColor[difficulty])}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button asChild variant="outline" size="sm">
          <Link to={link}>
            <span>Explore</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TopicCard;
