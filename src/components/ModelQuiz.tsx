
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QuizQuestion, { QuizQuestionProps } from './QuizQuestion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useProgress } from '@/context/ProgressContext';

interface ModelQuizProps {
  className?: string;
}

const ModelQuiz: React.FC<ModelQuizProps> = ({ className }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const { markCompleted } = useProgress();
  
  const quizQuestions: QuizQuestionProps[] = [
    {
      question: "What is the purpose of a Django model?",
      options: [
        { id: "a", text: "To handle HTTP requests and responses" },
        { id: "b", text: "To define database table structure and relationships" },
        { id: "c", text: "To render HTML templates" },
        { id: "d", text: "To configure URL routing" }
      ],
      correctAnswer: "b",
      explanation: "Django models define the structure of database tables and the relationships between tables. They map Python classes to database tables and instances of those classes to rows in the tables."
    },
    {
      question: "Which of the following is NOT a common field type in Django models?",
      options: [
        { id: "a", text: "CharField" },
        { id: "b", text: "BooleanField" },
        { id: "c", text: "ResponseField" },
        { id: "d", text: "DateTimeField" }
      ],
      correctAnswer: "c",
      explanation: "ResponseField does not exist in Django's model field types. Common field types include CharField, TextField, IntegerField, BooleanField, DateField, DateTimeField, etc."
    },
    {
      question: "What does the '__str__' method in a Django model do?",
      options: [
        { id: "a", text: "Creates a string representation of the model for the database" },
        { id: "b", text: "Validates the model fields before saving" },
        { id: "c", text: "Provides a human-readable representation of the model instance" },
        { id: "d", text: "Converts the model to a JSON string" }
      ],
      correctAnswer: "c",
      explanation: "The __str__ method in a Django model defines the human-readable representation of the object. This is displayed in the Django admin interface and when printing an instance of the model."
    },
    {
      question: "How do you define a relationship between two models where one model has a single reference to another model?",
      options: [
        { id: "a", text: "ManyToManyField" },
        { id: "b", text: "ForeignKey" },
        { id: "c", text: "OneToOneField" },
        { id: "d", text: "LinkField" }
      ],
      correctAnswer: "b",
      explanation: "ForeignKey is used to create a many-to-one relationship. It allows a model to have a reference to another model, such as a Book having an author (where many books can have the same author)."
    },
    {
      question: "What parameter is required when defining a ForeignKey field in a Django model?",
      options: [
        { id: "a", text: "verbose_name" },
        { id: "b", text: "related_name" },
        { id: "c", text: "on_delete" },
        { id: "d", text: "blank" }
      ],
      correctAnswer: "c",
      explanation: "The on_delete parameter is required when defining a ForeignKey relationship. It specifies what happens when the referenced object is deleted. Common options include CASCADE, PROTECT, SET_NULL, etc."
    }
  ];

  const handleQuestionAnswered = () => {
    setAnsweredQuestions(prev => new Set(prev).add(currentQuestionIndex));
    
    // Mark progress in context when a question is answered
    markCompleted(`models_quiz_${currentQuestionIndex}`);
    
    // If all questions answered, go to the next section
    if (answeredQuestions.size === quizQuestions.length - 1) {
      markCompleted('models_quiz_completed');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const progress = ((answeredQuestions.size) / quizQuestions.length) * 100;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Django Models Quiz</span>
          <span className="text-sm font-normal text-gray-500">
            {answeredQuestions.size} of {quizQuestions.length} questions answered
          </span>
        </CardTitle>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent>
        <QuizQuestion 
          key={currentQuestionIndex}
          question={quizQuestions[currentQuestionIndex].question}
          options={quizQuestions[currentQuestionIndex].options}
          correctAnswer={quizQuestions[currentQuestionIndex].correctAnswer}
          explanation={quizQuestions[currentQuestionIndex].explanation}
          onAnswered={handleQuestionAnswered}
        />
        
        <div className="flex justify-between mt-4">
          <Button 
            variant="outline" 
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === quizQuestions.length - 1}
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelQuiz;
