
import React from 'react';
import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Server, Globe, Terminal, RefreshCw } from 'lucide-react';
import PracticeExercise from '@/components/PracticeExercise';

const Integration = () => {
  return (
    <DocLayout>
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-4">Integrating DRF with Next.js</h2>
          <p className="text-lg leading-relaxed mb-4">
            Django REST Framework provides the backend API, but you'll need to connect it with 
            your frontend application. Next.js is a popular React framework that makes it easy 
            to build modern web applications with server-side rendering and API routes.
          </p>

          <Alert>
            <Info className="h-5 w-5" />
            <AlertTitle>Cross-Origin Resource Sharing (CORS)</AlertTitle>
            <AlertDescription>
              When connecting your Next.js frontend to your DRF backend, you'll need to configure CORS 
              to allow cross-origin requests between your frontend and backend domains.
            </AlertDescription>
          </Alert>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Setting Up CORS in Django</h3>
          <p className="leading-relaxed">
            First, you need to configure your Django backend to accept requests from your Next.js application:
          </p>

          <CodeBlock
            code={`# Install django-cors-headers
pip install django-cors-headers

# Add to INSTALLED_APPS in settings.py
INSTALLED_APPS = [
    # ...
    'corsheaders',
    # ...
]

# Add the middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ... other middleware
]

# Configure CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Next.js development server
    "https://yourdomain.com",  # Your production domain
]

# Optional: Allow credentials (cookies, authentication)
CORS_ALLOW_CREDENTIALS = True`}
            language="python"
            filename="settings.py"
          />
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Fetching Data in Next.js</h3>
          <p className="leading-relaxed">
            Next.js provides several ways to fetch data from your DRF API:
          </p>

          <Tabs defaultValue="client">
            <TabsList>
              <TabsTrigger value="client">Client-Side Fetching</TabsTrigger>
              <TabsTrigger value="server">Server-Side Rendering</TabsTrigger>
              <TabsTrigger value="static">Static Generation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="client">
              <CodeBlock
                code={`// Client-side data fetching using React hooks
'use client'
import { useState, useEffect } from 'react'

export default function ArticleList() {
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Fetch data when component mounts
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://your-drf-api.com/api/articles/')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        setArticles(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticles()
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h1>Articles</h1>
      <ul>
        {articles.map(article => (
          <li key={article.id}>{article.title}</li>
        ))}
      </ul>
    </div>
  )
}`}
                language="javascript"
                filename="app/articles/page.js"
              />
            </TabsContent>
            
            <TabsContent value="server">
              <CodeBlock
                code={`// Server-side rendering with Next.js 13+ App Router
import { notFound } from 'next/navigation'

async function getArticles() {
  const res = await fetch('http://your-drf-api.com/api/articles/', {
    cache: 'no-store', // Don't cache data
    // headers: { Authorization: \`Bearer \${token}\` } // If using auth
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch articles')
  }
 
  return res.json()
}

export default async function ArticlesPage() {
  const articles = await getArticles()
  
  if (!articles || articles.length === 0) {
    return <p>No articles found.</p>
  }
  
  return (
    <div>
      <h1>Articles</h1>
      <ul>
        {articles.map(article => (
          <li key={article.id}>{article.title}</li>
        ))}
      </ul>
    </div>
  )
}`}
                language="javascript"
                filename="app/articles/page.js"
              />
            </TabsContent>
            
            <TabsContent value="static">
              <CodeBlock
                code={`// Static Site Generation
// This page will be pre-rendered at build time
export async function generateStaticParams() {
  const res = await fetch('http://your-drf-api.com/api/articles/')
  const articles = await res.json()
  
  return articles.map(article => ({
    id: article.id.toString()
  }))
}

async function getArticle(id) {
  const res = await fetch(\`http://your-drf-api.com/api/articles/\${id}/\`, {
    cache: 'force-cache' // Data will be cached (default)
  })
  
  if (!res.ok) return null
  return res.json()
}

export default async function ArticlePage({ params }) {
  const article = await getArticle(params.id)
  
  if (!article) {
    return <p>Article not found</p>
  }
  
  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
      <span>Author: {article.author}</span>
    </div>
  )
}`}
                language="javascript"
                filename="app/articles/[id]/page.js"
              />
            </TabsContent>
          </Tabs>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">Authentication with Next.js</h3>
          <p className="leading-relaxed">
            If your DRF API uses token authentication, you'll need to handle authentication in your Next.js app:
          </p>

          <CodeBlock
            code={`// Create a custom hook for authentication
'use client'
import { useState, useEffect, createContext, useContext } from 'react'

// Auth context
const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if we have a token in localStorage
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      fetchUserData(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  // Fetch user data from DRF
  const fetchUserData = async (authToken) => {
    try {
      const response = await fetch('http://your-drf-api.com/api/auth/user/', {
        headers: {
          'Authorization': \`Token \${authToken}\`
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        // Token is invalid
        logout()
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Login function
  const login = async (username, password) => {
    try {
      const response = await fetch('http://your-drf-api.com/api/auth/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
      
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.token)
        setToken(data.token)
        await fetchUserData(data.token)
        return { success: true }
      } else {
        const errorData = await response.json()
        return { success: false, error: errorData.detail || 'Login failed' }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext)
}`}
            language="javascript"
            filename="lib/auth.js"
          />

          <p className="mt-4">You can then use this hook in your components:</p>
          
          <CodeBlock
            code={`'use client'
import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    const result = await login(username, password)
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error)
    }
  }

  return (
    <div>
      <h1>Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}`}
            language="javascript"
            filename="app/login/page.js"
          />
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold">API Services Pattern</h3>
          <p className="leading-relaxed">
            For larger applications, it's helpful to organize your API calls in service files:
          </p>

          <CodeBlock
            code={`// lib/api-service.js
class ApiService {
  constructor(baseUrl, tokenGetter) {
    this.baseUrl = baseUrl
    this.getToken = tokenGetter
  }

  async request(endpoint, options = {}) {
    const url = \`\${this.baseUrl}/\${endpoint}\`
    const token = this.getToken()
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }
    
    if (token) {
      headers['Authorization'] = \`Token \${token}\`
    }
    
    const config = {
      ...options,
      headers,
    }
    
    try {
      const response = await fetch(url, config)
      
      if (response.ok) {
        if (response.status === 204) return null // No content
        return await response.json()
      }
      
      const error = await response.json()
      return Promise.reject(error)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  
  // API endpoints
  getArticles() {
    return this.request('articles/')
  }
  
  getArticle(id) {
    return this.request(\`articles/\${id}/\`)
  }
  
  createArticle(data) {
    return this.request('articles/', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
  
  updateArticle(id, data) {
    return this.request(\`articles/\${id}/\`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }
  
  deleteArticle(id) {
    return this.request(\`articles/\${id}/\`, {
      method: 'DELETE'
    })
  }
}

// Create and export an instance with your DRF API URL
export const apiService = new ApiService(
  'http://your-drf-api.com/api',
  () => localStorage.getItem('token')
)

export default apiService`}
            language="javascript"
            filename="lib/api-service.js"
          />

          <p className="mt-4">Then use your API service in components:</p>
          
          <CodeBlock
            code={`'use client'
import { useState, useEffect } from 'react'
import apiService from '@/lib/api-service'

export default function ArticleList() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await apiService.getArticles()
        setArticles(data)
      } catch (err) {
        setError(err.message || 'Failed to load articles')
      } finally {
        setLoading(false)
      }
    }

    loadArticles()
  }, [])

  const deleteArticle = async (id) => {
    try {
      await apiService.deleteArticle(id)
      setArticles(articles.filter(article => article.id !== id))
    } catch (err) {
      console.error('Error deleting article:', err)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Articles</h1>
      <ul>
        {articles.map(article => (
          <li key={article.id}>
            {article.title}
            <button onClick={() => deleteArticle(article.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}`}
            language="javascript"
            filename="app/articles/page.js"
          />
        </section>

        <PracticeExercise
          title="Next.js Integration Exercise"
          description="Practice integrating a DRF API with Next.js"
          task="Create a function to fetch data from a DRF API and handle authentication in Next.js"
          initialCode={`// Create a function to fetch articles that includes authentication
// and error handling

export async function fetchArticles() {
  // TODO: Implement the function to fetch articles from the DRF API
  // The function should:
  // 1. Get the auth token from localStorage
  // 2. Make a fetch request to the API with proper headers
  // 3. Handle errors appropriately
  // 4. Return the articles data
}`}
          solution={`export async function fetchArticles() {
  // Get auth token from localStorage
  const token = localStorage.getItem('token');
  
  try {
    // Make fetch request with auth header if token exists
    const response = await fetch('https://your-drf-api.com/api/articles/', {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': \`Token \${token}\` } : {})
      }
    });
    
    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || \`Error: \${response.status}\`);
    }
    
    // Parse and return JSON data
    const articles = await response.json();
    return articles;
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    throw error; // Re-throw to let the component handle it
  }
}`}
          hints={[
            "Remember to check if a token exists in localStorage before adding the Authorization header",
            "Use try/catch blocks to handle fetch errors",
            "Check response.ok to handle HTTP error responses",
            "Parse the response body with response.json()"
          ]}
        />
      </div>
    </DocLayout>
  );
};

export default Integration;
