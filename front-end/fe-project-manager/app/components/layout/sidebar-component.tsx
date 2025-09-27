import type { Workspace } from '@/types';
import { useAuth } from '@/provider/auth-context';
import { useState } from 'react';
import {
  Banknote,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  ListCheck,
  LogOut,
  Settings,
  Users,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router';
import { Button } from '../ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import SidebarNav from './sidebar-nav';

const SidebarComponent = ({ currentWorkspace }: { currentWorkspace: Workspace | null }) => {
  const { user, logout } = useAuth();
  const [isCollapse, setIsCollapse] = useState(false);

  const navItem = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Workspaces',
      href: '/workspaces',
      icon: Users,
    },
    {
      title: 'My task',
      href: '/my-tasks',
      icon: ListCheck,
    },
    {
      title: 'Members',
      href: '/members',
      icon: Users,
    },
    {
      title: 'Archived',
      href: '/archived',
      icon: CheckCircle2,
    },
    {
      title: 'License',
      href: '/license',
      icon: Banknote,
    },
  ];
  return (
    <div
      className={cn(
        'flex flex-col border-r bg-sidebar transition-all duration-300',
        isCollapse ? 'w-16 md:w-[80px]' : 'w-16 md:w-[240px]'
      )}
    >
      <div className={'flex h-14 items-center border-b px-4 mb-4'}>
        <Link to={'/dashboard'} className={'flex items-center'}>
          {!isCollapse && (
            <div className={'flex items-center gap-2'}>
              <Wrench className={'size-6 text-blue-600'} />
              <span className={'font-semibold text-lg hidden md:block'}>PrM</span>
            </div>
          )}
          {isCollapse && <Wrench className={'size-6 text-blue-600'} />}
        </Link>

        <Button
          variant={'ghost'}
          className={'ml-auto hidden hover:cursor-pointer md:block'}
          onClick={() => setIsCollapse(!isCollapse)}
        >
          {isCollapse ? (
            <ChevronsRight className={'size-4'} />
          ) : (
            <ChevronsLeft className={'size-4'} />
          )}
        </Button>
      </div>

      <ScrollArea className={'flex-1 px-3 py-2'}>
        <SidebarNav
          items={navItem}
          currentWorkspace={currentWorkspace}
          isCollapse={isCollapse}
          className={cn(isCollapse && 'items-center space-y-2')}
        />
      </ScrollArea>

      <div className={'w-full lg:w-[80px]'}>
        <Button
          variant={'ghost'}
          size={isCollapse ? 'icon' : 'default'}
          onClick={logout}
          className={'hover:cursor-pointer'}
        >
          <LogOut className={cn(isCollapse && 'mr-2')} />
          <span className={'hidden md:block'}>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default SidebarComponent;
