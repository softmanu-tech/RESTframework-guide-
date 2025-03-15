
import React, { useEffect } from 'react';
import DocLayout from '@/components/DocLayout';
import ProgressTracker from '@/components/ProgressTracker';
import CodeBlock from '@/components/CodeBlock';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code } from 'lucide-react';
import { useProgress } from '@/context/ProgressContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import CodeEditor from '@/components/CodeEditor';
import PracticeExercise from '@/components/PracticeExercise';

const Serializers = () => {
  const { markCompleted } = useProgress();
  
  useEffect(() => {
    // Mark this section as viewed/completed
    markCompleted("serializers");
  }, [markCompleted]);

  return (
    <DocLayout>
      <ProgressTracker currentSection="Serializers" />

      <h1>Django REST Framework Serializers</h1>
      
      <p>
        Serializers are a crucial component of Django REST Framework that allow complex data such as querysets and model
        instances to be converted to native Python datatypes that can then be easily rendered into JSON, XML, or other content types.
        Serializers also provide deserialization, allowing parsed data to be converted back into complex types.
      </p>

      <h2>What are Serializers?</h2>
      
      <p>
        In the context of web APIs, serialization is the process of converting your application's data structures into a format that
        can be easily transmitted over a network and reconstructed on the receiving end. DRF serializers handle:
      </p>
      
      <ul className="list-disc pl-5 space-y-2 mb-6">
        <li>Converting Django model instances to JSON</li>
        <li>Validating incoming data before saving it to the database</li>
        <li>Converting JSON data back to Django model instances</li>
        <li>Handling nested relationships between models</li>
      </ul>

      <div className="bg-drf-50 border-l-4 border-drf-400 p-4 my-6">
        <h3 className="text-drf-800 font-medium mb-2">Key Serializer Types</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Serializer</strong> - Basic serializer class</li>
          <li><strong>ModelSerializer</strong> - Simplified serializer that automatically generates fields based on a model</li>
          <li><strong>HyperlinkedModelSerializer</strong> - Similar to ModelSerializer but uses hyperlinks for relationships</li>
          <li><strong>ListSerializer</strong> - For serializing multiple objects at once</li>
        </ul>
      </div>

      <h2>Basic Serializer Example</h2>
      
      <p>
        Let's start with a basic serializer that defines fields explicitly:
      </p>

      <CodeBlock 
        code={`from rest_framework import serializers

class BookSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=100)
    author = serializers.CharField(max_length=100)
    publication_date = serializers.DateField()
    price = serializers.DecimalField(max_digits=6, decimal_places=2)
    
    def create(self, validated_data):
        return Book.objects.create(**validated_data)
        
    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.author = validated_data.get('author', instance.author)
        instance.publication_date = validated_data.get('publication_date', instance.publication_date)
        instance.price = validated_data.get('price', instance.price)
        instance.save()
        return instance`}
        language="python"
        filename="serializers.py"
      />

      <p>
        This serializer manually defines each field that will be serialized/deserialized and provides methods
        for creating and updating Book instances.
      </p>

      <h2>ModelSerializer</h2>
      
      <p>
        For most cases, using ModelSerializer is more efficient as it automatically generates fields based on your model:
      </p>

      <CodeBlock 
        code={`from rest_framework import serializers
from .models import Book

class BookModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'publication_date', 'price']
        # Or use fields = '__all__' to include all model fields
        # You can also exclude specific fields with:
        # exclude = ['created_at', 'updated_at']`}
        language="python"
        filename="serializers.py"
      />

      <p>
        ModelSerializer automatically provides:
      </p>
      
      <ul className="list-disc pl-5 space-y-2 mb-6">
        <li>Auto-generated fields based on the model</li>
        <li>Default implementations of <code>create()</code> and <code>update()</code></li>
        <li>Validators based on the model field constraints</li>
      </ul>

      <h2>Field Types</h2>
      
      <p>
        DRF provides many field types for different data needs:
      </p>

      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Field Type</th>
              <th className="border p-2 text-left">Python Type</th>
              <th className="border p-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2"><code>CharField</code></td>
              <td className="border p-2">string</td>
              <td className="border p-2">Text field with optional max_length</td>
            </tr>
            <tr>
              <td className="border p-2"><code>IntegerField</code></td>
              <td className="border p-2">integer</td>
              <td className="border p-2">Integer field</td>
            </tr>
            <tr>
              <td className="border p-2"><code>FloatField</code></td>
              <td className="border p-2">float</td>
              <td className="border p-2">Floating point number</td>
            </tr>
            <tr>
              <td className="border p-2"><code>BooleanField</code></td>
              <td className="border p-2">boolean</td>
              <td className="border p-2">True/False field</td>
            </tr>
            <tr>
              <td className="border p-2"><code>DateTimeField</code></td>
              <td className="border p-2">datetime</td>
              <td className="border p-2">Date and time</td>
            </tr>
            <tr>
              <td className="border p-2"><code>EmailField</code></td>
              <td className="border p-2">string</td>
              <td className="border p-2">Email-validated string</td>
            </tr>
            <tr>
              <td className="border p-2"><code>URLField</code></td>
              <td className="border p-2">string</td>
              <td className="border p-2">URL-validated string</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Nested Serializers</h2>
      
      <p>
        Handling relationships between models is a common requirement. DRF makes this easy with nested serializers:
      </p>

      <CodeBlock 
        code={`class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name', 'bio']

class BookSerializer(serializers.ModelSerializer):
    # Nested serializer for the author relationship
    author = AuthorSerializer()
    
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'publication_date', 'price']
        
    # Custom create method to handle the nested author data
    def create(self, validated_data):
        author_data = validated_data.pop('author')
        author = Author.objects.create(**author_data)
        book = Book.objects.create(author=author, **validated_data)
        return book`}
        language="python"
        filename="serializers.py"
      />

      <h2>Validation</h2>
      
      <p>
        Serializers also handle validation. You can add validation in several ways:
      </p>

      <Tabs defaultValue="field">
        <TabsList>
          <TabsTrigger value="field">Field-level Validation</TabsTrigger>
          <TabsTrigger value="object">Object-level Validation</TabsTrigger>
          <TabsTrigger value="validators">Validators</TabsTrigger>
        </TabsList>
        
        <TabsContent value="field">
          <CodeBlock 
            code={`class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'publication_date', 'price']
    
    def validate_title(self, value):
        # Field-level validation
        if "Django" not in value:
            raise serializers.ValidationError("Book title must contain 'Django'")
        return value`}
            language="python"
          />
        </TabsContent>
        
        <TabsContent value="object">
          <CodeBlock 
            code={`class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'publication_date', 'price']
    
    def validate(self, data):
        # Object-level validation
        if data['price'] > 100 and data['publication_date'].year < 2000:
            raise serializers.ValidationError("Old books cannot be priced over $100")
        return data`}
            language="python"
          />
        </TabsContent>
        
        <TabsContent value="validators">
          <CodeBlock 
            code={`from rest_framework import serializers
from rest_framework.validators import UniqueValidator

class BookSerializer(serializers.ModelSerializer):
    title = serializers.CharField(
        max_length=100,
        validators=[UniqueValidator(queryset=Book.objects.all())]
    )
    
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'publication_date', 'price']`}
            language="python"
          />
        </TabsContent>
      </Tabs>

      <h2>Practice Exercise: Create a Serializer</h2>
      
      <PracticeExercise
        title="Creating a Blog Serializer"
        description="In this exercise, you'll create a serializer for a blog application."
        task="Create a ModelSerializer for a Post model with fields for 'title', 'content', 'author', 'created_at', and 'is_published'. Add validation to ensure the title is at least 5 characters long."
        initialCode={`from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    # Your code here
    
    class Meta:
        # Your code here
        
    # Add validation here`}
        solution={`from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'created_at', 'is_published']
        
    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("Title must be at least 5 characters long")
        return value`}
        hints={[
          "Start by defining the Meta class with model and fields attributes",
          "Use fields = [...] to explicitly list which fields to include",
          "For validation, create a method named validate_title to handle title-specific validation",
          "Use serializers.ValidationError to raise validation errors"
        ]}
        className="mb-8"
      />

      <h2>Interactive Code Editor</h2>
      
      <CodeEditor
        initialCode={`from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    # Complete the serializer
    class Meta:
        model = Product
        fields = '__all__'`}
        expectedOutput={`{"id": 1, "name": "Smartphone", "description": "Latest model", "price": 999.99, "in_stock": true}`}
        challenge="Complete the ProductSerializer class by adding validation to ensure 'price' is always positive. The serializer should be able to serialize a Product instance to JSON."
        className="mb-8"
      />

      <Alert className="mb-8">
        <BookOpen className="h-4 w-4" />
        <AlertTitle>Remember</AlertTitle>
        <AlertDescription>
          Serializers are the bridge between your Django models and the JSON/XML responses in your API. 
          They handle both serialization (Python → JSON) and deserialization (JSON → Python) along with validation.
        </AlertDescription>
      </Alert>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
        <h3 className="text-lg font-medium mb-3">Next Steps</h3>
        <p className="mb-4">
          Now that you understand serializers, let's learn how to use them in views to build API endpoints.
        </p>
        <Button asChild className="bg-drf-600 hover:bg-drf-700">
          <Link to="/views" className="flex items-center">
            Next: Views & ViewSets
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </DocLayout>
  );
};

export default Serializers;
