
import React from 'react';
import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';
import VSCodeSimulator from '@/components/VSCodeSimulator';
import PracticeExercise from '@/components/PracticeExercise';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Rocket, CheckCircle2, AlertCircle } from 'lucide-react';

const Routers = () => {
  return (
    <DocLayout title="Routers & URLs in DRF" description="Learn how to manage API endpoints in Django REST Framework">
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-4">URL Routing in Django REST Framework</h2>
          <p className="text-lg leading-relaxed mb-4">
            DRF provides powerful tools for managing URL patterns and routing HTTP requests to appropriate view functions
            or viewsets. Proper API URL design is crucial for creating intuitive and maintainable APIs.
          </p>

          <Alert>
            <Info className="h-5 w-5" />
            <AlertTitle>Key Concepts</AlertTitle>
            <AlertDescription>
              In DRF, URL routing connects client requests to the corresponding views or viewsets. A well-designed URL 
              structure improves API usability and documentation.
            </AlertDescription>
          </Alert>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">URL Patterns with path()</h3>
          <p className="leading-relaxed">
            Django's URL handling uses path() and re_path() functions to route incoming requests to view functions.
            Here's how to define URL patterns for function-based views:
          </p>

          <CodeBlock
            code={`# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('articles/', views.article_list),
    path('articles/<int:pk>/', views.article_detail),
    path('authors/', views.author_list),
    path('authors/<int:pk>/', views.author_detail),
]`}
            language="python"
            filename="urls.py"
          />

          <p className="leading-relaxed">
            URL patterns can include path converters like <code>&lt;int:pk&gt;</code> to capture and convert URL parts to
            Python types before passing them to views.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">DRF Routers</h3>
          <p className="leading-relaxed">
            DRF includes router classes that automatically generate URL patterns for ViewSets. This simplifies URL configuration
            for resource-oriented APIs.
          </p>

          <Tabs defaultValue="simple">
            <TabsList>
              <TabsTrigger value="simple">SimpleRouter</TabsTrigger>
              <TabsTrigger value="default">DefaultRouter</TabsTrigger>
            </TabsList>
            <TabsContent value="simple">
              <CodeBlock
                code={`# urls.py
from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .viewsets import ArticleViewSet, AuthorViewSet

router = SimpleRouter()
router.register('articles', ArticleViewSet)
router.register('authors', AuthorViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]`}
                language="python"
                filename="urls.py"
              />
              <p className="mt-2 text-sm text-gray-600">
                SimpleRouter automatically creates URL patterns for a standard set of actions 
                (list, create, retrieve, update, partial_update, destroy).
              </p>
            </TabsContent>
            <TabsContent value="default">
              <CodeBlock
                code={`# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import ArticleViewSet, AuthorViewSet

router = DefaultRouter()
router.register('articles', ArticleViewSet)
router.register('authors', AuthorViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]`}
                language="python"
                filename="urls.py"
              />
              <p className="mt-2 text-sm text-gray-600">
                DefaultRouter extends SimpleRouter and adds a default API root view that lists all registered viewsets.
                It's particularly useful for browsable APIs.
              </p>
            </TabsContent>
          </Tabs>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Router URL Patterns</h3>
          <p className="leading-relaxed">
            When using routers with ViewSets, DRF generates the following URL patterns automatically:
          </p>

          <div className="border rounded-md p-4 bg-gray-50">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left font-medium px-2 py-2">URL Pattern</th>
                  <th className="text-left font-medium px-2 py-2">HTTP Method</th>
                  <th className="text-left font-medium px-2 py-2">Action</th>
                  <th className="text-left font-medium px-2 py-2">URL Name</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-t px-2 py-2 font-mono text-sm">{'{prefix}/'}</td>
                  <td className="border-t px-2 py-2">GET</td>
                  <td className="border-t px-2 py-2">list</td>
                  <td className="border-t px-2 py-2 font-mono text-sm">{'{basename}-list'}</td>
                </tr>
                <tr>
                  <td className="border-t px-2 py-2 font-mono text-sm">{'{prefix}/'}</td>
                  <td className="border-t px-2 py-2">POST</td>
                  <td className="border-t px-2 py-2">create</td>
                  <td className="border-t px-2 py-2 font-mono text-sm">{'{basename}-list'}</td>
                </tr>
                <tr>
                  <td className="border-t px-2 py-2 font-mono text-sm">{'{prefix}/{lookup}/'}</td>
                  <td className="border-t px-2 py-2">GET</td>
                  <td className="border-t px-2 py-2">retrieve</td>
                  <td className="border-t px-2 py-2 font-mono text-sm">{'{basename}-detail'}</td>
                </tr>
                <tr>
                  <td className="border-t px-2 py-2 font-mono text-sm">{'{prefix}/{lookup}/'}</td>
                  <td className="border-t px-2 py-2">PUT</td>
                  <td className="border-t px-2 py-2">update</td>
                  <td className="border-t px-2 py-2 font-mono text-sm">{'{basename}-detail'}</td>
                </tr>
                <tr>
                  <td className="border-t px-2 py-2 font-mono text-sm">{'{prefix}/{lookup}/'}</td>
                  <td className="border-t px-2 py-2">PATCH</td>
                  <td className="border-t px-2 py-2">partial_update</td>
                  <td className="border-t px-2 py-2 font-mono text-sm">{'{basename}-detail'}</td>
                </tr>
                <tr>
                  <td className="border-t px-2 py-2 font-mono text-sm">{'{prefix}/{lookup}/'}</td>
                  <td className="border-t px-2 py-2">DELETE</td>
                  <td className="border-t px-2 py-2">destroy</td>
                  <td className="border-t px-2 py-2 font-mono text-sm">{'{basename}-detail'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Custom Actions</h3>
          <p className="leading-relaxed">
            ViewSets can define custom actions using the <code>@action</code> decorator:
          </p>

          <CodeBlock
            code={`from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

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
        featured = self.get_queryset().filter(is_featured=True)
        serializer = self.get_serializer(featured, many=True)
        return Response(serializer.data)`}
            language="python"
            filename="viewsets.py"
          />

          <p className="leading-relaxed">
            The <code>@action</code> decorator creates additional routes:
          </p>
          <ul className="list-disc pl-6">
            <li className="mb-2">
              <code className="font-mono bg-gray-100 px-1">detail=True</code>: Creates a route requiring an ID like <code className="font-mono bg-gray-100 px-1">/articles/{'{pk}'}/publish/</code>
            </li>
            <li>
              <code className="font-mono bg-gray-100 px-1">detail=False</code>: Creates a route at the collection level like <code className="font-mono bg-gray-100 px-1">/articles/featured/</code>
            </li>
          </ul>
        </section>

        <PracticeExercise
          title="URL Routing Exercise"
          description="Practice setting up URL routing for a blog API"
          task="Create a DefaultRouter and register an ArticleViewSet with custom actions for 'featured' and 'archive' endpoints."
          initialCode={`# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import ArticleViewSet

# Create a router and register the ArticleViewSet
# TODO: Your code here

urlpatterns = [
    # Include the router URLs in the 'api/' path
    # TODO: Your code here
]`}
          solution={`# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import ArticleViewSet

# Create a router and register the ArticleViewSet
router = DefaultRouter()
router.register('articles', ArticleViewSet)

urlpatterns = [
    # Include the router URLs in the 'api/' path
    path('api/', include(router.urls)),
]`}
          hints={[
            "First, create a DefaultRouter instance",
            "Use router.register() to register the ArticleViewSet with a prefix",
            "Include the router URLs in the urlpatterns with path('api/', include(router.urls))"
          ]}
        />
      </div>
    </DocLayout>
  );
};

export default Routers;
