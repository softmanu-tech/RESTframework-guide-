
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import { LucideIcon } from 'lucide-react';

interface MenuItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
}

const DocSidebarMenuItem: React.FC<MenuItemProps> = ({ to, icon: Icon, label }) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link to={to}>
          <Icon size={18} />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default DocSidebarMenuItem;
