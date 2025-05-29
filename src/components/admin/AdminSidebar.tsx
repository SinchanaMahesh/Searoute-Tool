
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter 
} from '@/components/ui/sidebar';
import { 
  Route, 
  Ship, 
  BedDouble, 
  Settings, 
  Users, 
  MapPin, 
  Calendar,
  DollarSign,
  FileText,
  Shield
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

const navigationItems = [
  {
    title: "Route Management",
    items: [
      {
        title: "Sea Route Map",
        url: "/configuration/searoutemap",
        icon: Route,
      },
      {
        title: "Port Configuration",
        url: "/configuration/ports",
        icon: MapPin,
      },
    ],
  },
  {
    title: "Ship Management",
    items: [
      {
        title: "Ship Configuration",
        url: "/configuration/ships",
        icon: Ship,
      },
      {
        title: "Cabin Configuration",
        url: "/configuration/cabins",
        icon: BedDouble,
      },
      {
        title: "Deck Plans",
        url: "/configuration/decks",
        icon: FileText,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Schedule Management",
        url: "/configuration/schedules",
        icon: Calendar,
      },
      {
        title: "Pricing Configuration",
        url: "/configuration/pricing",
        icon: DollarSign,
      },
      {
        title: "Staff Management",
        url: "/configuration/staff",
        icon: Users,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "General Settings",
        url: "/configuration/settings",
        icon: Settings,
      },
      {
        title: "User Permissions",
        url: "/configuration/permissions",
        icon: Shield,
      },
    ],
  },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-charcoal">Ship Admin</h2>
          <p className="text-sm text-slate-gray">Configuration Panel</p>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.url}
                    >
                      <a href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarFooter className="border-t">
        <div className="p-4 text-xs text-slate-gray">
          <p>Ship Configuration v1.0</p>
          <p>Admin Panel</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
