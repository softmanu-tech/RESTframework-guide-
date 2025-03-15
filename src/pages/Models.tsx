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

const Models = () => {
  const { markCompleted } = useProgress();
  
  useEffect(() => {
    // Mark this section as viewed/completed
    markCompleted("models");
  }, [markCompleted]);

  return (
    <DocLayout>
      <ProgressTracker currentSection="Models" />

      <h1>Django REST Framework Models</h1>
      
      <p>
        In Django REST Framework (DRF), models are the foundation of your API. They represent the data structure and define the
        fields that will be exposed through your API endpoints. Understanding how to define and use models is crucial for building
        robust and scalable APIs.
      </p>

      <h2>What are Models?</h2>
      
      <p>
        Models are Python classes that inherit from <code>django.db.models.Model</code>. Each model represents a database table,
        and each attribute of the model represents a database column. Models define the structure of your data and provide a
        high-level interface for interacting with the database.
      </p>
      
      <p>
        In the context of DRF, models are used to define the data that will be serialized and deserialized by your API.
        Serializers convert model instances to JSON, XML, or other content types, and deserializers convert incoming data back
        into model instances.
      </p>

      <div className="bg-drf-50 border-l-4 border-drf-400 p-4 my-6">
        <h3 className="text-drf-800 font-medium mb-2">Key Model Concepts</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Fields</strong> - Attributes of the model that represent database columns</li>
          <li><strong>Relationships</strong> - Define how models relate to each other (e.g., ForeignKey, ManyToManyField)</li>
          <li><strong>Meta Options</strong> - Configure model behavior (e.g., table name, ordering)</li>
          <li><strong>Methods</strong> - Custom methods for performing operations on model instances</li>
        </ul>
      </div>

      <h2>Basic Model Example</h2>
      
      <p>
        Let's start with a basic example of a model:
      </p>

      <CodeBlock 
        code={`from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    publication_date = models.DateField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    
    def __str__(self):
        return self.title`}
        language="python"
        filename="models.py"
      />

      <p>
        This model defines a <code>Book</code> with fields for <code>title</code>, <code>author</code>, <code>publication_date</code>,
        and <code>price</code>. The <code>__str__</code> method provides a human-readable representation of the model instance.
      </p>

      <h2>Field Types</h2>
      
      <p>
        Django provides a variety of field types for different data needs:
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

      <h2>Relationships</h2>
      
      <p>
        Models can be related to each other using ForeignKey, ManyToManyField, and OneToOneField. Let's look at an example:
      </p>

      <CodeBlock 
        code={`from django.db import models

class Author(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField()
    
    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    publication_date = models.DateField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    
    def __str__(self):
        return self.title`}
        language="python"
        filename="models.py"
      />

      <p>
        In this example, the <code>Book</code> model has a ForeignKey relationship with the <code>Author</code> model. This means
        that each book is associated with a single author.
      </p>

      <h2>Meta Options</h2>
      
      <p>
        Meta options allow you to configure model behavior. For example, you can specify the table name, ordering, and more:
      </p>

      <CodeBlock 
        code={`from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    publication_date = models.DateField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    
    class Meta:
        db_table = 'books'
        ordering = ['-publication_date']
    
    def __str__(self):
        return self.title`}
        language="python"
        filename="models.py"
      />

      <p>
        In this example, we've specified the table name as <code>books</code> and the default ordering as
        <code>publication_date</code> in descending order.
      </p>

      <h2>Model Methods</h2>
      
      <p>
        You can add custom methods to your models to perform operations on model instances. For example:
      </p>

      <CodeBlock 
        code={`from django.db import models
from django.utils import timezone

class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    publication_date = models.DateField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    
    def is_published_recently(self):
        now = timezone.now()
        return self.publication_date >= now - timezone.timedelta(days=30)
    
    def __str__(self):
        return self.title`}
        language="python"
        filename="models.py"
      />

      <p>
        In this example, we've added a method called <code>is_published_recently</code> that returns True if the book was
        published within the last 30 days.
      </p>

      <h2>Practice Exercise: Create a Model</h2>
      
      <PracticeExercise
        title="Creating a Blog Model"
        description="In this exercise, you'll create a model for a blog application."
        task="Create a model for a Post with fields for 'title', 'content', 'author', 'created_at', and 'is_published'."
        initialCode={`from django.db import models

class Post(models.Model):
    # Your code here
    pass`}
        solution={`from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    is_published = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title`}
        hints={[
          "Start by defining the model class and inheriting from models.Model",
          "Use CharField for text-based fields like title and author",
          "Use TextField for longer text content",
          "Use DateTimeField for date and time information",
          "Use BooleanField for true/false values"
        ]}
        className="mb-8"
      />

      <h2>Interactive Code Editor</h2>
      
      <CodeEditor
        initialCode={`from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    in_stock = models.BooleanField(default=True)
    
    # Add a method to check if the product is on sale
    def is_on_sale(self):
        # Your code here
        return False`}
        expectedOutput="Product is on sale: False"
        challenge="Add a method to the Product model to check if the product is on sale (e.g., price is less than 50% of its original price)."
        className="mb-8"
      />

      <Alert className="mb-8">
        <BookOpen className="h-4 w-4" />
        <AlertTitle>Remember</AlertTitle>
        <AlertDescription>
          Models are the foundation of your API. They define the data structure and provide a high-level interface
          for interacting with the database.
        </AlertDescription>
      </Alert>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
        <h3 className="text-lg font-medium mb-3">Next Steps</h3>
        <p className="mb-4">
          Now that you understand models, let's move on to serializers, which are used to convert model instances
          to JSON, XML, or other content types.
        </p>
        <Button asChild className="bg-drf-600 hover:bg-drf-700">
          <Link to="/serializers" className="flex items-center">
            Next: Serializers
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </DocLayout>
  );
};

export default Models;
