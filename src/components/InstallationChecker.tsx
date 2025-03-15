
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Check, Clock, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useProgress } from '@/context/ProgressContext';
import { Card } from '@/components/ui/card';

interface Step {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'skipped';
}

export interface InstallationCheckerHandle {
  completeStep: (stepId: string) => void;
  markStepInProgress: (stepId: string) => void;
}

interface InstallationCheckerProps {
  className?: string;
  onAllCompleted?: () => void;
}

const InstallationChecker = forwardRef<InstallationCheckerHandle, InstallationCheckerProps>(({ 
  className,
  onAllCompleted
}, ref) => {
  const { markCompleted } = useProgress();
  
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 'virtualenv',
      title: 'Set up Virtual Environment',
      description: 'Create and activate a virtual environment for your project',
      status: 'pending'
    },
    {
      id: 'django',
      title: 'Install Django',
      description: 'Install Django framework using pip',
      status: 'pending'
    },
    {
      id: 'drf',
      title: 'Install Django REST Framework',
      description: 'Install Django REST Framework package',
      status: 'pending'
    },
    {
      id: 'project',
      title: 'Create Django Project',
      description: 'Create a new Django project using django-admin',
      status: 'pending'
    },
    {
      id: 'app',
      title: 'Create Django App',
      description: 'Create a new app within your Django project',
      status: 'pending'
    },
    {
      id: 'settings',
      title: 'Configure REST Framework',
      description: 'Add REST Framework to INSTALLED_APPS and configure it',
      status: 'pending'
    },
    {
      id: 'migrate',
      title: 'Run Migrations',
      description: 'Apply database migrations to set up your database',
      status: 'pending'
    },
    {
      id: 'github',
      title: 'Connect with GitHub',
      description: 'Initialize git repository and push to GitHub',
      status: 'pending'
    }
  ]);
  
  const updateStepStatus = (stepId: string, status: Step['status']) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    );
    
    if (status === 'completed') {
      markCompleted(`installation_${stepId}`);
    }
  };
  
  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    completeStep: (stepId: string) => {
      updateStepStatus(stepId, 'completed');
    },
    markStepInProgress: (stepId: string) => {
      updateStepStatus(stepId, 'in-progress');
    }
  }));
  
  // Track progress percentage
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const progressPercentage = (completedSteps / steps.length) * 100;
  
  useEffect(() => {
    if (completedSteps === steps.length && onAllCompleted) {
      onAllCompleted();
    }
  }, [completedSteps, steps.length, onAllCompleted]);

  return (
    <Card className={cn("bg-white shadow-sm", className)}>
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-medium text-gray-900">Installation Progress</h3>
        <p className="text-sm text-gray-500">Track your setup progress</p>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">{completedSteps} of {steps.length} completed</span>
          <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2 mb-6" />
        
        <div className="space-y-3">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={cn(
                "border rounded-md p-3 transition-colors",
                step.status === 'completed' ? "bg-green-50 border-green-200" : 
                step.status === 'in-progress' ? "bg-blue-50 border-blue-200" : 
                "bg-white"
              )}
            >
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                  {step.status === 'completed' ? (
                    <div className="bg-green-100 text-green-600 rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  ) : step.status === 'in-progress' ? (
                    <div className="bg-blue-100 text-blue-600 rounded-full p-1">
                      <Clock className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="bg-gray-100 text-gray-400 rounded-full p-1">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className={cn(
                    "font-medium text-sm",
                    step.status === 'completed' ? "text-green-800" : 
                    step.status === 'in-progress' ? "text-blue-800" : 
                    "text-gray-800"
                  )}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
});

InstallationChecker.displayName = "InstallationChecker";

export default InstallationChecker;
