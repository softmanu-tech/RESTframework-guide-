
import React from 'react';
import DocLayout from '@/components/DocLayout';
import QuizQuestion from '@/components/QuizQuestion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeBlock from '@/components/CodeBlock';

const Interview = () => {
  const beginnerQuestions = [
    {
      question: "What is Django REST Framework?",
      options: [
        {
          id: "a",
          text: "A database management system for Django"
        },
        {
          id: "b",
          text: "A toolkit for building Web APIs with Django"
        },
        {
          id: "c",
          text: "A JavaScript framework for frontend development"
        },
        {
          id: "d",
          text: "A testing framework for Django applications"
        }
      ],
      correctAnswer: "b",
      explanation: "Django REST Framework is a powerful and flexible toolkit for building Web APIs with Django. It provides a set of tools to help you build RESTful APIs, including serializers, views, authentication mechanisms, etc."
    },
    {
      question: "What is a serializer in Django REST Framework?",
      options: [
        {
          id: "a",
          text: "A tool to convert complex data types to Python datatypes that can be rendered into JSON, XML, etc."
        },
        {
          id: "b",
          text: "A component that handles user authentication"
        },
        {
          id: "c",
          text: "A tool to compress data before sending it over the network"
        },
        {
          id: "d",
          text: "A component that routes API requests to the appropriate view"
        }
      ],
      correctAnswer: "a",
      explanation: "Serializers in DRF allow complex data such as querysets and model instances to be converted to native Python datatypes that can then be easily rendered into JSON, XML, or other content types. Serializers also provide deserialization, allowing parsed data to be converted back into complex types."
    }
  ];

  const intermediateQuestions = [
    {
      question: "Which component in DRF is responsible for handling different HTTP methods like GET, POST, PUT, DELETE?",
      options: [
        {
          id: "a",
          text: "Serializers"
        },
        {
          id: "b",
          text: "Routers"
        },
        {
          id: "c",
          text: "Views"
        },
        {
          id: "d",
          text: "Permissions"
        }
      ],
      correctAnswer: "c",
      explanation: "Views in DRF are responsible for handling HTTP methods. A view can be a function-based view or a class-based view. Class-based views provide methods like get(), post(), put(), delete() that handle the respective HTTP methods."
    },
    {
      question: "What is the difference between APIView and ViewSet in DRF?",
      options: [
        {
          id: "a",
          text: "APIView is for read-only operations, ViewSet is for CRUD operations"
        },
        {
          id: "b",
          text: "APIView is tied to HTTP methods, ViewSet is tied to actions (like list, create, retrieve) and provides more abstraction"
        },
        {
          id: "c",
          text: "APIView works with serializers, ViewSet doesn't"
        },
        {
          id: "d",
          text: "APIView is deprecated, ViewSet is the recommended approach"
        }
      ],
      correctAnswer: "b",
      explanation: "APIView is a class-based view that is tied to HTTP methods (get, post, put, etc.). ViewSet is a higher-level abstraction that works with actions (list, create, retrieve, etc.) rather than methods. ViewSets provide more abstraction and combine common behavior with routers to automatically generate URL patterns."
    }
  ];

  const advancedQuestions = [
    {
      question: "How can you implement a custom authentication scheme in DRF?",
      options: [
        {
          id: "a",
          text: "By adding a middleware to Django's middleware stack"
        },
        {
          id: "b",
          text: "By creating a class that inherits from rest_framework.authentication.BaseAuthentication"
        },
        {
          id: "c",
          text: "By overriding the authenticate method in the APIView class"
        },
        {
          id: "d",
          text: "By adding a custom validator to serializers"
        }
      ],
      correctAnswer: "b",
      explanation: "To create a custom authentication scheme in DRF, you need to create a class that inherits from BaseAuthentication and override the authenticate method. Then you can add this class to the DEFAULT_AUTHENTICATION_CLASSES setting or directly to a view's authentication_classes attribute."
    },
    {
      question: "What is the purpose of @action decorator in ViewSets?",
      options: [
        {
          id: "a",
          text: "To specify a custom action that should be provided by the viewset"
        },
        {
          id: "b",
          text: "To add middleware to a specific viewset action"
        },
        {
          id: "c",
          text: "To specify that a method is asynchronous"
        },
        {
          id: "d",
          text: "To mark a method as deprecated"
        }
      ],
      correctAnswer: "a",
      explanation: "The @action decorator in ViewSets is used to specify a custom action that should be provided by the viewset. This allows you to add custom endpoints that don't fit into the standard CRUD operations. For example, you might add a 'highlight' action to a snippets viewset."
    }
  ];

  return (
    <DocLayout>
      <div className="max-w-4xl mx-auto">
        <h1>DRF Interview Questions & Answers</h1>
        
        <p className="text-lg mb-6">
          Prepare for your next interview with these common Django REST Framework questions. Practice answering these questions to build your confidence and demonstrate your expertise.
        </p>
        
        <Tabs defaultValue="beginner" className="mb-10">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="beginner">
            <h2>Beginner Interview Questions</h2>
            <p className="mb-6">These questions cover the fundamentals of Django REST Framework.</p>
            
            {beginnerQuestions.map((q, index) => (
              <QuizQuestion 
                key={index}
                question={q.question}
                options={q.options}
                correctAnswer={q.correctAnswer}
                explanation={q.explanation}
              />
            ))}
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Additional Important Concepts</h3>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is REST and RESTful API?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-3">
                      REST (Representational State Transfer) is an architectural style for distributed systems. A RESTful API is an API that follows the principles of REST:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mb-3">
                      <li>It uses HTTP methods (GET, POST, PUT, DELETE) to operate on resources</li>
                      <li>Resources are identified by URIs (Uniform Resource Identifiers)</li>
                      <li>It uses a stateless communication model</li>
                      <li>It uses hypermedia (HATEOAS - Hypertext As The Engine Of Application State)</li>
                    </ul>
                    <p>
                      Django REST Framework helps you build APIs that follow these RESTful principles.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Explain the different types of serializers in DRF</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-3">
                      Django REST Framework provides several types of serializers:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Serializer</strong>: The base serializer class that provides serialization and deserialization of data.
                      </li>
                      <li>
                        <strong>ModelSerializer</strong>: A shortcut for creating serializers that deal with model instances and querysets. It automatically generates fields and validators based on the model.
                      </li>
                      <li>
                        <strong>HyperlinkedModelSerializer</strong>: Similar to ModelSerializer, but represents relationships using hyperlinks instead of primary keys.
                      </li>
                      <li>
                        <strong>ListSerializer</strong>: Used for serializing multiple objects at once. Usually used internally.
                      </li>
                      <li>
                        <strong>BaseSerializer</strong>: A minimal base class for creating custom serializer classes.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>What is the difference between GET and POST methods?</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>GET</strong>: Used to request data from a specified resource. GET requests can be cached, bookmarked, and remain in browser history. They should never be used to send sensitive data. GET requests have length restrictions and should only be used to retrieve data.
                      </li>
                      <li>
                        <strong>POST</strong>: Used to submit data to be processed to a specified resource. POST requests are never cached, don't remain in browser history, and cannot be bookmarked. POST requests have no restrictions on data length.
                      </li>
                    </ul>
                    <p className="mt-3">
                      In DRF, these methods are handled by different methods in class-based views or different conditions in function-based views.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
          
          <TabsContent value="intermediate">
            <h2>Intermediate Interview Questions</h2>
            <p className="mb-6">These questions cover more advanced topics in Django REST Framework.</p>
            
            {intermediateQuestions.map((q, index) => (
              <QuizQuestion 
                key={index}
                question={q.question}
                options={q.options}
                correctAnswer={q.correctAnswer}
                explanation={q.explanation}
              />
            ))}
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Common Intermediate Topics</h3>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Explain the authentication mechanisms in DRF</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-3">
                      Django REST Framework provides several authentication schemes:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>BasicAuthentication</strong>: Uses HTTP Basic Authentication, sending credentials with each request.
                      </li>
                      <li>
                        <strong>TokenAuthentication</strong>: Uses a simple token-based scheme, suitable for client-server setups.
                      </li>
                      <li>
                        <strong>SessionAuthentication</strong>: Uses Django's session framework for authentication.
                      </li>
                      <li>
                        <strong>RemoteUserAuthentication</strong>: Uses REMOTE_USER environment variable set by the web server.
                      </li>
                      <li>
                        <strong>JSONWebTokenAuthentication</strong>: Not included in DRF but available via third-party packages, uses JWT tokens.
                      </li>
                    </ul>
                    <p className="mt-3">
                      Authentication can be set globally in settings.py or per-view using the authentication_classes attribute.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do you implement pagination in DRF?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-3">
                      DRF provides several pagination styles:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mb-3">
                      <li>
                        <strong>PageNumberPagination</strong>: Uses page numbers in the URL (e.g., ?page=4).
                      </li>
                      <li>
                        <strong>LimitOffsetPagination</strong>: Uses limit and offset parameters (e.g., ?limit=10&offset=20).
                      </li>
                      <li>
                        <strong>CursorPagination</strong>: Uses an opaque cursor to point to the next/previous results.
                      </li>
                    </ul>
                    
                    <p className="mb-3">
                      Pagination can be configured globally in settings.py:
                    </p>
                    
                    <CodeBlock code={`# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}`} />
                    
                    <p className="mt-3">
                      Or you can create a custom pagination class and set it at the view level:
                    </p>
                    
                    <CodeBlock code={`# views.py
from rest_framework.pagination import PageNumberPagination

class LargeResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    pagination_class = LargeResultsSetPagination`} />
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>What are permissions in DRF and how do you use them?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-3">
                      Permissions in DRF determine whether a request should be granted or denied access. DRF provides several built-in permission classes:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mb-3">
                      <li>
                        <strong>AllowAny</strong>: Allow any access.
                      </li>
                      <li>
                        <strong>IsAuthenticated</strong>: Allow only authenticated users.
                      </li>
                      <li>
                        <strong>IsAdminUser</strong>: Allow only admin users.
                      </li>
                      <li>
                        <strong>IsAuthenticatedOrReadOnly</strong>: Allow authenticated users to perform any request. Read-only for anonymous users.
                      </li>
                      <li>
                        <strong>DjangoModelPermissions</strong>: Ties into Django's model permissions.
                      </li>
                      <li>
                        <strong>DjangoObjectPermissions</strong>: Ties into Django's object permissions.
                      </li>
                    </ul>
                    
                    <p className="mb-3">
                      You can set permissions globally in settings.py:
                    </p>
                    
                    <CodeBlock code={`# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}`} />
                    
                    <p className="mt-3">
                      Or at the view level:
                    </p>
                    
                    <CodeBlock code={`# views.py
from rest_framework.permissions import IsAuthenticated

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]`} />
                    
                    <p className="mt-3">
                      You can also create custom permission classes by inheriting from BasePermission:
                    </p>
                    
                    <CodeBlock code={`# permissions.py
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Write permissions are only allowed to the owner
        return obj.owner == request.user`} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            <h2>Advanced Interview Questions</h2>
            <p className="mb-6">These questions cover complex and specialized topics in Django REST Framework.</p>
            
            {advancedQuestions.map((q, index) => (
              <QuizQuestion 
                key={index}
                question={q.question}
                options={q.options}
                correctAnswer={q.correctAnswer}
                explanation={q.explanation}
              />
            ))}
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Advanced Topics Deep Dive</h3>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Explain how to create custom renderers and parsers in DRF</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-3">
                      Renderers and parsers in DRF handle how data is serialized (rendered) and deserialized (parsed). Custom renderers and parsers can be created by inheriting from BaseRenderer and BaseParser:
                    </p>
                    
                    <CodeBlock code={`# Custom Renderer
from rest_framework import renderers

class CSVRenderer(renderers.BaseRenderer):
    media_type = 'text/csv'
    format = 'csv'
    
    def render(self, data, media_type=None, renderer_context=None):
        # Convert data to CSV format
        import csv
        import io
        
        csv_buffer = io.StringIO()
        csv_writer = csv.writer(csv_buffer)
        
        # Write header
        csv_writer.writerow(data[0].keys())
        
        # Write data
        for item in data:
            csv_writer.writerow(item.values())
            
        return csv_buffer.getvalue()

# Custom Parser
from rest_framework import parsers

class CSVParser(parsers.BaseParser):
    media_type = 'text/csv'
    
    def parse(self, stream, media_type=None, parser_context=None):
        # Parse CSV data
        import csv
        import io
        
        data = []
        csv_reader = csv.DictReader(io.TextIOWrapper(stream))
        for row in csv_reader:
            data.append(row)
            
        return data`} />
                    
                    <p className="mt-3">
                      These can be used in a view by setting the renderer_classes or parser_classes attributes:
                    </p>
                    
                    <CodeBlock code={`# views.py
from rest_framework.views import APIView
from .renderers import CSVRenderer
from .parsers import CSVParser

class BookListView(APIView):
    renderer_classes = [CSVRenderer]
    parser_classes = [CSVParser]
    
    def get(self, request):
        # ...
        
    def post(self, request):
        # ...`} />
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>How would you optimize a DRF API for performance?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-3">
                      Optimizing a DRF API involves several strategies:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Database Optimization</strong>:
                        <ul className="list-disc pl-5 mt-1">
                          <li>Use select_related() and prefetch_related() to reduce the number of database queries</li>
                          <li>Add appropriate indexes to your database</li>
                          <li>Use defer() and only() to only retrieve the fields you need</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Caching</strong>:
                        <ul className="list-disc pl-5 mt-1">
                          <li>Implement Django's caching framework</li>
                          <li>Use ETag and Last-Modified headers</li>
                          <li>Consider using a caching service like Redis or Memcached</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Pagination</strong>:
                        <ul className="list-disc pl-5 mt-1">
                          <li>Always paginate your results for large datasets</li>
                          <li>Use cursor pagination for large datasets with frequent updates</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Serialization Optimization</strong>:
                        <ul className="list-disc pl-5 mt-1">
                          <li>Use a faster JSON library like ujson or orjson</li>
                          <li>Create specialized serializers for different endpoints to avoid over-serialization</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Asynchronous Processing</strong>:
                        <ul className="list-disc pl-5 mt-1">
                          <li>Use Celery for long-running tasks</li>
                          <li>Consider using Django Channels for real-time functionality</li>
                        </ul>
                      </li>
                    </ul>
                    
                    <p className="mt-3">
                      Example of optimizing a queryset:
                    </p>
                    
                    <CodeBlock code={`# Unoptimized
books = Book.objects.all()

# Optimized
books = Book.objects.select_related('author', 'publisher').prefetch_related('categories')`} />
                    
                    <p className="mt-3">
                      Example of adding caching to a view:
                    </p>
                    
                    <CodeBlock code={`from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

class BookViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    
    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def list(self, request):
        return super().list(request)`} />
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Implementing Rate Limiting and Throttling in DRF</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-3">
                      Rate limiting (throttling) in DRF controls how often users can make requests. DRF provides several throttling classes:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mb-3">
                      <li>
                        <strong>AnonRateThrottle</strong>: Limits anonymous users based on IP address.
                      </li>
                      <li>
                        <strong>UserRateThrottle</strong>: Limits authenticated users.
                      </li>
                      <li>
                        <strong>ScopedRateThrottle</strong>: Allows for different rate limits for different parts of the API.
                      </li>
                    </ul>
                    
                    <p className="mb-3">
                      Configuration in settings.py:
                    </p>
                    
                    <CodeBlock code={`# settings.py
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',
        'user': '1000/day'
    }
}`} />
                    
                    <p className="mt-3">
                      Creating a custom throttle class:
                    </p>
                    
                    <CodeBlock code={`# throttles.py
from rest_framework import throttling

class BurstRateThrottle(throttling.UserRateThrottle):
    scope = 'burst'
    
class SustainedRateThrottle(throttling.UserRateThrottle):
    scope = 'sustained'

# settings.py
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'myapp.throttles.BurstRateThrottle',
        'myapp.throttles.SustainedRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'burst': '60/min',
        'sustained': '1000/day'
    }
}

# views.py
class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    throttle_classes = [BurstRateThrottle, SustainedRateThrottle]`} />
                    
                    <p className="mt-3">
                      Scoped throttling for different actions:
                    </p>
                    
                    <CodeBlock code={`# settings.py
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.ScopedRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'read': '1000/day',
        'write': '100/day'
    }
}

# views.py
class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    throttle_scope = 'read'  # Default scope
    
    def create(self, request):
        self.throttle_scope = 'write'  # Change scope for create action
        return super().create(request)
        
    def update(self, request, *args, **kwargs):
        self.throttle_scope = 'write'  # Change scope for update action
        return super().update(request, *args, **kwargs)`} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DocLayout>
  );
};

export default Interview;
