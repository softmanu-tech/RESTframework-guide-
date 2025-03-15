
import React from 'react';
import { SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import { Code } from 'lucide-react';

const DocSidebarHeader = () => {
  return (
    <SidebarHeader className="flex items-center p-4">
      <div className="flex items-center space-x-2">
        <span className="bg-drf-600 text-white p-1 rounded">
          <Code size={20} />
        </span>
        <span className="font-bold text-lg">DRF Guide</span>
      </div>
      <SidebarTrigger className="ml-auto" />
    </SidebarHeader>
  );
};

export default DocSidebarHeader;
