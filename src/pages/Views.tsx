
import React, { useEffect } from 'react';
import DocLayout from '@/components/DocLayout';
import ProgressTracker from '@/components/ProgressTracker';
import CodeBlock from '@/components/CodeBlock';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Server } from 'lucide-react';
import { useProgress } from '@/context/ProgressContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import PracticeExercise from '@/components/PracticeExercise';
import CodeEditor from '@/components/CodeEditor';

const Views = () => {
  const { markCompleted } = useProgress();
  
  useEffect(() => {
    // Mark this section as viewed/completed
    markCompleted("views");
  }, [markCompleted]);

  return (
    <DocLayout>
      <ProgressTracker currentSection="Views & ViewSets" />

      <h1>Django REST Framework: Views & ViewSets</h1>
      
      <p>
        Views and ViewSets are the components that handle API requests and return responses. They tie together your serializers, 
        models, and URL patterns to create a complete API. In this section, we'll explore the different types of views provided 
        by Django REST Framework and when to use each one.
      </p>

      <h2>Function-based Views vs. Class-based Views</h2>
      
      <p>
        DRF supports both function-based views and class-based views, but the latter is generally preferred for its flexibility and code reuse.
      </p>

      <Tabs defaultValue="function">
        <TabsList>
          <TabsTrigger value="function">Function-based View</TabsTrigger>
          <TabsTrigger value="class">Class-based View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="function">
          <CodeBlock 
            code={`from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Book
from .serializers import BookSerializer

@api_view(['GET', 'POST'])
def book_list(request):
    """
    List all books or create a new book.
    """
    if request.method == 'GET':
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)`}
            language="python"
            filename="views.py"
          />
        </TabsContent>
        
        <TabsContent value="class">
          <CodeBlock 
            code={`from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Book
from .serializers import BookSerializer

class BookList(APIView):
    """
    List all books or create a new book.
    """
    def get(self, request, format=None):
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)`}
            language="python"
            filename="views.py"
          />
        </TabsContent>
      </Tabs>

      <div className="bg-drf-50 border-l-4 border-drf-400 p-4 my-6">
        <h3 className="text-drf-800 font-medium mb-2">Key View Types</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>APIView</strong> - Base class for all class-based views</li>
          <li><strong>GenericAPIView</strong> - Adds common functionality like pagination</li>
          <li><strong>Mixins</strong> - Reusable behavior like listing, creating, etc.</li>
          <li><strong>Generic Views</strong> - Combines GenericAPIView with mixins for common patterns</li>
          <li><strong>ViewSets</strong> - Groups related views into a single class</li>
          <li><strong>ModelViewSet</strong> - Complete CRUD functionality for a model</li>
        </ul>
      </div>

      <h2>Generic Class-based Views</h2>
      
      <p>
        DRF provides a set of pre-built views for common operations, which can save you from writing boilerplate code:
      </p>

      <CodeBlock 
        code={`from rest_framework import generics
from .models import Book
from .serializers import BookSerializer

class BookList(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    
class BookDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer`}
        language="python"
        filename="views.py"
      />

      <p>
        The code above replaces both functions in the previous examples, handling:
      </p>
      
      <ul className="list-disc pl-5 space-y-2 mb-6">
        <li><strong>ListCreateAPIView</strong>: GET (list) and POST (create) methods</li>
        <li><strong>RetrieveUpdateDestroyAPIView</strong>: GET (retrieve), PUT/PATCH (update), and DELETE methods</li>
      </ul>

      <h2>ViewSets</h2>
      
      <p>
        ViewSets take simplification a step further by combining related views into a single class. This is especially useful 
        when you need standard CRUD operations:
      </p>

      <CodeBlock 
        code={`from rest_framework import viewsets
from .models import Book
from .serializers import BookSerializer

class BookViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing book instances.
    """
    queryset = Book.objects.all()
    serializer_class = BookSerializer`}
        language="python"
        filename="views.py"
      />

      <p>
        This single class provides all these endpoints automatically:
      </p>
      
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">HTTP Method</th>
              <th className="border p-2 text-left">URL</th>
              <th className="border p-2 text-left">Action</th>
              <th className="border p-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">GET</td>
              <td className="border p-2">/books/</td>
              <td className="border p-2">list</td>
              <td className="border p-2">List all books</td>
            </tr>
            <tr>
              <td className="border p-2">POST</td>
              <td className="border p-2">/books/</td>
              <td className="border p-2">create</td>
              <td className="border p-2">Create a new book</td>
            </tr>
            <tr>
              <td className="border p-2">GET</td>
              <td className="border p-2">/books/{'{id}'}/</td>
              <td className="border p-2">retrieve</td>
              <td className="border p-2">Get a specific book</td>
            </tr>
            <tr>
              <td className="border p-2">PUT</td>
              <td className="border p-2">/books/{'{id}'}/</td>
              <td className="border p-2">update</td>
              <td className="border p-2">Update a book completely</td>
            </tr>
            <tr>
              <td className="border p-2">PATCH</td>
              <td className="border p-2">/books/{'{id}'}/</td>
              <td className="border p-2">partial_update</td>
              <td className="border p-2">Update a book partially</td>
            </tr>
            <tr>
              <td className="border p-2">DELETE</td>
              <td className="border p-2">/books/{'{id}'}/</td>
              <td className="border p-2">destroy</td>
              <td className="border p-2">Delete a book</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Customizing ViewSets</h2>
      
      <p>
        ViewSets can be customized to fit your specific needs:
      </p>

      <CodeBlock 
        code={`from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer, BookReviewSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    
    # Filter queryset based on query parameters
    def get_queryset(self):
        queryset = Book.objects.all()
        author = self.request.query_params.get('author')
        if author:
            queryset = queryset.filter(author__name__icontains=author)
        return queryset
    
    # Choose serializer based on action
    def get_serializer_class(self):
        if self.action == 'reviews':
            return BookReviewSerializer
        return BookSerializer
    
    # Custom action for adding a review
    @action(detail=True, methods=['post'])
    def reviews(self, request, pk=None):
        book = self.get_object()
        serializer = BookReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(book=book, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)`}
        language="python"
        filename="views.py"
      />

      <h2>Permissions and Authentication</h2>
      
      <p>
        Views can include permissions to control access:
      </p>

      <CodeBlock 
        code={`from rest_framework import viewsets, permissions
from .models import Book
from .serializers import BookSerializer
from .permissions import IsAuthorOrReadOnly

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    
    # Different permissions for different actions
    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthorOrReadOnly]
        elif self.action == 'create':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]`}
        language="python"
        filename="views.py"
      />

      <h2>Practice Exercise: Create a ViewSet</h2>
      
      <PracticeExercise
        title="Creating a Product ViewSet"
        description="In this exercise, you'll create a ViewSet for a Product model."
        task="Create a ModelViewSet for a Product model with a custom action to mark products as featured."
        initialCode={`from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    # Your code here`}
        solution={`from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    @action(detail=True, methods=['post'])
    def feature(self, request, pk=None):
        product = self.get_object()
        product.is_featured = True
        product.save()
        return Response({'status': 'product marked as featured'}, status=status.HTTP_200_OK)`}
        hints={[
          "Start by setting the queryset and serializer_class attributes",
          "Use the @action decorator to define a custom action",
          "The 'detail=True' parameter means this action applies to a single product",
          "Remember to save the model after making changes",
          "Return a Response with an appropriate status code"
        ]}
        className="mb-8"
      />

      <h2>Interactive Code Editor</h2>
      
      <CodeEditor
        initialCode={`from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Article
from .serializers import ArticleSerializer

class ArticleList(APIView):
    def get(self, request):
        # Complete this method to list all articles
        pass
        
    def post(self, request):
        # Complete this method to create a new article
        pass`}
        expectedOutput={`{"id": 1, "title": "DRF Tutorial", "content": "Learning DRF is fun", "author": "Jane Doe"}`}
        challenge="Complete the ArticleList APIView by implementing the GET and POST methods. The GET method should return all articles, and the POST method should create a new article after validating the data."
        className="mb-8"
      />

      <Alert className="mb-8">
        <Server className="h-4 w-4" />
        <AlertTitle>Best Practice</AlertTitle>
        <AlertDescription>
          Generally, if you need standard CRUD operations, using ViewSets will save you time. 
          Use APIView or generic views when you need more fine-grained control over your API's behavior.
        </AlertDescription>
      </Alert>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
        <h3 className="text-lg font-medium mb-3">Next Steps</h3>
        <p className="mb-4">
          Now that you understand Views and ViewSets, let's learn how to connect them to URLs using Routers.
        </p>
        <Button asChild className="bg-drf-600 hover:bg-drf-700">
          <Link to="/routers" className="flex items-center">
            Next: Routers & URLs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </DocLayout>
  );
};

export default Views;
