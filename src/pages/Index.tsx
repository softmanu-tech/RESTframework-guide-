
import React from 'react';
import DocLayout from '@/components/DocLayout';
import TopicCard from '@/components/TopicCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, Server, FileText, Code, Lock, Award, Zap } from 'lucide-react';

const Index = () => {
  return (
    <DocLayout>
      <div>
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-drf-700 to-django-600 bg-clip-text text-transparent">
            Django REST Framework Learning Guide
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive, step-by-step journey from beginner to expert in building RESTful APIs with Django REST Framework
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-drf-600 hover:bg-drf-700">
              <Link to="/introduction">Start Learning</Link>
            </Button>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Learning Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TopicCard
              title="Introduction to DRF"
              description="Learn what Django REST Framework is and why it's a powerful tool for building APIs."
              icon={<BookOpen className="h-6 w-6 text-drf-600" />}
              link="/introduction"
              difficulty="beginner"
            />
            
            <TopicCard
              title="Installation & Setup"
              description="Get your environment ready and set up your first DRF project."
              icon={<Server className="h-6 w-6 text-drf-600" />}
              link="/installation"
              difficulty="beginner"
            />
            
            <TopicCard
              title="Serializers"
              description="Learn how to transform complex data types into Python native datatypes and vice versa."
              icon={<FileText className="h-6 w-6 text-drf-600" />}
              link="/serializers"
              difficulty="beginner"
            />
            
            <TopicCard
              title="Views & ViewSets"
              description="Build API endpoints and understand the different view types in DRF."
              icon={<Code className="h-6 w-6 text-drf-600" />}
              link="/views"
              difficulty="intermediate"
            />
            
            <TopicCard
              title="Authentication & Permissions"
              description="Secure your API with authentication and define what users can do."
              icon={<Lock className="h-6 w-6 text-drf-600" />}
              link="/authentication"
              difficulty="intermediate"
            />
            
            <TopicCard
              title="Advanced Topics"
              description="Master advanced DRF concepts like viewsets, filtering, and testing."
              icon={<Zap className="h-6 w-6 text-drf-600" />}
              link="/viewsets"
              difficulty="advanced"
            />
          </div>
        </section>

        <section className="mb-12">
          <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Ready for the Challenge?</h2>
            <p className="mb-6">
              Test your knowledge with our practice exercises and prepare for technical interviews with our curated list of common DRF interview questions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <Code className="h-6 w-6 text-drf-600 mr-2" />
                  <h3 className="text-lg font-medium">Practice Exercises</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Hands-on exercises to apply what you've learned and build real APIs.
                </p>
                <Button asChild variant="outline">
                  <Link to="/practice">Start Practicing</Link>
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <Award className="h-6 w-6 text-drf-600 mr-2" />
                  <h3 className="text-lg font-medium">Interview Questions</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Common DRF interview questions with detailed explanations.
                </p>
                <Button asChild variant="outline">
                  <Link to="/interview">Prepare for Interviews</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DocLayout>
  );
};

export default Index;
