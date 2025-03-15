
import React from 'react';
import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';
import PracticeExercise from '@/components/PracticeExercise';
import VSCodeSimulator from '@/components/VSCodeSimulator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, ShieldCheck, Lock, Key } from 'lucide-react';

const Authentication = () => {
  return (
    <DocLayout title="Authentication in DRF" description="Learn how to implement user authentication in Django REST Framework">
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-4">Authentication in Django REST Framework</h2>
          <p className="text-lg leading-relaxed mb-4">
            Authentication is the process of verifying the identity of a user or system. Django REST Framework provides
            several authentication schemes out of the box, and makes it easy to implement custom authentication if needed.
          </p>

          <Alert>
            <ShieldCheck className="h-5 w-5" />
            <AlertTitle>Authentication vs. Permission</AlertTitle>
            <AlertDescription>
              Authentication identifies who is making the request, while permissions determine what they are allowed to do.
              These concepts work together but serve different purposes in API security.
            </AlertDescription>
          </Alert>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Authentication Classes</h3>
          <p className="leading-relaxed">
            DRF includes several built-in authentication classes, each suitable for different use cases:
          </p>

          <Tabs defaultValue="basic">
            <TabsList>
              <TabsTrigger value="basic">Basic Authentication</TabsTrigger>
              <TabsTrigger value="session">Session Authentication</TabsTrigger>
              <TabsTrigger value="token">Token Authentication</TabsTrigger>
              <TabsTrigger value="jwt">JWT Authentication</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <div className="border rounded-md p-4 bg-gray-50">
                <h4 className="font-bold mb-2">BasicAuthentication</h4>
                <p className="mb-3">Uses HTTP Basic Authentication, where credentials are sent in the Authorization header.</p>
                <CodeBlock
                  code={`# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.BasicAuthentication',
    ]
}`}
                  language="python"
                  filename="settings.py"
                />
                <p className="mt-3 text-amber-600">
                  <Lock className="inline h-4 w-4 mr-1" />
                  <strong>Warning:</strong> Basic Authentication is only suitable for testing as it sends credentials unencrypted.
                  Always use HTTPS in production.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="session">
              <div className="border rounded-md p-4 bg-gray-50">
                <h4 className="font-bold mb-2">SessionAuthentication</h4>
                <p className="mb-3">Uses Django's session framework, appropriate for AJAX clients that need to authenticate with the same site.</p>
                <CodeBlock
                  code={`# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ]
}`}
                  language="python"
                  filename="settings.py"
                />
                <p className="mt-3">
                  This is particularly useful for browser-based clients and the browsable API.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="token">
              <div className="border rounded-md p-4 bg-gray-50">
                <h4 className="font-bold mb-2">TokenAuthentication</h4>
                <p className="mb-3">Uses token-based authentication where each user gets a unique token.</p>
                <CodeBlock
                  code={`# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ]
}

# Add to INSTALLED_APPS
INSTALLED_APPS = [
    # ...
    'rest_framework.authtoken',
]`}
                  language="python"
                  filename="settings.py"
                />
                <p className="mt-2 mb-3">Create and use tokens:</p>
                <CodeBlock
                  code={`# Generate a token for a user
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User

user = User.objects.get(username='myuser')
token, created = Token.objects.get_or_create(user=user)
print(token.key)

# In client requests:
# Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b`}
                  language="python"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="jwt">
              <div className="border rounded-md p-4 bg-gray-50">
                <h4 className="font-bold mb-2">JWT Authentication</h4>
                <p className="mb-3">JSON Web Tokens are a popular standard for stateless authentication.</p>
                <CodeBlock
                  code={`# Install the package
pip install djangorestframework-simplejwt

# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ]
}

# urls.py
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # ...
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]`}
                  language="python"
                />
                <p className="mt-3">
                  JWTs are stateless, making them suitable for distributed systems and microservices.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">API-level Authentication</h3>
          <p className="leading-relaxed">
            Authentication can be set at different levels in DRF:
          </p>

          <CodeBlock
            code={`# Global setting (settings.py)
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ]
}

# Class-level setting (views.py)
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class ArticleViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

# Method-level setting (views.py)
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def api_example(request):
    # Your code here
    return Response(data)`}
            language="python"
          />
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Custom Authentication</h3>
          <p className="leading-relaxed">
            You can create custom authentication classes by extending <code>BaseAuthentication</code>:
          </p>

          <CodeBlock
            code={`from rest_framework import authentication
from rest_framework import exceptions
from .models import APIKey

class APIKeyAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        api_key = request.META.get('HTTP_X_API_KEY')
        if not api_key:
            return None
            
        try:
            key = APIKey.objects.get(key=api_key, is_active=True)
            return (key.user, None)
        except APIKey.DoesNotExist:
            raise exceptions.AuthenticationFailed('Invalid API key')`}
            language="python"
            filename="authentication.py"
          />

          <p className="leading-relaxed">
            The <code>authenticate</code> method should:
          </p>
          <ul className="list-disc pl-6">
            <li className="mb-2">Return <code>None</code> if authentication is not attempted (allows other authenticators to run)</li>
            <li className="mb-2">Return a tuple of <code>(user, auth)</code> if authentication succeeds</li>
            <li>Raise <code>AuthenticationFailed</code> if authentication fails</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Authentication Flow</h3>
          <div className="border rounded-md p-6 bg-gray-50">
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                Client makes a request with authentication credentials (token, session cookie, etc.)
              </li>
              <li>
                DRF attempts authentication using the configured authentication classes
              </li>
              <li>
                If authentication succeeds, <code>request.user</code> is set to the authenticated user
              </li>
              <li>
                If authentication fails with an exception, the request is denied with a 401 Unauthorized response
              </li>
              <li>
                If no authenticator succeeds, <code>request.user</code> is set to an instance of <code>AnonymousUser</code>
              </li>
              <li>
                Permission checks then determine if the authenticated (or anonymous) user can perform the requested action
              </li>
            </ol>
          </div>
        </section>

        <PracticeExercise
          title="Token Authentication Exercise"
          description="Practice implementing token authentication in a DRF API"
          task="Complete the code to set up token authentication and require authentication for the ArticleViewSet."
          initialCode={`# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        # TODO: Add token authentication class
    ],
}

INSTALLED_APPS = [
    # ...
    # TODO: Add required app for token authentication
]

# views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    # TODO: Add authentication and permission classes
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer`}
          solution={`# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
}

INSTALLED_APPS = [
    # ...
    'rest_framework.authtoken',
]

# views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer`}
          hints={[
            "For TokenAuthentication, you need to add 'rest_framework.authtoken' to INSTALLED_APPS",
            "The authentication class for token authentication is 'rest_framework.authentication.TokenAuthentication'",
            "Use IsAuthenticated permission class to require authentication for all requests"
          ]}
        />
      </div>
    </DocLayout>
  );
};

export default Authentication;
