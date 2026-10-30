import React from 'react';
import { 
  BookOpen, Sparkles, UtensilsCrossed, Megaphone, 
  BarChart3, Settings, ShieldAlert, FileText, Compass
} from 'lucide-react';
import { UserRole } from '../../types';

export type MainTabType = 
  | 'overview' 
  | 'policy' 
  | 'guide' 
  | 'food_voice' 
  | 'banquet' 
  | 'whistle' 
  | 'audit_center'
  | 'dashboard_screen' 
  | 'settings';

interface NavigationProps {
  currentTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  userRole: UserRole;
  pendingAuditCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  userRole,
  pendingAuditCount
}) => {
  const isGovRole = userRole === 'town_admin' || userRole === 'district_admin';

  const tabs: { id: MainTabType; label: string; icon: any; badge?: number; govOnly?: boolean; publicOnly?: boolean }[] = [
    { id: 'overview', label: '综合总览', icon: Compass },
    { id: 'banquet', label: '安心家宴', icon: UtensilsCrossed },
    { id: 'whistle', label: '食药吹哨', icon: Megaphone },
    { id: 'policy', label: '政策宝典', icon: BookOpen },
    { id: 'guide', label: '办事指南', icon: FileText },
    { id: 'food_voice', label: '食安新语', icon: Sparkles },
    { id: 'audit_center', label: '审核处置中心', icon: ShieldAlert, badge: pendingAuditCount, govOnly: true },
    { id: 'dashboard_screen', label: '监管大屏', icon: BarChart3 },
    { id: 'settings', label: '平台管理配置', icon: Settings, govOnly: true }
  ];

  const visibleTabs = tabs.filter(tab => {
    if (tab.govOnly && !isGovRole) return false;
    return true;
  });

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2.5 no-scrollbar">
          {visibleTabs.map(tab => {
            const Icon = tab.icon;
            const active = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  active
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    active ? 'bg-white text-emerald-700' : 'bg-rose-500 text-white'
                  }`}>
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
