import React, { useEffect } from 'react';
import DocLayout from '@/components/DocLayout';
import ProgressTracker from '@/components/ProgressTracker';
import CodeBlock from '@/components/CodeBlock';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProgress } from '@/context/ProgressContext';

const Introduction = () => {
  const { markCompleted } = useProgress();
  
  useEffect(() => {
    // Mark this section as viewed/completed
    markCompleted("introduction");
  }, [markCompleted]);

  return (
    <DocLayout>
      <ProgressTracker currentSection="Introduction to DRF" />

      <h1>Introduction to Django REST Framework</h1>
      
      <p>
        Django REST Framework (DRF) is a powerful toolkit for building Web APIs with Django. It has become the go-to solution for creating robust, scalable APIs in the Django ecosystem. In this comprehensive guide, we'll take you from the basics to advanced concepts of DRF.
      </p>

      <h2>What is Django REST Framework?</h2>
      
      <p>
        Django REST Framework is a third-party application for Django that provides a powerful and flexible toolkit for building web APIs. It is built on top of Django, the high-level Python web framework that encourages rapid development and clean, pragmatic design.
      </p>
      
      <p>
        DRF adds a layer of functionality on top of Django to make it easier to build RESTful APIs. It provides a set of tools that make it easy to handle common tasks like serializing data, handling authentication, and defining API endpoints.
      </p>

      <div className="bg-drf-50 border-l-4 border-drf-400 p-4 my-6">
        <h3 className="text-drf-800 font-medium mb-2">Key Features of Django REST Framework</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Browsable API - a powerful tool for debugging and development</li>
          <li>Authentication - OAuth1a, OAuth2, Basic, Session, Token</li>
          <li>Serialization - convert complex data like querysets and model instances to Python datatypes</li>
          <li>Extensive documentation and strong community support</li>
          <li>Customizable views, serializers, and authentication</li>
          <li>Automatic generation of API documentation</li>
        </ul>
      </div>

      <h2>Why Use Django REST Framework?</h2>
      
      <p>
        There are several reasons why DRF is the preferred choice for building APIs with Django:
      </p>
      
      <ul className="list-disc pl-5 space-y-2 mb-6">
        <li>
          <strong>Simplicity and Productivity</strong>: DRF abstracts away many of the complexities of building APIs, allowing you to focus on your application logic.
        </li>
        <li>
          <strong>Flexibility</strong>: DRF can be easily customized to fit the specific needs of your project.
        </li>
        <li>
          <strong>Powerful Features</strong>: From authentication to serialization, DRF provides all the tools you need to build a full-featured API.
        </li>
        <li>
          <strong>Documentation</strong>: The DRF documentation is comprehensive and well-maintained, making it easy to learn and use.
        </li>
        <li>
          <strong>Community</strong>: DRF has a large and active community, which means there are many resources available for learning and troubleshooting.
        </li>
      </ul>

      <h2>RESTful API Basics</h2>
      
      <p>
        Before diving into DRF, let's review some key concepts of RESTful APIs:
      </p>
      
      <ul className="list-disc pl-5 space-y-2 mb-6">
        <li>
          <strong>REST (Representational State Transfer)</strong> is an architectural style for designing networked applications.
        </li>
        <li>
          <strong>Resources</strong> are the key abstraction in REST, represented as URLs.
        </li>
        <li>
          <strong>HTTP Methods</strong> (GET, POST, PUT, DELETE) are used to perform operations on resources.
        </li>
        <li>
          <strong>Status Codes</strong> (200, 201, 400, 404, etc.) communicate the result of HTTP requests.
        </li>
        <li>
          <strong>Media Types</strong> (JSON, XML, etc.) define the format of data exchanged between client and server.
        </li>
      </ul>

      <h2>Your First DRF API Response</h2>
      
      <p>
        Let's see a simple example of what a DRF API response looks like:
      </p>

      <CodeBlock 
        code={`# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def hello_world(request):
    return Response({
        "message": "Hello, world!"
    })`}
        language="python"
        filename="views.py"
      />

      <p>
        And here's how to include it in your URL patterns:
      </p>

      <CodeBlock 
        code={`# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('hello/', views.hello_world, name='hello_world'),
]`}
        language="python"
        filename="urls.py"
      />

      <p>
        When you make a GET request to <code>/hello/</code>, you'll receive a JSON response:
      </p>

      <CodeBlock 
        code={`{
    "message": "Hello, world!"
}`}
        language="json"
      />

      <h2>What You'll Learn in This Guide</h2>
      
      <p>
        By the end of this guide, you'll be able to:
      </p>
      
      <ul className="list-disc pl-5 space-y-2 mb-6">
        <li>Set up and configure Django REST Framework</li>
        <li>Create serializers to convert complex data types to Python native datatypes</li>
        <li>Build API views and viewsets</li>
        <li>Implement authentication and permissions</li>
        <li>Handle routing and URL configuration</li>
        <li>Test your API</li>
        <li>Deploy your API to production</li>
      </ul>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
        <h3 className="text-lg font-medium mb-3">Ready to Start?</h3>
        <p className="mb-4">
          Now that you understand what DRF is and why it's useful, let's move on to setting up your environment and creating your first DRF project.
        </p>
        <Button asChild className="bg-drf-600 hover:bg-drf-700">
          <Link to="/installation" className="flex items-center">
            Next: Installation & Setup
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </DocLayout>
  );
};

export default Introduction;
