
import React from 'react';
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent,
  SidebarMenu 
} from '@/components/ui/sidebar';
import { LucideIcon } from 'lucide-react';
import DocSidebarMenuItem from './SidebarMenuItem';

interface MenuItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

interface MenuGroupProps {
  label: string;
  items: MenuItem[];
}

const DocSidebarMenuGroup: React.FC<MenuGroupProps> = ({ label, items }) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <DocSidebarMenuItem 
              key={item.to} 
              to={item.to} 
              icon={item.icon} 
              label={item.label} 
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default DocSidebarMenuGroup;
