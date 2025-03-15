
import React from 'react';
import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';
import PracticeExercise from '@/components/PracticeExercise';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, Code, TestTube, Check, Bug } from 'lucide-react';

const Testing = () => {
  return (
    <DocLayout title="Testing in DRF" description="Learn how to write tests for your Django REST Framework APIs">
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-4">Testing Django REST Framework APIs</h2>
          <p className="text-lg leading-relaxed mb-4">
            Testing is a crucial part of API development. Django REST Framework builds on Django's testing tools
            to make it easy to write tests for your API views, serializers, and other components.
          </p>

          <Alert>
            <TestTube className="h-5 w-5" />
            <AlertTitle>Why Test APIs?</AlertTitle>
            <AlertDescription>
              Well-tested APIs are more reliable, easier to refactor, and provide documentation of expected 
              behavior. Testing helps catch bugs early and ensures your API continues to work as expected as 
              you make changes.
            </AlertDescription>
          </Alert>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Getting Started with API Testing</h3>
          <p className="leading-relaxed">
            DRF provides an <code>APITestCase</code> class that extends Django's <code>TestCase</code> with
            useful utilities for API testing:
          </p>

          <CodeBlock
            code={`from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Article

class ArticleTests(APITestCase):
    def setUp(self):
        # This method runs before each test
        self.article = Article.objects.create(
            title="Test Article",
            content="This is a test article.",
            author_id=1
        )
    
    def test_list_articles(self):
        """
        Ensure we can retrieve the article list.
        """
        url = reverse('article-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
    def test_create_article(self):
        """
        Ensure we can create a new article.
        """
        url = reverse('article-list')
        data = {
            'title': 'New Test Article',
            'content': 'Content for new test article',
            'author': 1
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Article.objects.count(), 2)
        self.assertEqual(Article.objects.last().title, 'New Test Article')`}
            language="python"
            filename="tests.py"
          />

          <p className="mt-3">
            To run your tests, use Django's test command:
          </p>
          <div className="bg-gray-100 p-3 rounded font-mono text-sm">
            python manage.py test
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Testing Authentication and Permissions</h3>
          <p className="leading-relaxed">
            When your API uses authentication and permissions, you need to include this in your tests:
          </p>

          <CodeBlock
            code={`from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from .models import Article

class AuthenticatedArticleTests(APITestCase):
    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(
            username='testuser', 
            email='test@example.com', 
            password='testpassword'
        )
        
        # Create a token for the user
        self.token = Token.objects.create(user=self.user)
        
        # Create a test article
        self.article = Article.objects.create(
            title="Test Article",
            content="This is a test article.",
            author=self.user
        )
        
        # Create another user's article
        self.other_user = User.objects.create_user(
            username='otheruser', 
            email='other@example.com', 
            password='otherpassword'
        )
        self.other_article = Article.objects.create(
            title="Other's Article",
            content="This belongs to another user",
            author=self.other_user
        )
        
        # API endpoints
        self.list_url = reverse('article-list')
        self.detail_url = reverse('article-detail', args=[self.article.id])
        self.other_detail_url = reverse('article-detail', args=[self.other_article.id])
    
    def authenticate(self):
        # Set the authorization header with the token
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
    
    def test_authenticated_access(self):
        """
        Test that authentication is required for certain endpoints.
        """
        # Unauthenticated request should fail
        response = self.client.post(self.list_url, {
            'title': 'New Article',
            'content': 'This should fail without auth'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Authenticate and try again
        self.authenticate()
        response = self.client.post(self.list_url, {
            'title': 'New Article',
            'content': 'This should work with auth'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_permission_restrictions(self):
        """
        Test permission restrictions (can't modify other user's articles).
        """
        self.authenticate()
        
        # Should be able to modify own article
        response = self.client.patch(self.detail_url, {
            'title': 'Updated Title'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Should not be able to modify another user's article
        response = self.client.patch(self.other_detail_url, {
            'title': 'Trying to change someone else\'s article'
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)`}
            language="python"
            filename="test_auth.py"
          />
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Testing Serializers</h3>
          <p className="leading-relaxed">
            Testing serializers separately allows you to verify data validation and transformation:
          </p>

          <CodeBlock
            code={`from django.test import TestCase
from .serializers import ArticleSerializer
from .models import Article, Category

class ArticleSerializerTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Technology")
        self.article_data = {
            'title': 'New Article',
            'content': 'Article content',
            'category': self.category.id,
            'tags': ['python', 'django']
        }
        
    def test_serializer_validation(self):
        """
        Test serializer validation rules.
        """
        # Valid data
        serializer = ArticleSerializer(data=self.article_data)
        self.assertTrue(serializer.is_valid())
        
        # Invalid - missing required field
        invalid_data = self.article_data.copy()
        invalid_data.pop('title')
        serializer = ArticleSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('title', serializer.errors)
        
        # Invalid - title too short
        invalid_data = self.article_data.copy()
        invalid_data['title'] = 'Abc'  # Assuming min length is 5 chars
        serializer = ArticleSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('title', serializer.errors)
    
    def test_serializer_create(self):
        """
        Test serializer's create method.
        """
        serializer = ArticleSerializer(data=self.article_data)
        self.assertTrue(serializer.is_valid())
        
        article = serializer.save(author_id=1)
        self.assertEqual(article.title, 'New Article')
        self.assertEqual(article.category, self.category)
        self.assertEqual(article.tags.count(), 2)
        
    def test_serializer_output(self):
        """
        Test serializer's output format.
        """
        article = Article.objects.create(
            title='Test Article',
            content='Test Content',
            category=self.category,
            author_id=1
        )
        article.tags.add('python', 'test')
        
        serializer = ArticleSerializer(article)
        data = serializer.data
        
        self.assertEqual(data['title'], 'Test Article')
        self.assertEqual(data['content'], 'Test Content')
        self.assertEqual(data['category'], self.category.id)
        self.assertIn('python', data['tags'])
        self.assertIn('test', data['tags'])`}
            language="python"
            filename="test_serializers.py"
          />
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Testing ViewSets and Custom Actions</h3>
          <p className="leading-relaxed">
            To test ViewSets and their custom actions:
          </p>

          <CodeBlock
            code={`from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Article

class ArticleViewSetTest(APITestCase):
    def setUp(self):
        self.article = Article.objects.create(
            title="Test Article",
            content="This is a test article",
            author_id=1,
            is_published=False
        )
        
    def test_custom_action(self):
        """
        Test a custom 'publish' action on the ViewSet.
        """
        # Construct the URL for the custom action
        url = reverse('article-publish', args=[self.article.id])
        
        # Make the request
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify the action had the expected effect
        self.article.refresh_from_db()
        self.assertTrue(self.article.is_published)
        
    def test_filtered_list(self):
        """
        Test a list action with filters applied.
        """
        # Create additional test data
        Article.objects.create(
            title="Published Article", 
            content="This one is published",
            author_id=1,
            is_published=True
        )
        
        # Test filtered list
        url = reverse('article-list')
        response = self.client.get(url, {'is_published': 'true'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Published Article")`}
            language="python"
            filename="test_viewsets.py"
          />
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Advanced Testing Techniques</h3>
          
          <Tabs defaultValue="fixtures">
            <TabsList>
              <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
              <TabsTrigger value="mocking">Mocking</TabsTrigger>
              <TabsTrigger value="factory-boy">Factory Boy</TabsTrigger>
            </TabsList>
            
            <TabsContent value="fixtures">
              <p className="mb-2">
                Django fixtures let you load pre-defined data for testing:
              </p>
              <CodeBlock
                code={`# articles/fixtures/test_articles.json
[
  {
    "model": "articles.article",
    "pk": 1,
    "fields": {
      "title": "Test Article 1",
      "content": "This is test content",
      "author": 1,
      "created_at": "2023-01-01T12:00:00Z",
      "is_published": true
    }
  },
  {
    "model": "articles.article",
    "pk": 2,
    "fields": {
      "title": "Test Article 2",
      "content": "This is more test content",
      "author": 2,
      "created_at": "2023-01-02T12:00:00Z",
      "is_published": false
    }
  }
]

# In your test file:
class ArticleTestWithFixtures(APITestCase):
    fixtures = ['test_articles.json']
    
    def test_list_with_fixtures(self):
        url = reverse('article-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)`}
                language="python"
              />
            </TabsContent>
            
            <TabsContent value="mocking">
              <p className="mb-2">
                When testing code that calls external services, use mocking to isolate your tests:
              </p>
              <CodeBlock
                code={`from unittest import mock
from django.test import TestCase
from .services import WeatherService
from .models import Article
from .tasks import update_weather_articles

class WeatherArticleTest(TestCase):
    @mock.patch('myapp.services.WeatherService.get_weather_data')
    def test_update_weather_articles(self, mock_get_weather):
        # Configure the mock to return a specific value
        mock_get_weather.return_value = {
            'temp': 25,
            'condition': 'Sunny',
            'location': 'Test City'
        }
        
        # Create a test article
        article = Article.objects.create(
            title='Weather Report',
            content='Placeholder',
            article_type='weather',
            author_id=1
        )
        
        # Call the function that uses the service
        update_weather_articles()
        
        # Refresh from db and check if it was updated correctly
        article.refresh_from_db()
        self.assertIn('25°C', article.content)
        self.assertIn('Sunny', article.content)
        
        # Verify the mock was called as expected
        mock_get_weather.assert_called_once()`}
                language="python"
                filename="test_mocking.py"
              />
            </TabsContent>
            
            <TabsContent value="factory-boy">
              <p className="mb-2">
                Factory Boy helps create test objects with less code:
              </p>
              <CodeBlock
                code={`# Install factory-boy
pip install factory-boy

# Define factories
import factory
from django.contrib.auth.models import User
from .models import Article, Category

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    
    username = factory.Sequence(lambda n: f'user{n}')
    email = factory.LazyAttribute(lambda obj: f'{obj.username}@example.com')
    password = factory.PostGenerationMethodCall('set_password', 'password')

class CategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Category
    
    name = factory.Sequence(lambda n: f'Category {n}')

class ArticleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Article
    
    title = factory.Sequence(lambda n: f'Article {n}')
    content = factory.Faker('paragraph', nb_sentences=5)
    author = factory.SubFactory(UserFactory)
    category = factory.SubFactory(CategoryFactory)
    is_published = True

# Use in tests
class ArticleAPITest(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
        
        # Create 5 published articles by this user
        self.articles = ArticleFactory.create_batch(5, author=self.user)
        
        # Create 3 unpublished articles
        self.unpublished = ArticleFactory.create_batch(3, is_published=False)
        
    def test_list_own_articles(self):
        url = reverse('article-list')
        response = self.client.get(url, {'author': self.user.id})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 5)`}
                language="python"
                filename="test_with_factories.py"
              />
            </TabsContent>
          </Tabs>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Test Coverage</h3>
          <p className="leading-relaxed">
            Measure your test coverage to ensure your tests are comprehensive:
          </p>

          <CodeBlock
            code={`# Install coverage
pip install coverage

# Run tests with coverage
coverage run --source='.' manage.py test

# Generate report
coverage report

# For a nicer HTML report
coverage html
# Then open htmlcov/index.html in your browser`}
            language="bash"
          />

          <Alert>
            <CheckCircle2 className="h-5 w-5" />
            <AlertTitle>Testing Best Practices</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2">
                <li>Aim for high test coverage, especially on critical paths</li>
                <li>Test both success and failure cases</li>
                <li>Isolate tests from each other (each test should set up its own data)</li>
                <li>Test edge cases and validation rules</li>
                <li>Use descriptive test names that explain the expected behavior</li>
              </ul>
            </AlertDescription>
          </Alert>
        </section>

        <PracticeExercise
          title="API Testing Exercise"
          description="Practice writing tests for a DRF API"
          task="Write tests for a ProductViewSet that verifies list, create, and retrieve operations."
          initialCode={`from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Product

class ProductAPITest(APITestCase):
    def setUp(self):
        # TODO: Create test products
        pass
        
    def test_list_products(self):
        # TODO: Test retrieving the list of products
        pass
        
    def test_create_product(self):
        # TODO: Test creating a new product
        pass
        
    def test_retrieve_product(self):
        # TODO: Test retrieving a single product
        pass`}
          solution={`from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Product

class ProductAPITest(APITestCase):
    def setUp(self):
        # Create test products
        self.product1 = Product.objects.create(
            name='Test Product 1',
            description='First test product',
            price=19.99,
            category='electronics'
        )
        
        self.product2 = Product.objects.create(
            name='Test Product 2',
            description='Second test product',
            price=29.99,
            category='books'
        )
        
        # Define URLs
        self.list_url = reverse('product-list')
        self.detail_url = reverse('product-detail', args=[self.product1.id])
        
    def test_list_products(self):
        # Test retrieving the list of products
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['name'], 'Test Product 1')
        self.assertEqual(response.data[1]['name'], 'Test Product 2')
        
    def test_create_product(self):
        # Test creating a new product
        new_product_data = {
            'name': 'New Product',
            'description': 'A brand new product',
            'price': 39.99,
            'category': 'clothing'
        }
        
        response = self.client.post(self.list_url, new_product_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 3)
        self.assertEqual(Product.objects.last().name, 'New Product')
        self.assertEqual(Product.objects.last().price, 39.99)
        
    def test_retrieve_product(self):
        # Test retrieving a single product
        response = self.client.get(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Product 1')
        self.assertEqual(response.data['price'], '19.99')
        self.assertEqual(response.data['category'], 'electronics')`}
          hints={[
            "In setUp, create a few test Products with different properties",
            "Use reverse() to get the URL for the product list and detail views",
            "For test_list_products, check the response status code and verify the correct products are returned",
            "For test_create_product, prepare a dictionary with product data, then verify it was created correctly",
            "For test_retrieve_product, check that a single product can be retrieved by ID"
          ]}
        />
      </div>
    </DocLayout>
  );
};

export default Testing;
