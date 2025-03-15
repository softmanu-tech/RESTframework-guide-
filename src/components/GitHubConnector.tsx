
import React, { useState } from 'react';
import { GitBranch, GitFork, GitPullRequest, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GitHubConnectorProps {
  className?: string;
  onRepositoryCreated?: (repoUrl: string) => void;
}

const GitHubConnector: React.FC<GitHubConnectorProps> = ({ 
  className,
  onRepositoryCreated
}) => {
  const [repoName, setRepoName] = useState("drf-tutorial");
  const [repoDescription, setRepoDescription] = useState("My Django REST Framework tutorial project");
  const [isPublic, setIsPublic] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleCreateRepo = () => {
    setIsConnecting(true);
    
    // Simulate API call to GitHub
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      
      const repoUrl = `https://github.com/username/${repoName}`;
      
      toast({
        title: "Repository Created",
        description: `Successfully created ${repoName} on GitHub!`,
      });
      
      if (onRepositoryCreated) {
        onRepositoryCreated(repoUrl);
      }
    }, 1500);
  };

  return (
    <Card className={className}>
      <CardHeader className="bg-gray-50 border-b">
        <div className="flex items-center gap-3">
          <Github className="h-5 w-5" />
          <div>
            <CardTitle className="text-lg">GitHub Integration</CardTitle>
            <CardDescription>Connect your project to GitHub</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-2">
        {!isConnected ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="repo-name">Repository Name</label>
              <Input 
                id="repo-name"
                value={repoName} 
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="my-drf-project" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="repo-desc">Description</label>
              <Input 
                id="repo-desc"
                value={repoDescription} 
                onChange={(e) => setRepoDescription(e.target.value)}
                placeholder="A brief description of your project" 
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">
                <input
                  type="radio"
                  className="mr-2"
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                />
                Public
              </label>
              <label className="text-sm font-medium">
                <input
                  type="radio"
                  className="mr-2"
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
                />
                Private
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-green-50 p-3 rounded-md border border-green-200">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Connected to GitHub</span>
              </div>
              <span className="text-xs text-green-600">https://github.com/username/{repoName}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <GitFork className="h-4 w-4" />
                  <span>Repository</span>
                </div>
                <span className="text-gray-500">{repoName}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <GitPullRequest className="h-4 w-4" />
                  <span>Branch</span>
                </div>
                <span className="text-gray-500">main</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t bg-gray-50">
        {!isConnected ? (
          <Button 
            onClick={handleCreateRepo} 
            className="w-full"
            disabled={!repoName || isConnecting}
          >
            {isConnecting ? "Creating Repository..." : "Create Repository"}
          </Button>
        ) : (
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1">Push Changes</Button>
            <Button variant="outline" className="flex-1">Pull Changes</Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default GitHubConnector;
