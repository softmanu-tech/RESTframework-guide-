
import React from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import DocSidebarHeader from './sidebar/SidebarHeader';
import DocSidebarContent from './sidebar/SidebarContent';

const DocSidebar = () => {
  return (
    <Sidebar>
      <DocSidebarHeader />
      <DocSidebarContent />
    </Sidebar>
  );
};

export default DocSidebar;
