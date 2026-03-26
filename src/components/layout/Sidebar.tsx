'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/user-store';
import {
  Home,
  Moon,
  Activity,
  Brain,
  MessageCircle,
  Users,
  Heart,
  Zap,
  Sparkles,
  GraduationCap,
  Globe,
  ExternalLink,
  Settings,
  LogOut,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
  divider?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useUserStore();

  const navSections: NavSection[] = [
    {
      title: 'HEALTH',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: <Home className="w-5 h-5" /> },
        { label: 'Sleep', href: '/sleep', icon: <Moon className="w-5 h-5" /> },
        { label: 'Activity', href: '/activity', icon: <Activity className="w-5 h-5" /> },
        { label: 'Stress', href: '/stress', icon: <Brain className="w-5 h-5" /> },
        { label: 'AI Coach', href: '/coach', icon: <MessageCircle className="w-5 h-5" /> },
        { label: 'Couples', href: '/couples', icon: <Users className="w-5 h-5" /> },
        { label: 'Programs', href: '/programs', icon: <Heart className="w-5 h-5" /> },
        { label: 'Insights', href: '/insights', icon: <Sparkles className="w-5 h-5" /> },
        { label: 'Guardian', href: '/guardian', icon: <Zap className="w-5 h-5" /> },
      ],
    },
    {
      title: 'TOOLS',
      items: [
        { label: 'AI Studio', href: '/ai-studio', icon: <Sparkles className="w-5 h-5" /> },
        { label: 'Prompt Packs', href: '/prompts', icon: <Zap className="w-5 h-5" /> },
        { label: 'Goals', href: '/goals', icon: <Activity className="w-5 h-5" /> },
      ],
    },
    {
      title: 'LEARN & CONNECT',
      items: [
        {
          label: 'Academy',
          href: '/academy',
          icon: <GraduationCap className="w-5 h-5" />,
        },
        {
          label: 'Earth Station',
          href: 'https://www.skool.com/earth-station-by-et-ai-5562',
          icon: <Globe className="w-5 h-5" />,
          external: true,
        },
        {
          label: 'Language Academy',
          href: 'https://et-ai-language-academy.vercel.app',
          icon: <Globe className="w-5 h-5" />,
          external: true,
        },
      ],
    },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className="h-screen w-64 bg-[#1B2A4A] text-white flex flex-col overflow-y-auto">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <Link href="/" className="block">
          <h1 className="text-xl font-bold text-white mb-1">ET AI</h1>
          <p className="text-xs text-gray-400">Bringing AI Down to Earth</p>
        </Link>
      </div>

      {/* Nav Sections */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-8">
          {navSections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item, itemIdx) => {
                  const active = isActive(item.href);
                  const isExternal = item.external;

                  if (isExternal) {
                    return (
                      <li key={itemIdx}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium',
                            'text-gray-300 hover:text-white hover:bg-gray-700'
                          )}
                        >
                          {item.icon}
                          <span className="flex-1">{item.label}</span>
                          <ExternalLink className="w-4 h-4 ml-1 text-gray-500" />
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li key={itemIdx}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium',
                          active
                            ? 'bg-[#F5C842] text-[#1B2A4A]'
                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                        )}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom Section - User & Settings */}
      <div className="border-t border-gray-700 p-4 space-y-2">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium',
            isActive('/settings')
              ? 'bg-[#F5C842] text-[#1B2A4A]'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          )}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>

        {user && (
          <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400 px-2">
            <p className="truncate">{user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}
