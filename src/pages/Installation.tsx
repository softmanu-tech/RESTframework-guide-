
import React, { useState, useEffect, useRef } from 'react';
import DocLayout from '@/components/DocLayout';
import ProgressTracker from '@/components/ProgressTracker';
import CodeBlock from '@/components/CodeBlock';
import VSCodeSimulator from '@/components/VSCodeSimulator';
import TerminalSimulator from '@/components/TerminalSimulator';
import GitHubConnector from '@/components/GitHubConnector';
import InstallationChecker, { InstallationCheckerHandle } from '@/components/InstallationChecker';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Check, Terminal, FileCode, Package, ExternalLink } from 'lucide-react';
import { useProgress } from '@/context/ProgressContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';

const Installation = () => {
  const { markCompleted } = useProgress();
  const [activeTab, setActiveTab] = useState("guide");
  const installationCheckerRef = useRef<InstallationCheckerHandle>(null);
  
  useEffect(() => {
    // Mark this section as viewed/completed
    markCompleted("installation");
  }, [markCompleted]);

  const handleCommandExecuted = (command: string) => {
    // Track terminal commands and update installation progress
    if (command.includes("python -m venv") || command.includes("virtualenv")) {
      if (installationCheckerRef.current) {
        installationCheckerRef.current.completeStep('virtualenv');
      }
    } else if (command.includes("pip install django")) {
      if (installationCheckerRef.current) {
        installationCheckerRef.current.completeStep('django');
      }
    } else if (command.includes("pip install djangorestframework")) {
      if (installationCheckerRef.current) {
        installationCheckerRef.current.completeStep('drf');
      }
    } else if (command.includes("django-admin startproject")) {
      if (installationCheckerRef.current) {
        installationCheckerRef.current.completeStep('project');
      }
    } else if (command.includes("python manage.py startapp")) {
      if (installationCheckerRef.current) {
        installationCheckerRef.current.completeStep('app');
      }
    } else if (command.includes("python manage.py migrate")) {
      if (installationCheckerRef.current) {
        installationCheckerRef.current.completeStep('migrate');
      }
    } else if (command.includes("git init") || command.includes("git remote add")) {
      if (installationCheckerRef.current) {
        installationCheckerRef.current.completeStep('github');
      }
    }
  };

  const handleRepoCreated = () => {
    if (installationCheckerRef.current) {
      installationCheckerRef.current.completeStep('github');
    }
  };

  const handleSettingsEdited = () => {
    if (installationCheckerRef.current) {
      installationCheckerRef.current.completeStep('settings');
    }
  };

  const initialDjangoSettings = `# drf_tutorial/settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    
    # Local apps
    'api',
]

# Django REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}`;

  return (
    <DocLayout>
      <ProgressTracker currentSection="Installation & Setup" />

      <h1>Installation & Setup</h1>
      
      <p>
        Getting started with Django REST Framework is straightforward, especially if you're already familiar with Django. 
        In this section, we'll guide you through the installation process and initial setup.
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="my-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="guide">Step-by-Step Guide</TabsTrigger>
          <TabsTrigger value="interactive">Interactive Setup</TabsTrigger>
          <TabsTrigger value="vscode">VS Code Integration</TabsTrigger>
        </TabsList>
        
        {/* Traditional Step-by-Step Guide */}
        <TabsContent value="guide" className="mt-6">
          <h2>Prerequisites</h2>
          
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-6">
            <h3 className="text-amber-800 font-medium mb-2">Before you begin</h3>
            <p className="text-amber-700">
              Make sure you have the following installed:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-amber-700">
              <li>Python (3.6 or higher)</li>
              <li>pip (Python package manager)</li>
              <li>virtualenv (recommended for creating isolated Python environments)</li>
            </ul>
          </div>

          <h2>Step 1: Set Up a Virtual Environment</h2>
          
          <p>
            It's always a good practice to create a virtual environment for your Django projects. This keeps dependencies required by different projects separate.
          </p>

          <CodeBlock 
            code={`# Create a new virtual environment
python -m venv drf_env

# Activate the virtual environment
# On Windows
drf_env\\Scripts\\activate

# On macOS/Linux
source drf_env/bin/activate`}
            language="bash"
          />

          <div className="flex items-center gap-2 text-green-600 my-4">
            <Check className="h-5 w-5" />
            <p className="font-medium">Your terminal should now show the virtual environment name.</p>
          </div>

          <h2>Step 2: Install Django</h2>
          
          <p>
            Now that you have your virtual environment set up, let's install Django.
          </p>

          <CodeBlock 
            code={`pip install django`}
            language="bash"
          />

          <h2>Step 3: Install Django REST Framework</h2>
          
          <p>
            With Django installed, we can now install Django REST Framework.
          </p>

          <CodeBlock 
            code={`pip install djangorestframework`}
            language="bash"
          />

          <p className="my-4">
            You might also want to install the following packages for additional features:
          </p>

          <CodeBlock 
            code={`# For browsable API renderer support
pip install markdown

# For filtering backend
pip install django-filter`}
            language="bash"
          />

          <h2>Step 4: Create a New Django Project</h2>
          
          <CodeBlock 
            code={`django-admin startproject drf_tutorial`}
            language="bash"
          />

          <p className="my-4">
            This creates a new Django project named "drf_tutorial". Navigate to the project directory:
          </p>

          <CodeBlock 
            code={`cd drf_tutorial`}
            language="bash"
          />

          <h2>Step 5: Create a New Django App</h2>
          
          <p>
            Now let's create a Django app within our project where we'll implement our API.
          </p>

          <CodeBlock 
            code={`python manage.py startapp api`}
            language="bash"
          />

          <h2>Step 6: Configure Django REST Framework</h2>
          
          <p>
            Open your project's settings file (drf_tutorial/settings.py) and add Django REST Framework to your installed apps:
          </p>

          <CodeBlock 
            code={`# drf_tutorial/settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    
    # Local apps
    'api',
]

# Django REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}`}
            language="python"
            filename="drf_tutorial/settings.py"
          />

          <h2>Step 7: Run Migrations</h2>
          
          <p>
            Before you can use your Django project, you need to create the database tables:
          </p>

          <CodeBlock 
            code={`python manage.py migrate`}
            language="bash"
          />

          <h2>Step 8: Create a Superuser (Optional)</h2>
          
          <p>
            Creating a superuser allows you to access the Django admin interface:
          </p>

          <CodeBlock 
            code={`python manage.py createsuperuser`}
            language="bash"
          />
          
          <p className="text-gray-600 mt-1">
            Follow the prompts to create a username, email, and password.
          </p>

          <h2>Step 9: Test Your Installation</h2>
          
          <p>
            Start the development server to ensure everything is working properly:
          </p>

          <CodeBlock 
            code={`python manage.py runserver`}
            language="bash"
          />
          
          <p className="text-gray-600 mt-2">
            Visit <code>http://127.0.0.1:8000/</code> in your browser. You should see the Django welcome page.
          </p>

          <h2>Troubleshooting</h2>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 my-6">
            <h3 className="text-lg font-medium mb-3">Common Issues</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">ModuleNotFoundError: No module named 'rest_framework'</h4>
                <p className="text-gray-700">
                  Make sure you've installed Django REST Framework and added it to your INSTALLED_APPS in settings.py.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Database Migration Issues</h4>
                <p className="text-gray-700">
                  If you're having trouble with migrations, try resetting your migrations:
                </p>
                <CodeBlock 
                  code={`python manage.py migrate --run-syncdb`}
                  language="bash"
                />
              </div>
              
              <div>
                <h4 className="font-medium">Permission Denied Errors</h4>
                <p className="text-gray-700">
                  If you're getting permission errors, check your REST_FRAMEWORK settings in settings.py. You might want to temporarily set the default permission class to AllowAny during development:
                </p>
                <CodeBlock 
                  code={`REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    # Other settings...
}`}
                  language="python"
                />
              </div>
            </div>
          </div>

          <h2>Requirements File</h2>
          
          <p>
            It's a good practice to create a requirements.txt file to keep track of your project dependencies:
          </p>

          <CodeBlock 
            code={`pip freeze > requirements.txt`}
            language="bash"
          />
          
          <p className="text-gray-600 mt-2">
            This will create a file with all your installed packages. To install from this file in another environment:
          </p>

          <CodeBlock 
            code={`pip install -r requirements.txt`}
            language="bash"
          />
        </TabsContent>
        
        {/* Interactive Terminal Setup */}
        <TabsContent value="interactive" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3">
              <h2 className="text-xl font-bold mb-4">Interactive Installation</h2>
              <p className="mb-4">
                Use this interactive terminal to practice the installation commands for Django REST Framework. 
                Your progress will be tracked automatically as you complete each step.
              </p>
              
              <Card className="bg-gray-50 p-4 mb-6">
                <h3 className="font-medium text-base mb-2">Try these commands:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <code className="bg-gray-200 px-2 py-1 rounded text-xs">python -m venv drf_env</code>
                    <span className="text-gray-500">Create virtual environment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <code className="bg-gray-200 px-2 py-1 rounded text-xs">pip install django</code>
                    <span className="text-gray-500">Install Django</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <code className="bg-gray-200 px-2 py-1 rounded text-xs">pip install djangorestframework</code>
                    <span className="text-gray-500">Install DRF</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <code className="bg-gray-200 px-2 py-1 rounded text-xs">django-admin startproject drf_tutorial</code>
                    <span className="text-gray-500">Create project</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <code className="bg-gray-200 px-2 py-1 rounded text-xs">python manage.py startapp api</code>
                    <span className="text-gray-500">Create app</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <code className="bg-gray-200 px-2 py-1 rounded text-xs">python manage.py migrate</code>
                    <span className="text-gray-500">Run migrations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <code className="bg-gray-200 px-2 py-1 rounded text-xs">python manage.py runserver</code>
                    <span className="text-gray-500">Start development server</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <code className="bg-gray-200 px-2 py-1 rounded text-xs">help</code>
                    <span className="text-gray-500">Show all available commands</span>
                  </li>
                </ul>
              </Card>
              
              <div className="border rounded-md overflow-hidden shadow-md">
                <div className="bg-gray-800 text-white px-4 py-2 text-sm font-medium flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  <span>Terminal</span>
                </div>
                <TerminalSimulator 
                  className="h-[300px]" 
                  initialCommands={[
                    { command: "", output: "Welcome to the Django REST Framework interactive terminal.\nType 'help' to see available commands." }
                  ]}
                  onCommandExecuted={handleCommandExecuted}
                />
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Edit settings.py</h3>
                <p className="mb-3 text-sm">
                  After creating your project and app, you need to modify your project's settings.py file to include Django REST Framework.
                </p>
                <CodeBlock 
                  code={initialDjangoSettings}
                  language="python"
                  filename="drf_tutorial/settings.py"
                  className="max-h-[250px] overflow-auto"
                  onCodeChange={() => handleSettingsEdited()}
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <InstallationChecker 
                className="sticky top-4"
                ref={installationCheckerRef}
              />
              
              <div className="mt-6">
                <GitHubConnector 
                  onRepositoryCreated={handleRepoCreated}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* VS Code Integration */}
        <TabsContent value="vscode" className="mt-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">VS Code Integration</h2>
            <p>
              Experience how you can set up your Django REST Framework project using VS Code, 
              one of the most popular code editors for Python and Django development.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
              <h3 className="text-blue-800 font-medium mb-2">VS Code Extensions</h3>
              <p className="text-blue-700 mb-2">
                For the best Django REST Framework development experience, we recommend these VS Code extensions:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-blue-700">
                <li>Python (Microsoft)</li>
                <li>Django Template (Baptiste Darthenay)</li>
                <li>REST Client (Huachao Mao)</li>
                <li>Prettier (Prettier)</li>
              </ul>
            </div>
          </div>
          
          <VSCodeSimulator 
            initialFiles={[
              { 
                name: "settings.py", 
                content: initialDjangoSettings,
                language: "python" 
              },
              {
                name: "models.py",
                content: "from django.db import models\n\n# Create your models here",
                language: "python"
              },
              {
                name: "serializers.py",
                content: "from rest_framework import serializers\n\n# Create your serializers here",
                language: "python"
              }
            ]}
            className="mb-6"
          />
          
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold mb-3">Debugging Django REST Framework</h3>
              <p className="text-sm mb-4">
                VS Code provides excellent debugging capabilities for Django. Here's how to set up a launch.json file for debugging your DRF project:
              </p>
              <CodeBlock 
                code={`{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Django",
      "type": "python",
      "request": "launch",
      "program": "\${workspaceFolder}/manage.py",
      "args": [
        "runserver"
      ],
      "django": true,
      "justMyCode": true
    }
  ]
}`}
                language="json"
                filename=".vscode/launch.json"
              />
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-3">VS Code Settings for Django</h3>
              <p className="text-sm mb-4">
                Optimize your VS Code environment for Django development with these workspace settings:
              </p>
              <CodeBlock 
                code={`{
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.linting.pylintArgs": [
    "--load-plugins=pylint_django",
    "--django-settings-module=drf_tutorial.settings"
  ],
  "editor.formatOnSave": true,
  "python.formatting.provider": "black",
  "files.exclude": {
    "**/__pycache__": true,
    "**/*.pyc": true
  }
}`}
                language="json"
                filename=".vscode/settings.json"
              />
            </div>
          </div>
          
          <Separator className="my-8" />
          
          <div>
            <h3 className="text-lg font-bold mb-4">Additional VS Code Resources</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <a 
                href="https://code.visualstudio.com/docs/python/python-tutorial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileCode className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium">Python in VS Code</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">Learn how to use VS Code for Python development</p>
                <div className="flex items-center text-xs text-blue-600 mt-auto">
                  <span>View guide</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </div>
              </a>
              
              <a 
                href="https://code.visualstudio.com/docs/python/tutorial-django" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileCode className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium">Django in VS Code</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">Learn how to work with Django projects in VS Code</p>
                <div className="flex items-center text-xs text-blue-600 mt-auto">
                  <span>View guide</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </div>
              </a>
              
              <a 
                href="https://code.visualstudio.com/docs/python/debugging" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileCode className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium">Debugging Python</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">Learn how to debug Python applications in VS Code</p>
                <div className="flex items-center text-xs text-blue-600 mt-auto">
                  <span>View guide</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </div>
              </a>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8 mt-10">
        <h3 className="text-lg font-medium mb-3">Ready to Continue?</h3>
        <p className="mb-4">
          Now that you have successfully installed and configured Django REST Framework, let's move on to creating our first serializer.
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

export default Installation;
