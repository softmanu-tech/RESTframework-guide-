
import React from 'react';
import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';
import PracticeExercise from '@/components/PracticeExercise';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert, ShieldCheck, User, Users } from 'lucide-react';

const Permissions = () => {
  return (
    <DocLayout title="Permissions in DRF" description="Learn how to implement permissions in Django REST Framework">
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-4">Permissions in Django REST Framework</h2>
          <p className="text-lg leading-relaxed mb-4">
            Permissions determine whether a request should be granted or denied access to an API endpoint.
            DRF provides a flexible system for defining permissions at multiple levels, from global settings
            to per-view or even per-object restrictions.
          </p>

          <Alert>
            <ShieldAlert className="h-5 w-5" />
            <AlertTitle>Authentication vs. Permissions</AlertTitle>
            <AlertDescription>
              While authentication identifies who is making the request, permissions determine what they
              are allowed to do. Authentication happens before permission checks.
            </AlertDescription>
          </Alert>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Built-in Permission Classes</h3>
          <p className="leading-relaxed">
            DRF includes several permission classes out of the box:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="font-bold flex items-center">
                <ShieldCheck className="h-4 w-4 mr-2 text-green-600" />
                AllowAny
              </h4>
              <p className="text-sm mt-1">
                Allows unrestricted access, regardless of authentication status.
              </p>
              <CodeBlock
                code={`permission_classes = [AllowAny]`}
                language="python"
              />
            </div>
            
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="font-bold flex items-center">
                <User className="h-4 w-4 mr-2 text-blue-600" />
                IsAuthenticated
              </h4>
              <p className="text-sm mt-1">
                Allows access only to authenticated users.
              </p>
              <CodeBlock
                code={`permission_classes = [IsAuthenticated]`}
                language="python"
              />
            </div>
            
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="font-bold flex items-center">
                <Users className="h-4 w-4 mr-2 text-amber-600" />
                IsAuthenticatedOrReadOnly
              </h4>
              <p className="text-sm mt-1">
                Allows read-only access to unauthenticated users, and full access to authenticated users.
              </p>
              <CodeBlock
                code={`permission_classes = [IsAuthenticatedOrReadOnly]`}
                language="python"
              />
            </div>
            
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="font-bold flex items-center">
                <ShieldAlert className="h-4 w-4 mr-2 text-purple-600" />
                DjangoModelPermissions
              </h4>
              <p className="text-sm mt-1">
                Ties into Django's standard model permissions system.
              </p>
              <CodeBlock
                code={`permission_classes = [DjangoModelPermissions]`}
                language="python"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Setting Permissions</h3>
          <p className="leading-relaxed">
            Permissions can be set at different levels:
          </p>

          <Tabs defaultValue="global">
            <TabsList>
              <TabsTrigger value="global">Global</TabsTrigger>
              <TabsTrigger value="class">Class-Based Views</TabsTrigger>
              <TabsTrigger value="function">Function-Based Views</TabsTrigger>
            </TabsList>
            
            <TabsContent value="global">
              <CodeBlock
                code={`# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}`}
                language="python"
                filename="settings.py"
              />
              <p className="mt-2 text-sm text-gray-600">
                Global permission classes are applied to all views unless overridden at the view level.
              </p>
            </TabsContent>
            
            <TabsContent value="class">
              <CodeBlock
                code={`from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer`}
                language="python"
                filename="views.py"
              />
              <p className="mt-2 text-sm text-gray-600">
                Class-level permission settings override global settings.
              </p>
            </TabsContent>
            
            <TabsContent value="function">
              <CodeBlock
                code={`from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def example_view(request):
    content = {'message': 'Hello, World!'}
    return Response(content)`}
                language="python"
                filename="views.py"
              />
              <p className="mt-2 text-sm text-gray-600">
                Function-level permission settings using decorators.
              </p>
            </TabsContent>
          </Tabs>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Custom Permissions</h3>
          <p className="leading-relaxed">
            You can create custom permission classes by subclassing <code>BasePermission</code>:
          </p>

          <CodeBlock
            code={`from rest_framework import permissions

class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow authors of an object to edit it.
    """
    
    def has_permission(self, request, view):
        # Allow GET, HEAD or OPTIONS requests
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Write permissions are only allowed to authenticated users
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Write permissions are only allowed to the author
        return obj.author == request.user`}
            language="python"
            filename="permissions.py"
          />

          <p className="leading-relaxed">
            The permission class implements two methods:
          </p>
          <ul className="list-disc pl-6">
            <li className="mb-2">
              <code>has_permission()</code>: Determines if the request should be granted access to the view.
            </li>
            <li>
              <code>has_object_permission()</code>: Determines if the request should be granted access to a specific object.
            </li>
          </ul>
          
          <Alert>
            <ShieldCheck className="h-5 w-5" />
            <AlertTitle>Important Note</AlertTitle>
            <AlertDescription>
              <code>has_object_permission()</code> is only called when you explicitly call <code>self.check_object_permissions(request, obj)</code> 
              or when the view inherits from <code>RetrieveModelMixin</code>, <code>UpdateModelMixin</code>, or <code>DestroyModelMixin</code>.
            </AlertDescription>
          </Alert>
        </section>
        
        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Using Custom Permissions</h3>
          <CodeBlock
            code={`from rest_framework import viewsets
from .models import Article
from .serializers import ArticleSerializer
from .permissions import IsAuthorOrReadOnly

class ArticleViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthorOrReadOnly]
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer`}
            language="python"
            filename="views.py"
          />
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Combining Permissions</h3>
          <p className="leading-relaxed">
            You can combine multiple permission classes:
          </p>

          <CodeBlock
            code={`from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from .models import Article
from .serializers import ArticleSerializer
from .permissions import IsAuthorOrReadOnly

class ArticleViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, DjangoModelPermissions, IsAuthorOrReadOnly]
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer`}
            language="python"
            filename="views.py"
          />

          <p className="leading-relaxed">
            With multiple permissions, <strong>all</strong> permission classes must return <code>True</code> for the request to be granted.
            If any permission class returns <code>False</code>, access will be denied.
          </p>
        </section>

        <PracticeExercise
          title="Custom Permission Exercise"
          description="Create a custom permission class to restrict API access based on user status"
          task="Create a permission class that only allows staff members to create and modify posts, while allowing all authenticated users to view them."
          initialCode={`from rest_framework import permissions

class StaffEditPermission(permissions.BasePermission):
    """
    Custom permission to only allow staff members to edit objects.
    """
    
    def has_permission(self, request, view):
        # TODO: Implement permission logic
        pass
        
    def has_object_permission(self, request, view, obj):
        # TODO: Implement object permission logic
        pass`}
          solution={`from rest_framework import permissions

class StaffEditPermission(permissions.BasePermission):
    """
    Custom permission to only allow staff members to edit objects.
    """
    
    def has_permission(self, request, view):
        # Read permissions are allowed to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
            
        # Write permissions are only allowed to staff users
        return request.user and request.user.is_staff
        
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
            
        # Write permissions are only allowed to staff users
        return request.user and request.user.is_staff`}
          hints={[
            "Use permissions.SAFE_METHODS to check if the request is a read operation (GET, HEAD, OPTIONS)",
            "For read operations, check if the user is authenticated",
            "For write operations, check if the user is a staff member using request.user.is_staff"
          ]}
        />
      </div>
    </DocLayout>
  );
};

export default Permissions;
