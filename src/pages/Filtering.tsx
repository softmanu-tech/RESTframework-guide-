
import React from 'react';
import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';
import PracticeExercise from '@/components/PracticeExercise';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Database, Filter, Search, ListFilter } from 'lucide-react';

const Filtering = () => {
  return (
    <DocLayout title="Filtering & Pagination" description="Learn how to implement filtering, searching, and pagination in DRF">
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-4">Filtering, Searching & Pagination</h2>
          <p className="text-lg leading-relaxed mb-4">
            When building APIs that return large datasets, it's essential to provide mechanisms for clients
            to filter results, search for specific items, and paginate through the data. Django REST Framework
            offers robust tools for implementing these features.
          </p>

          <Alert>
            <Database className="h-5 w-5" />
            <AlertTitle>Why Use These Features?</AlertTitle>
            <AlertDescription>
              Filtering and pagination improve API performance by reducing the amount of data transferred,
              lower server load, and enhance the user experience by providing more relevant data.
            </AlertDescription>
          </Alert>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Filtering</h3>
          <p className="leading-relaxed">
            Filtering allows clients to request a subset of resources based on certain criteria.
            DRF provides several ways to filter querysets:
          </p>

          <Tabs defaultValue="filter-backends">
            <TabsList>
              <TabsTrigger value="filter-backends">Filter Backends</TabsTrigger>
              <TabsTrigger value="django-filter">Django Filter</TabsTrigger>
              <TabsTrigger value="manual-filtering">Manual Filtering</TabsTrigger>
            </TabsList>
            
            <TabsContent value="filter-backends">
              <CodeBlock
                code={`from rest_framework import viewsets, filters
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['title', 'created_at', 'author__username']
    ordering = ['-created_at']  # Default ordering`}
                language="python"
                filename="views.py"
              />
              <p className="mt-2 text-sm text-gray-600">
                The <code>OrderingFilter</code> backend allows clients to sort results using the <code>?ordering=</code> query parameter.
                For example: <code>/api/articles/?ordering=-created_at</code> to sort by creation date descending.
              </p>
            </TabsContent>
            
            <TabsContent value="django-filter">
              <CodeBlock
                code={`# Install django-filter
pip install django-filter

# settings.py
INSTALLED_APPS = [
    # ...
    'django_filters',
]

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
}

# views.py
from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'author', 'is_published']`}
                language="python"
              />
              <p className="mt-2 text-sm text-gray-600">
                The <code>DjangoFilterBackend</code> allows filtering on specific fields.
                For example: <code>/api/articles/?category=technology&is_published=true</code>
              </p>
            </TabsContent>
            
            <TabsContent value="manual-filtering">
              <CodeBlock
                code={`from rest_framework import viewsets
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    serializer_class = ArticleSerializer
    
    def get_queryset(self):
        queryset = Article.objects.all()
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__name=category)
            
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date and end_date:
            queryset = queryset.filter(created_at__range=[start_date, end_date])
            
        # Filter by author
        author_id = self.request.query_params.get('author_id')
        if author_id:
            queryset = queryset.filter(author_id=author_id)
            
        return queryset`}
                language="python"
                filename="views.py"
              />
              <p className="mt-2 text-sm text-gray-600">
                For more complex filtering requirements, you can override the <code>get_queryset()</code> method
                to apply filters based on request parameters.
              </p>
            </TabsContent>
          </Tabs>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Searching</h3>
          <p className="leading-relaxed">
            The <code>SearchFilter</code> class allows for simple text-based search across multiple fields:
          </p>

          <CodeBlock
            code={`from rest_framework import viewsets, filters
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'content', 'author__username', 'tags__name']`}
            language="python"
            filename="views.py"
          />

          <p className="leading-relaxed">
            With this configuration, clients can search using the <code>?search=</code> parameter:
          </p>
          <div className="bg-gray-100 p-3 rounded font-mono text-sm">
            GET /api/articles/?search=django
          </div>
          
          <p className="leading-relaxed mt-3">
            You can customize search behavior using prefixes on search fields:
          </p>
          <ul className="list-disc pl-6">
            <li className="mb-2">
              <code>^</code>: Starts-with search
            </li>
            <li className="mb-2">
              <code>=</code>: Exact matches
            </li>
            <li className="mb-2">
              <code>@</code>: Full-text search (requires PostgreSQL)
            </li>
            <li>
              <code>$</code>: Regex search
            </li>
          </ul>

          <CodeBlock
            code={`search_fields = [
    '=username',      # Exact match on username
    '^title',         # Starts-with search on title
    '@content',       # Full-text search on content (PostgreSQL only)
    '$tags__name',    # Regex search on tags
]`}
            language="python"
          />
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Pagination</h3>
          <p className="leading-relaxed">
            Pagination divides large datasets into manageable chunks. DRF provides several pagination styles:
          </p>

          <Tabs defaultValue="page-number">
            <TabsList>
              <TabsTrigger value="page-number">PageNumberPagination</TabsTrigger>
              <TabsTrigger value="limit-offset">LimitOffsetPagination</TabsTrigger>
              <TabsTrigger value="cursor">CursorPagination</TabsTrigger>
              <TabsTrigger value="custom">Custom Pagination</TabsTrigger>
            </TabsList>
            
            <TabsContent value="page-number">
              <CodeBlock
                code={`# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}

# To override the settings for a specific view:
from rest_framework.pagination import PageNumberPagination

class LargeResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    pagination_class = LargeResultsSetPagination`}
                language="python"
              />
              <p className="mt-2 text-sm text-gray-600">
                <code>PageNumberPagination</code> uses a page query parameter:
                <br />
                <code>/api/articles/?page=2</code>
              </p>
            </TabsContent>
            
            <TabsContent value="limit-offset">
              <CodeBlock
                code={`# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 10  # Default limit
}

# Custom class
from rest_framework.pagination import LimitOffsetPagination

class StandardResultsSetPagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 100

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    pagination_class = StandardResultsSetPagination`}
                language="python"
              />
              <p className="mt-2 text-sm text-gray-600">
                <code>LimitOffsetPagination</code> uses limit and offset parameters:
                <br />
                <code>/api/articles/?limit=20&offset=40</code>
              </p>
            </TabsContent>
            
            <TabsContent value="cursor">
              <CodeBlock
                code={`# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.CursorPagination',
    'PAGE_SIZE': 10
}

# Custom class
from rest_framework.pagination import CursorPagination

class CreatedAtCursorPagination(CursorPagination):
    ordering = '-created_at'
    page_size = 25

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    pagination_class = CreatedAtCursorPagination`}
                language="python"
              />
              <p className="mt-2 text-sm text-gray-600">
                <code>CursorPagination</code> uses an opaque cursor to point to the next or previous page.
                It's ideal for "infinite scrolling" UIs and when working with large datasets that change frequently.
              </p>
            </TabsContent>
            
            <TabsContent value="custom">
              <CodeBlock
                code={`from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class CustomPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'results': data
        })`}
                language="python"
                filename="pagination.py"
              />
              <p className="mt-2 text-sm text-gray-600">
                You can create custom pagination classes by extending the base pagination classes
                and overriding methods to customize the behavior and response format.
              </p>
            </TabsContent>
          </Tabs>

          <div className="bg-gray-50 p-4 rounded-md border mt-4">
            <h4 className="font-bold mb-2">Pagination Response Format</h4>
            <p className="text-sm mb-3">
              A typical paginated response using <code>PageNumberPagination</code> looks like:
            </p>
            <CodeBlock
              code={`{
    "count": 123,      // Total number of items across all pages
    "next": "http://api.example.org/articles/?page=4",    // URL to the next page
    "previous": "http://api.example.org/articles/?page=2", // URL to the previous page
    "results": [
        // Data for the current page
        {...},
        {...}
    ]
}`}
              language="json"
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Combining Filtering and Pagination</h3>
          <p className="leading-relaxed">
            You can use filtering, searching, and pagination together:
          </p>

          <CodeBlock
            code={`from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Article
from .serializers import ArticleSerializer
from .pagination import CustomPagination

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    pagination_class = CustomPagination
    
    # Multiple filter backends
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    
    # Filtering
    filterset_fields = ['category', 'is_published', 'author']
    
    # Searching
    search_fields = ['title', 'content', 'tags__name']
    
    # Ordering
    ordering_fields = ['title', 'created_at', 'views_count']
    ordering = ['-created_at']  # Default ordering`}
            language="python"
            filename="views.py"
          />

          <p className="leading-relaxed">
            With this configuration, clients can combine all these features in a single request:
          </p>
          <div className="bg-gray-100 p-3 rounded font-mono text-sm">
            GET /api/articles/?category=technology&search=python&ordering=-views_count&page=2
          </div>
        </section>

        <PracticeExercise
          title="Filtering and Pagination Exercise"
          description="Implement filtering, searching, and pagination for a product API"
          task="Set up a ProductViewSet with filtering by category and price range, searching across product fields, and pagination."
          initialCode={`from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    # TODO: Add pagination class
    
    # TODO: Add filter backends
    
    # TODO: Configure filtering fields
    
    # TODO: Configure search fields
    
    # TODO: Configure ordering`}
          solution={`from rest_framework import viewsets, filters
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product
from .serializers import ProductSerializer

class ProductPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    # Add pagination class
    pagination_class = ProductPagination
    
    # Add filter backends
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    
    # Configure filtering fields
    filterset_fields = ['category', 'brand', 'in_stock']
    
    # Configure search fields
    search_fields = ['name', 'description', 'brand']
    
    # Configure ordering
    ordering_fields = ['name', 'price', 'created_at']
    ordering = ['name']  # Default ordering`}
          hints={[
            "Create a custom pagination class that extends PageNumberPagination",
            "Add DjangoFilterBackend, SearchFilter, and OrderingFilter to filter_backends",
            "Set filterset_fields to allow filtering by product attributes like category",
            "Set search_fields to enable text search across product name and description",
            "Configure ordering_fields and a default ordering"
          ]}
        />
      </div>
    </DocLayout>
  );
};

export default Filtering;
