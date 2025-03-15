
import React from 'react';
import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';
import PracticeExercise from '@/components/PracticeExercise';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Zap, Box, Layers, Code } from 'lucide-react';

const ViewSets = () => {
  return (
    <DocLayout title="ViewSets & Generic Views" description="Learn about advanced view patterns in Django REST Framework">
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-4">ViewSets and Generic Views</h2>
          <p className="text-lg leading-relaxed mb-4">
            Django REST Framework provides powerful abstraction layers for creating API views. ViewSets and Generic Views
            help you build consistent, reusable API patterns with minimal code duplication.
          </p>

          <Alert>
            <Zap className="h-5 w-5" />
            <AlertTitle>Why Use ViewSets?</AlertTitle>
            <AlertDescription>
              ViewSets combine the logic for multiple related views into a single class, automatically
              generating the correct actions for GET, POST, PUT, PATCH, and DELETE requests.
            </AlertDescription>
          </Alert>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Generic Views</h3>
          <p className="leading-relaxed">
            Generic views provide commonly needed behavior for working with models:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="font-bold flex items-center">
                <Code className="h-4 w-4 mr-2 text-blue-600" />
                ListAPIView
              </h4>
              <p className="text-sm mt-1">
                For read-only endpoints to represent a collection of model instances.
              </p>
              <CodeBlock
                code={`from rest_framework.generics import ListAPIView
from .models import Article
from .serializers import ArticleSerializer

class ArticleList(ListAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer`}
                language="python"
              />
            </div>
            
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="font-bold flex items-center">
                <Code className="h-4 w-4 mr-2 text-green-600" />
                RetrieveAPIView
              </h4>
              <p className="text-sm mt-1">
                For read-only endpoints to represent a single model instance.
              </p>
              <CodeBlock
                code={`from rest_framework.generics import RetrieveAPIView
from .models import Article
from .serializers import ArticleSerializer

class ArticleDetail(RetrieveAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer`}
                language="python"
              />
            </div>
            
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="font-bold flex items-center">
                <Code className="h-4 w-4 mr-2 text-amber-600" />
                CreateAPIView
              </h4>
              <p className="text-sm mt-1">
                For create-only endpoints.
              </p>
              <CodeBlock
                code={`from rest_framework.generics import CreateAPIView
from .models import Article
from .serializers import ArticleSerializer

class ArticleCreate(CreateAPIView):
    serializer_class = ArticleSerializer`}
                language="python"
              />
            </div>
            
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="font-bold flex items-center">
                <Code className="h-4 w-4 mr-2 text-red-600" />
                DestroyAPIView
              </h4>
              <p className="text-sm mt-1">
                For delete-only endpoints.
              </p>
              <CodeBlock
                code={`from rest_framework.generics import DestroyAPIView
from .models import Article

class ArticleDelete(DestroyAPIView):
    queryset = Article.objects.all()`}
                language="python"
              />
            </div>
          </div>

          <p className="mt-4">DRF also provides combined generic views:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="font-bold flex items-center">
                <Layers className="h-4 w-4 mr-2 text-purple-600" />
                ListCreateAPIView
              </h4>
              <p className="text-sm mt-1">
                For read-write endpoints to represent a collection of model instances.
              </p>
              <CodeBlock
                code={`from rest_framework.generics import ListCreateAPIView
from .models import Article
from .serializers import ArticleSerializer

class ArticleListCreate(ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer`}
                language="python"
              />
            </div>
            
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="font-bold flex items-center">
                <Layers className="h-4 w-4 mr-2 text-indigo-600" />
                RetrieveUpdateDestroyAPIView
              </h4>
              <p className="text-sm mt-1">
                For read-write-delete endpoints to represent a single model instance.
              </p>
              <CodeBlock
                code={`from rest_framework.generics import RetrieveUpdateDestroyAPIView
from .models import Article
from .serializers import ArticleSerializer

class ArticleDetail(RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer`}
                language="python"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">ViewSets</h3>
          <p className="leading-relaxed">
            ViewSets combine the logic for multiple related views in a single class:
          </p>

          <Tabs defaultValue="modelviewset">
            <TabsList>
              <TabsTrigger value="viewset">ViewSet</TabsTrigger>
              <TabsTrigger value="genericviewset">GenericViewSet</TabsTrigger>
              <TabsTrigger value="modelviewset">ModelViewSet</TabsTrigger>
              <TabsTrigger value="readonlymodelviewset">ReadOnlyModelViewSet</TabsTrigger>
            </TabsList>
            
            <TabsContent value="viewset">
              <CodeBlock
                code={`from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for listing or retrieving articles.
    """
    def list(self, request):
        queryset = Article.objects.all()
        serializer = ArticleSerializer(queryset, many=True)
        return Response(serializer.data)
        
    def retrieve(self, request, pk=None):
        try:
            article = Article.objects.get(pk=pk)
        except Article.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
            
        serializer = ArticleSerializer(article)
        return Response(serializer.data)
        
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        article = self.get_object()
        article.is_published = True
        article.save()
        return Response({'status': 'article published'})`}
                language="python"
                filename="views.py"
              />
              <p className="mt-2 text-sm text-gray-600">
                <code>ViewSet</code> is the base class with limited functionality. You need to implement the actions yourself.
              </p>
            </TabsContent>
            
            <TabsContent value="genericviewset">
              <CodeBlock
                code={`from rest_framework import viewsets
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(viewsets.GenericViewSet, 
                    ListModelMixin,
                    RetrieveModelMixin):
    """
    A viewset that provides 'retrieve' and 'list' actions.
    """
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer`}
                language="python"
                filename="views.py"
              />
              <p className="mt-2 text-sm text-gray-600">
                <code>GenericViewSet</code> combines the functionality of <code>ViewSet</code> with the attributes and methods of a <code>GenericAPIView</code>.
                You need to add mixins for the actions you want.
              </p>
            </TabsContent>
            
            <TabsContent value="modelviewset">
              <CodeBlock
                code={`from rest_framework import viewsets
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing article instances.
    Provides all CRUD operations.
    """
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer`}
                language="python"
                filename="views.py"
              />
              <p className="mt-2 text-sm text-gray-600">
                <code>ModelViewSet</code> provides complete CRUD operations: list, create, retrieve, update, partial_update, destroy.
              </p>
            </TabsContent>
            
            <TabsContent value="readonlymodelviewset">
              <CodeBlock
                code={`from rest_framework import viewsets
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A viewset for viewing article instances.
    Provides only 'list' and 'retrieve' actions.
    """
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer`}
                language="python"
                filename="views.py"
              />
              <p className="mt-2 text-sm text-gray-600">
                <code>ReadOnlyModelViewSet</code> provides only read operations: list and retrieve.
              </p>
            </TabsContent>
          </Tabs>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Custom Actions in ViewSets</h3>
          <p className="leading-relaxed">
            You can add custom actions to ViewSets using the <code>@action</code> decorator:
          </p>

          <CodeBlock
            code={`from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        article = self.get_object()
        article.is_published = True
        article.save()
        return Response({'status': 'article published'})
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_articles = self.get_queryset().filter(is_featured=True)
        serializer = self.get_serializer(featured_articles, many=True)
        return Response(serializer.data)`}
            language="python"
            filename="views.py"
          />

          <p className="leading-relaxed">
            The <code>@action</code> decorator parameters:
          </p>
          <ul className="list-disc pl-6">
            <li className="mb-2">
              <code>detail</code>: Whether the action applies to single instances (True) or the entire collection (False)
            </li>
            <li className="mb-2">
              <code>methods</code>: HTTP methods this action responds to
            </li>
            <li className="mb-2">
              <code>url_path</code>: Custom URL segment (defaults to the function name)
            </li>
            <li>
              <code>permission_classes</code>: Override permission classes for this action
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Advanced Customization</h3>
          <p className="leading-relaxed">
            ViewSets provide several methods you can override to customize behavior:
          </p>

          <CodeBlock
            code={`from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Article
from .serializers import ArticleSerializer, ArticleListSerializer, ArticleDetailSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    # Filter and search configuration
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'author']
    search_fields = ['title', 'content']
    
    def get_queryset(self):
        """
        Optionally restricts the returned articles,
        by filtering against query parameters in the URL.
        """
        queryset = Article.objects.all()
        
        # Filter by author username if provided
        username = self.request.query_params.get('username')
        if username:
            queryset = queryset.filter(author__username=username)
            
        # Filter by published status for non-staff users
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_published=True)
            
        return queryset
    
    def get_serializer_class(self):
        """
        Use different serializers for different actions.
        """
        if self.action == 'list':
            return ArticleListSerializer
        if self.action == 'retrieve':
            return ArticleDetailSerializer
        return ArticleSerializer
    
    def perform_create(self, serializer):
        """
        Set the article's author to the current user.
        """
        serializer.save(author=self.request.user)`}
            language="python"
            filename="views.py"
          />
        </section>

        <PracticeExercise
          title="ViewSet Exercise"
          description="Practice creating a ViewSet with custom actions and filtering"
          task="Create a complete ProductViewSet with custom actions for 'featured' products and filtering by category"
          initialCode={`from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing product instances.
    """
    # TODO: Set queryset and serializer_class
    
    # TODO: Add custom action for featured products
    
    # TODO: Override get_queryset to filter by category`}
          solution={`from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing product instances.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_products = self.get_queryset().filter(is_featured=True)
        serializer = self.get_serializer(featured_products, many=True)
        return Response(serializer.data)
    
    def get_queryset(self):
        queryset = Product.objects.all()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset`}
          hints={[
            "Set the queryset to Product.objects.all() and serializer_class to ProductSerializer",
            "Use the @action decorator with detail=False for the featured action",
            "Use self.request.query_params.get('category') to get the category parameter from the URL",
            "Filter the queryset with filter(category=category) if a category is provided"
          ]}
        />
      </div>
    </DocLayout>
  );
};

export default ViewSets;
