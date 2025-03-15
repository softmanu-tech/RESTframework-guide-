
import React from 'react';
import DocLayout from '@/components/DocLayout';
import ProgressTracker from '@/components/ProgressTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import CodeEditor from '@/components/CodeEditor';
import { useProgress } from '@/context/ProgressContext';

const Advanced = () => {
  const { markCompleted, setCurrentSection } = useProgress();
  
  React.useEffect(() => {
    setCurrentSection("Advanced Concepts");
  }, [setCurrentSection]);

  return (
    <DocLayout>
      <div className="max-w-4xl">
        <ProgressTracker className="mb-8" />
        
        <h1>Advanced Django REST Framework Concepts</h1>
        
        <Alert className="mb-8 bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            This section covers advanced DRF topics including custom permissions, throttling, schema generation, versioning, and performance optimization.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="permissions" className="mb-10">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="throttling">Throttling</TabsTrigger>
            <TabsTrigger value="versioning">Versioning</TabsTrigger>
            <TabsTrigger value="schema">Schema</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="permissions" className="p-4 bg-white rounded-lg shadow-sm">
            <h2>Custom Permissions</h2>
            
            <p>
              Django REST Framework allows you to define custom permissions that can be reused across your API. 
              Custom permissions give you fine-grained control over who can access your API endpoints.
            </p>
            
            <h3>Creating a Custom Permission</h3>
            
            <p>
              To create a custom permission, you need to subclass <code>permissions.BasePermission</code> and override either
              <code>.has_permission(request, view)</code> or <code>.has_object_permission(request, view, obj)</code>, or both.
            </p>
            
            <CodeBlock
              filename="permissions.py"
              language="python"
              code={`from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Write permissions are only allowed to the owner of the object.
        return obj.owner == request.user
        
class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to modify objects.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
            
        return request.user and request.user.is_staff`}
            />
            
            <h3>Using Custom Permissions</h3>
            
            <p>
              You can use custom permissions in your views or viewsets by adding them to the <code>permission_classes</code> attribute.
            </p>
            
            <CodeBlock
              filename="views.py"
              language="python"
              code={`from rest_framework import viewsets
from .models import Book
from .serializers import BookSerializer
from .permissions import IsOwnerOrReadOnly

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsOwnerOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)`}
            />
            
            <h3>Practice: Create a Custom Permission</h3>
            
            <p>
              Create a custom permission that only allows users to edit their own profile, while allowing anyone to view profiles.
            </p>
            
            <CodeEditor
              initialCode={`from rest_framework import permissions

class IsOwnProfileOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow users to edit their own profile.
    """
    # Your code here
`}
              expectedOutput={`from rest_framework import permissions

class IsOwnProfileOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow users to edit their own profile.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
            
        return obj == request.user
`}
              challenge="Create a custom permission class called IsOwnProfileOrReadOnly that only allows users to edit their own profile."
              onSuccess={() => markCompleted('advanced-permissions')}
            />
          </TabsContent>
          
          <TabsContent value="throttling" className="p-4 bg-white rounded-lg shadow-sm">
            <h2>API Throttling</h2>
            
            <p>
              Throttling is similar to permissions, in that it determines if a request should be authorized.
              Throttles indicate a temporary state, and are used to control the rate of requests that clients can make to an API.
            </p>
            
            <h3>Setting Up Throttling</h3>
            
            <p>
              DRF includes several throttle classes: <code>AnonRateThrottle</code>, <code>UserRateThrottle</code>, and <code>ScopedRateThrottle</code>.
              To use throttling, add the <code>DEFAULT_THROTTLE_CLASSES</code> and <code>DEFAULT_THROTTLE_RATES</code> settings to your settings.py file.
            </p>
            
            <CodeBlock
              filename="settings.py"
              language="python"
              code={`# Global throttling settings
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',
        'user': '1000/day'
    }
}`}
            />
            
            <h3>Custom Throttling</h3>
            
            <p>
              You can create custom throttle classes by subclassing <code>BaseThrottle</code> and implementing <code>allow_request</code> 
              and <code>get_ident</code> methods.
            </p>
            
            <CodeBlock
              filename="throttling.py"
              language="python"
              code={`from rest_framework.throttling import UserRateThrottle

class BurstRateThrottle(UserRateThrottle):
    scope = 'burst'

class SustainedRateThrottle(UserRateThrottle):
    scope = 'sustained'`}
            />
            
            <CodeBlock
              filename="settings.py"
              language="python"
              code={`REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'myapp.throttling.BurstRateThrottle',
        'myapp.throttling.SustainedRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',
        'burst': '60/min',
        'sustained': '1000/day'
    }
}`}
            />
            
            <h3>Throttling Specific Views</h3>
            
            <p>
              You can also apply throttling to specific views or viewsets by setting the <code>throttle_classes</code> attribute.
            </p>
            
            <CodeBlock
              filename="views.py"
              language="python"
              code={`from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle

class SensitiveOperation(APIView):
    throttle_classes = [UserRateThrottle]
    throttle_scope = 'sensitive'
    
    def post(self, request):
        # Perform sensitive operation
        return Response({'status': 'success'})`}
            />
          </TabsContent>
          
          <TabsContent value="versioning" className="p-4 bg-white rounded-lg shadow-sm">
            <h2>API Versioning</h2>
            
            <p>
              API versioning allows you to alter behavior between different clients. This is useful when you need to make
              breaking changes to your API but still want to support existing clients.
            </p>
            
            <h3>Versioning Schemes</h3>
            
            <p>
              DRF supports several versioning schemes out of the box: URL path versioning, query parameter versioning,
              header versioning, and more.
            </p>
            
            <CodeBlock
              filename="settings.py"
              language="python"
              code={`REST_FRAMEWORK = {
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.URLPathVersioning',
    'DEFAULT_VERSION': 'v1',
    'ALLOWED_VERSIONS': ['v1', 'v2'],
    'VERSION_PARAM': 'version'
}`}
            />
            
            <h3>URL Path Versioning</h3>
            
            <p>
              URL path versioning includes the version as part of the URL path.
            </p>
            
            <CodeBlock
              filename="urls.py"
              language="python"
              code={`from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'books', views.BookViewSet)

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('api/v2/', include('myapi.urls_v2')),
]`}
            />
            
            <h3>Handling Versions in Views</h3>
            
            <p>
              Once versioning is enabled, the <code>request.version</code> attribute will contain the version requested by the client.
              You can use this to customize your view behavior.
            </p>
            
            <CodeBlock
              filename="views.py"
              language="python"
              code={`from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import BookSerializerV1, BookSerializerV2

class BookDetail(APIView):
    def get(self, request, pk):
        book = get_object_or_404(Book, pk=pk)
        
        if request.version == 'v1':
            serializer = BookSerializerV1(book)
        else:
            serializer = BookSerializerV2(book)
            
        return Response(serializer.data)`}
            />
            
            <h3>Using Different Serializers for Different Versions</h3>
            
            <p>
              A common approach is to use different serializers for different API versions.
            </p>
            
            <CodeBlock
              filename="serializers.py"
              language="python"
              code={`from rest_framework import serializers
from .models import Book

class BookSerializerV1(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'price']

class BookSerializerV2(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.full_name')
    
    class Meta:
        model = Book
        fields = ['id', 'title', 'author_name', 'price', 'published_date', 'isbn']`}
            />
          </TabsContent>
          
          <TabsContent value="schema" className="p-4 bg-white rounded-lg shadow-sm">
            <h2>Schema Generation</h2>
            
            <p>
              DRF includes automatic schema generation which allows you to create interactive API documentation.
              The schema describes the endpoints, methods, parameters, and responses of your API.
            </p>
            
            <h3>Setting Up Schema Generation</h3>
            
            <p>
              DRF supports the OpenAPI schema specification (formerly known as Swagger). First, install the required package:
            </p>
            
            <CodeBlock
              language="bash"
              code={`pip install drf-spectacular`}
            />
            
            <p>
              Then, add the package to your settings:
            </p>
            
            <CodeBlock
              filename="settings.py"
              language="python"
              code={`INSTALLED_APPS = [
    # ...
    'drf_spectacular',
]

REST_FRAMEWORK = {
    # ...
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}`}
            />
            
            <h3>Configuring Schema Generation</h3>
            
            <p>
              You can configure the schema generation in your settings file:
            </p>
            
            <CodeBlock
              filename="settings.py"
              language="python"
              code={`SPECTACULAR_SETTINGS = {
    'TITLE': 'Your API',
    'DESCRIPTION': 'Your API description',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    # OTHER SETTINGS
}`}
            />
            
            <h3>Adding Schema URLs</h3>
            
            <p>
              Add URLs for the schema view and the Swagger UI:
            </p>
            
            <CodeBlock
              filename="urls.py"
              language="python"
              code={`from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    # YOUR API URLS
    # ...
    
    # Schema URLs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]`}
            />
            
            <h3>Customizing Schema Generation</h3>
            
            <p>
              You can customize the schema by adding docstrings and using the <code>@extend_schema</code> decorator:
            </p>
            
            <CodeBlock
              filename="views.py"
              language="python"
              code={`from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

class BookViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows books to be viewed or edited.
    """
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    
    @extend_schema(
        summary="List all books",
        description="Get a list of all books in the library.",
        parameters=[
            OpenApiParameter(
                name='published_after',
                type=OpenApiTypes.DATE,
                location=OpenApiParameter.QUERY,
                description='Filter by publication date'
            )
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)`}
            />
          </TabsContent>
          
          <TabsContent value="optimization" className="p-4 bg-white rounded-lg shadow-sm">
            <h2>Performance Optimization</h2>
            
            <p>
              As your API grows, it's important to optimize performance to handle increased traffic efficiently.
              Here are some techniques for optimizing your DRF API.
            </p>
            
            <h3>Database Optimization with select_related and prefetch_related</h3>
            
            <p>
              Use <code>select_related</code> and <code>prefetch_related</code> to reduce the number of database queries:
            </p>
            
            <CodeBlock
              filename="views.py"
              language="python"
              code={`class BookViewSet(viewsets.ModelViewSet):
    # Instead of this:
    # queryset = Book.objects.all()
    
    # Use this to reduce queries for foreign keys:
    queryset = Book.objects.select_related('author', 'publisher')
    
    # For many-to-many or reverse foreign key relationships:
    queryset = Book.objects.prefetch_related('genres', 'reviews')
    
    serializer_class = BookSerializer`}
            />
            
            <h3>Pagination</h3>
            
            <p>
              Always use pagination for large datasets to avoid sending too much data at once:
            </p>
            
            <CodeBlock
              filename="settings.py"
              language="python"
              code={`REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}`}
            />
            
            <p>
              For specific views, you can customize pagination:
            </p>
            
            <CodeBlock
              filename="views.py"
              language="python"
              code={`from rest_framework.pagination import LimitOffsetPagination

class BookPagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 100

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    pagination_class = BookPagination`}
            />
            
            <h3>Caching</h3>
            
            <p>
              Implement caching to store and reuse the results of expensive operations:
            </p>
            
            <CodeBlock
              filename="settings.py"
              language="python"
              code={`CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'TIMEOUT': 86400,  # 1 day in seconds
    }
}`}
            />
            
            <p>
              Use the <code>@cache_page</code> decorator or DRF's caching mixins:
            </p>
            
            <CodeBlock
              filename="views.py"
              language="python"
              code={`from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.viewsets import ReadOnlyModelViewSet

class BookViewSet(ReadOnlyModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    
    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
        
    @method_decorator(cache_page(60 * 60))  # Cache for 1 hour
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)`}
            />
            
            <h3>Serializer Optimization</h3>
            
            <p>
              Optimize your serializers by only including the fields you need:
            </p>
            
            <CodeBlock
              filename="serializers.py"
              language="python"
              code={`class BookListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'author_name']  # Minimal fields for list view
        
class BookDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'  # All fields for detail view
        
class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BookListSerializer
        return BookDetailSerializer`}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DocLayout>
  );
};

export default Advanced;
