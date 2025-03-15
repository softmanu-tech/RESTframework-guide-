
import React from 'react';
import { SidebarContent } from '@/components/ui/sidebar';
import { 
  Home, 
  BookOpen, 
  Code, 
  Server, 
  Database, 
  Lock, 
  Users, 
  FileText, 
  Award,
  Zap,
  Table,
  Globe
} from 'lucide-react';
import DocSidebarMenuGroup from './SidebarMenuGroup';

const DocSidebarContent = () => {
  const gettingStartedItems = [
    {
      to: "/",
      icon: Home,
      label: "Home"
    },
    {
      to: "/introduction",
      icon: BookOpen,
      label: "Introduction"
    },
    {
      to: "/installation",
      icon: Server,
      label: "Installation & Setup"
    },
    {
      to: "/models",
      icon: Table,
      label: "Models"
    }
  ];

  const coreConceptsItems = [
    {
      to: "/serializers",
      icon: FileText,
      label: "Serializers"
    },
    {
      to: "/views",
      icon: BookOpen,
      label: "Views"
    },
    {
      to: "/routers",
      icon: Code,
      label: "Routers & URLs"
    },
    {
      to: "/authentication",
      icon: Lock,
      label: "Authentication"
    },
    {
      to: "/permissions",
      icon: Users,
      label: "Permissions"
    }
  ];

  const advancedTopicsItems = [
    {
      to: "/viewsets",
      icon: Zap,
      label: "ViewSets & Generics"
    },
    {
      to: "/filtering",
      icon: Database,
      label: "Filtering & Pagination"
    },
    {
      to: "/testing",
      icon: Award,
      label: "Testing"
    },
    {
      to: "/integration",
      icon: Globe,
      label: "Frontend Integration"
    }
  ];

  const resourcesItems = [
    {
      to: "/practice",
      icon: Code,
      label: "Practice Exercises"
    },
    {
      to: "/interview",
      icon: Award,
      label: "Interview Questions"
    }
  ];

  return (
    <SidebarContent>
      <DocSidebarMenuGroup label="Getting Started" items={gettingStartedItems} />
      <DocSidebarMenuGroup label="Core Concepts" items={coreConceptsItems} />
      <DocSidebarMenuGroup label="Advanced Topics" items={advancedTopicsItems} />
      <DocSidebarMenuGroup label="Resources" items={resourcesItems} />
    </SidebarContent>
  );
};

export default DocSidebarContent;
