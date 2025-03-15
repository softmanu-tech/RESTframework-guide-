
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeBlock from './CodeBlock';
import { ArrowRight, Check, Lightbulb, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PracticeExerciseProps {
  title: string;
  description: string;
  task: string;
  initialCode: string;
  solution: string;
  hints: string[];
  className?: string;
}

const PracticeExercise: React.FC<PracticeExerciseProps> = ({
  title,
  description,
  task,
  initialCode,
  solution,
  hints,
  className
}) => {
  const [showSolution, setShowSolution] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [hintsRevealed, setHintsRevealed] = useState<boolean[]>(hints.map(() => false));

  const revealNextHint = () => {
    if (currentHint < hints.length) {
      const newHintsRevealed = [...hintsRevealed];
      newHintsRevealed[currentHint] = true;
      setHintsRevealed(newHintsRevealed);
      setCurrentHint(currentHint + 1);
    }
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-md overflow-hidden", className)}>
      <div className="p-6 border-b">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <h4 className="font-medium text-blue-800 mb-1">Your Task:</h4>
          <p className="text-blue-700">{task}</p>
        </div>
      </div>

      <Tabs defaultValue="code" className="w-full">
        <div className="px-6 pt-4 border-b">
          <TabsList>
            <TabsTrigger value="code">Starter Code</TabsTrigger>
            <TabsTrigger value="hints" disabled={hints.length === 0}>Hints</TabsTrigger>
            <TabsTrigger value="solution">Solution</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="code" className="p-0">
          <div className="p-6">
            <CodeBlock code={initialCode} />
          </div>
        </TabsContent>

        <TabsContent value="hints" className="p-0">
          <div className="p-6">
            <div className="mb-4">
              <h4 className="flex items-center text-lg font-medium mb-2">
                <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
                <span>Helpful Hints</span>
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Struggling with the exercise? Here are some hints to guide you. Try to solve it on your own first!
              </p>
            </div>

            <div className="space-y-4">
              {hints.map((hint, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "p-4 border rounded-md transition-all",
                    hintsRevealed[index] 
                      ? "border-amber-200 bg-amber-50" 
                      : "border-gray-200 bg-gray-50 opacity-60"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">Hint {index + 1}</h5>
                    {hintsRevealed[index] && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  {hintsRevealed[index] ? (
                    <p className="mt-1 text-sm">{hint}</p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">Click "Reveal Hint" to see this hint.</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button 
                onClick={revealNextHint} 
                disabled={currentHint >= hints.length || hintsRevealed.every(h => h)}
                className="flex items-center"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                Reveal Next Hint
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="solution" className="p-0">
          <div className="p-6">
            <div className="mb-4">
              {!showSolution ? (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                  <h4 className="font-medium text-yellow-800 mb-2">Are you sure?</h4>
                  <p className="text-sm text-yellow-700 mb-4">
                    We recommend trying to solve the exercise on your own first. Check the hints if you need some guidance!
                  </p>
                  <Button 
                    onClick={() => setShowSolution(true)}
                    variant="outline"
                    className="bg-white"
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Show Solution Anyway
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Solution</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowSolution(false)}
                      className="flex items-center text-xs"
                    >
                      <RefreshCw className="mr-1 h-3 w-3" />
                      Hide
                    </Button>
                  </div>
                  <CodeBlock code={solution} />
                </>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PracticeExercise;
