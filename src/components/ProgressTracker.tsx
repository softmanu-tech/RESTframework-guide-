
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Trophy, BookOpen, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProgress } from '@/context/ProgressContext';

interface ProgressTrackerProps {
  className?: string;
  currentSection?: string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ className, currentSection }) => {
  const { completedCount, totalItems, progressPercentage } = useProgress();
  
  // If currentSection is provided as prop, use it; otherwise use from context
  const { currentSection: contextSection, setCurrentSection } = useProgress();
  const displaySection = currentSection || contextSection;
  
  // Update context if currentSection prop is provided
  React.useEffect(() => {
    if (currentSection && setCurrentSection) {
      setCurrentSection(currentSection);
    }
  }, [currentSection, setCurrentSection]);

  return (
    <div className={cn("bg-white shadow-md rounded-lg p-4 mb-6", className)}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-medium text-gray-600">Your Progress</h3>
          {displaySection && (
            <p className="text-xs text-gray-500">Current: {displaySection}</p>
          )}
        </div>
        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded">
          <Trophy className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-bold text-amber-700">{completedCount}/{totalItems}</span>
        </div>
      </div>
      
      <div className="mb-2">
        <Progress value={progressPercentage} className="h-2" />
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <BookOpen className="h-3 w-3" />
          <span>Learning</span>
        </div>
        <div className="font-medium">{progressPercentage}% complete</div>
        <div className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-green-500" />
          <span>{progressPercentage >= 100 ? "Mastered" : "In progress"}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
