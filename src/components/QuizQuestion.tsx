
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestionProps {
  question: string;
  options: QuizOption[];
  correctAnswer: string;
  explanation: string;
  onAnswered?: () => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  options,
  correctAnswer,
  explanation,
  onAnswered
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isCorrect = selectedOption === correctAnswer;

  const handleSubmit = () => {
    if (selectedOption) {
      setIsSubmitted(true);
      if (onAnswered) {
        onAnswered();
      }
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">{question}</h3>

      <RadioGroup
        value={selectedOption || ""}
        onValueChange={isSubmitted ? undefined : setSelectedOption}
        className="space-y-3 mb-6"
        disabled={isSubmitted}
      >
        {options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={option.id} 
              id={option.id} 
              className={cn(
                isSubmitted && option.id === correctAnswer && "border-green-500 text-green-500",
                isSubmitted && option.id === selectedOption && option.id !== correctAnswer && "border-red-500 text-red-500"
              )}
            />
            <Label 
              htmlFor={option.id}
              className={cn(
                "cursor-pointer",
                isSubmitted && option.id === correctAnswer && "text-green-600 font-medium",
                isSubmitted && option.id === selectedOption && option.id !== correctAnswer && "text-red-600 font-medium"
              )}
            >
              {option.text}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {isSubmitted && (
        <div className={cn(
          "p-4 rounded-md mb-4",
          isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
        )}>
          <div className="flex items-center mb-2">
            {isCorrect ? (
              <>
                <Check size={18} className="text-green-600 mr-2" />
                <span className="font-medium text-green-800">Correct!</span>
              </>
            ) : (
              <>
                <X size={18} className="text-red-600 mr-2" />
                <span className="font-medium text-red-800">Incorrect!</span>
              </>
            )}
          </div>
          <p className="text-sm">{explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        {isSubmitted ? (
          <Button onClick={handleReset} variant="outline">
            Try Another Question
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!selectedOption}>
            Check Answer
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizQuestion;
