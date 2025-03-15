
import React from 'react';
import DocLayout from '@/components/DocLayout';
import PracticeExercise from '@/components/PracticeExercise';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Practice = () => {
  return (
    <DocLayout>
      <h1>Practice Exercises</h1>
      
      <p className="text-lg mb-8">
        Apply what you've learned about Django REST Framework with these hands-on practice exercises. Each exercise focuses on a different aspect of DRF and includes starter code, hints, and solutions.
      </p>
      
      <Tabs defaultValue="beginner" className="mb-10">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="beginner">
          <h2>Beginner Practice Exercises</h2>
          <p className="mb-6">These exercises focus on the fundamentals of DRF, including serializers, views, and basic CRUD operations.</p>
          
          <PracticeExercise
            title="Creating a Basic Serializer"
            description="Learn how to create a serializer for a simple Book model."
            task="Create a ModelSerializer for the Book model that includes the fields 'id', 'title', 'author', 'publication_date', and 'price'."
            initialCode={`from rest_framework import serializers
from .models import Book

# Define your BookSerializer here

class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    publication_date = models.DateField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
`}
            solution={`from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'publication_date', 'price']
        # Alternatively, you can use fields = '__all__' to include all fields
`}
            hints={[
              "Use serializers.ModelSerializer as the base class",
              "Define a Meta class inside your serializer",
              "Set the 'model' attribute to Book",
              "Use the 'fields' attribute to specify which fields to include"
            ]}
            className="mb-8"
          />
          
          <PracticeExercise
            title="Creating a Function-Based API View"
            description="Learn how to create a simple API view that returns a list of books."
            task="Create a function-based API view that handles GET requests and returns a list of all books."
            initialCode={`from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer

# Define your book_list view here
`}
            solution={`from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer

@api_view(['GET'])
def book_list(request):
    books = Book.objects.all()
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)
`}
            hints={[
              "Use the @api_view decorator with a list of allowed HTTP methods",
              "Query all Book objects from the database",
              "Create a serializer instance with the queryset and set many=True",
              "Return a Response object with the serialized data"
            ]}
            className="mb-8"
          />
          
          <PracticeExercise
            title="Connecting Views to URLs"
            description="Learn how to connect your API views to URL patterns."
            task="Create URL patterns for the book_list view and a book_detail view (not shown)."
            initialCode={`from django.urls import path
from . import views

# Define your urlpatterns here
`}
            solution={`from django.urls import path
from . import views

urlpatterns = [
    path('books/', views.book_list, name='book-list'),
    path('books/<int:pk>/', views.book_detail, name='book-detail'),
]
`}
            hints={[
              "Use django.urls.path to define URL patterns",
              "The first argument is the URL pattern",
              "The second argument is the view function",
              "The third (optional) argument is the name of the URL pattern",
              "Use <int:pk> to capture a primary key from the URL"
            ]}
          />
        </TabsContent>
        
        <TabsContent value="intermediate">
          <h2>Intermediate Practice Exercises</h2>
          <p className="mb-6">These exercises focus on more advanced DRF features, including class-based views, authentication, and permissions.</p>
          
          <PracticeExercise
            title="Creating a Class-Based API View"
            description="Learn how to create a class-based API view that handles multiple HTTP methods."
            task="Create a class-based API view that handles GET (list), POST (create), PUT (update), and DELETE (destroy) requests for a Book model."
            initialCode={`from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Book
from .serializers import BookSerializer

# Define your BookListCreateView here
`}
            solution={`from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from .models import Book
from .serializers import BookSerializer

class BookListCreateView(APIView):
    def get(self, request):
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class BookDetailView(APIView):
    def get_object(self, pk):
        try:
            return Book.objects.get(pk=pk)
        except Book.DoesNotExist:
            raise Http404
    
    def get(self, request, pk):
        book = self.get_object(pk)
        serializer = BookSerializer(book)
        return Response(serializer.data)
    
    def put(self, request, pk):
        book = self.get_object(pk)
        serializer = BookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        book = self.get_object(pk)
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
`}
            hints={[
              "Create a class that inherits from APIView",
              "Implement methods for each HTTP method you want to support (get, post, put, delete)",
              "For the book detail view, create a helper method to get the book by primary key",
              "Use Response objects to return appropriate status codes and data"
            ]}
            className="mb-8"
          />
          
          <PracticeExercise
            title="Adding Authentication and Permissions"
            description="Learn how to add authentication and permissions to your API views."
            task="Add token authentication and IsAuthenticated permission to a BookViewSet."
            initialCode={`from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Book
from .serializers import BookSerializer

# Define your BookViewSet here
`}
            solution={`from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Book
from .serializers import BookSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
`}
            hints={[
              "Create a class that inherits from viewsets.ModelViewSet",
              "Set the queryset attribute to Book.objects.all()",
              "Set the serializer_class attribute to BookSerializer",
              "Set the authentication_classes attribute to a list containing TokenAuthentication",
              "Set the permission_classes attribute to a list containing IsAuthenticated"
            ]}
            className="mb-8"
          />
          
          <PracticeExercise
            title="Using Generic Views"
            description="Learn how to use DRF's generic views to simplify your API views."
            task="Convert the class-based views to use DRF's generic views (ListCreateAPIView and RetrieveUpdateDestroyAPIView)."
            initialCode={`from rest_framework import generics
from .models import Book
from .serializers import BookSerializer

# Define your BookList and BookDetail views here
`}
            solution={`from rest_framework import generics
from .models import Book
from .serializers import BookSerializer

class BookList(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

class BookDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
`}
            hints={[
              "Use generics.ListCreateAPIView for the list view (handles GET and POST)",
              "Use generics.RetrieveUpdateDestroyAPIView for the detail view (handles GET, PUT, and DELETE)",
              "Set the queryset and serializer_class attributes for each view",
              "No need to implement the HTTP methods manually - they're provided by the generic views"
            ]}
          />
        </TabsContent>
        
        <TabsContent value="advanced">
          <h2>Advanced Practice Exercises</h2>
          <p className="mb-6">These exercises focus on advanced DRF topics, including custom permissions, filters, and viewsets.</p>
          
          <PracticeExercise
            title="Creating Custom Permissions"
            description="Learn how to create custom permission classes."
            task="Create a custom permission class that only allows owners of a book to edit it, while allowing anyone to view it."
            initialCode={`from rest_framework import permissions

# Define your IsOwnerOrReadOnly permission class here
`}
            solution={`from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of a book to edit it.
    """
    
    def has_object_permission(self, request, view, obj):
        # Allow all read methods (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Allow write permissions only to the owner
        return obj.owner == request.user
`}
            hints={[
              "Create a class that inherits from permissions.BasePermission",
              "Implement the has_object_permission method",
              "Use permissions.SAFE_METHODS to check if the request is read-only",
              "Compare the object's owner with the request.user to check ownership"
            ]}
            className="mb-8"
          />
          
          <PracticeExercise
            title="Adding Filtering and Pagination"
            description="Learn how to add filtering and pagination to your API views."
            task="Add filtering and pagination to a BookViewSet."
            initialCode={`from rest_framework import viewsets
from rest_framework import filters
from .models import Book
from .serializers import BookSerializer

# Define your BookViewSet here
`}
            solution={`from rest_framework import viewsets
from rest_framework import filters
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .models import Book
from .serializers import BookSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['author', 'publication_date']
    search_fields = ['title', 'author']
    ordering_fields = ['title', 'publication_date', 'price']
`}
            hints={[
              "Create a custom pagination class that inherits from PageNumberPagination",
              "Set the filter_backends attribute to a list of filter backends",
              "Use DjangoFilterBackend for exact filtering, SearchFilter for text search, and OrderingFilter for sorting",
              "Set the filterset_fields, search_fields, and ordering_fields attributes to specify which fields can be filtered, searched, or ordered"
            ]}
            className="mb-8"
          />
          
          <PracticeExercise
            title="Creating a Nested Serializer"
            description="Learn how to create nested serializers for handling related objects."
            task="Create a nested serializer for an Author model that includes all of their books."
            initialCode={`from rest_framework import serializers
from .models import Author, Book

# Author has a one-to-many relationship with Book

# Define your BookSerializer and AuthorSerializer here
`}
            solution={`from rest_framework import serializers
from .models import Author, Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'publication_date', 'price']

class AuthorSerializer(serializers.ModelSerializer):
    books = BookSerializer(many=True, read_only=True)
    
    class Meta:
        model = Author
        fields = ['id', 'name', 'bio', 'books']
        
# In your Author model, you would have:
# books = models.ForeignKey(Book, related_name='books', on_delete=models.CASCADE)
`}
            hints={[
              "Create a BookSerializer first",
              "In the AuthorSerializer, add a field for books that uses the BookSerializer",
              "Set many=True because an author can have multiple books",
              "Set read_only=True if you don't want to allow creating books through the author endpoint",
              "Make sure your Author model has a related_name for the reverse relationship"
            ]}
          />
        </TabsContent>
      </Tabs>
    </DocLayout>
  );
};

export default Practice;
