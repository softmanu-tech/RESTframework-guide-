
import React, { useState } from 'react';
import DocSidebar from './DocSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface DocLayoutProps {
  children: React.ReactNode;
}

const DocLayout: React.FC<DocLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DocSidebar />
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "ml-64" : "ml-0"
        )}>
          <div className="container py-8 px-4 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DocLayout;
