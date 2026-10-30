import React, { useState } from 'react';
import { 
  ShieldCheck, Bell, Smartphone, Monitor, ChevronDown, 
  RotateCcw, Sparkles, Building2, UserCircle2, Bike, Award
} from 'lucide-react';
import { UserRole, TownName, CHONGMING_TOWNS } from '../../types';
import { StorageService } from '../../services/storage';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentTown: TownName;
  onTownChange: (town: TownName) => void;
  isMobilePreview: boolean;
  onToggleMobilePreview: () => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onResetData: () => void;
  userPoints: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  currentTown,
  onTownChange,
  isMobilePreview,
  onToggleMobilePreview,
  unreadCount,
  onOpenNotifications,
  onResetData,
  userPoints
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roleLabels: Record<UserRole, { label: string; tag: string; color: string; icon: any }> = {
    public: { label: '公众用户端', tag: '市民门户', color: 'bg-emerald-100 text-emerald-800', icon: UserCircle2 },
    rider: { label: '外卖先锋骑手端', tag: '吹哨先锋', color: 'bg-amber-100 text-amber-800', icon: Bike },
    caterer: { label: '乡村办宴一条龙团队', tag: '大厨专区', color: 'bg-orange-100 text-orange-800', icon: Award },
    town_admin: { label: '乡镇监管审核端', tag: '属地网格', color: 'bg-sky-100 text-sky-800', icon: Building2 },
    district_admin: { label: '区食药安办全局监管', tag: '全区宏观', color: 'bg-indigo-100 text-indigo-800', icon: ShieldCheck }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & System Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                食安崇明
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                智慧监管与公众共治
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              崇明区食品药品安全委员会办公室 · 数字化协同平台
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* User Points Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>共治积分: <strong>{userPoints}</strong></span>
          </div>

          {/* Device Switcher (Desktop / Mobile Preview) */}
          <button
            onClick={onToggleMobilePreview}
            title={isMobilePreview ? '切换为桌面宽屏模式' : '切换为手机模拟端模式'}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              isMobilePreview 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isMobilePreview ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>手机端模拟器</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-slate-600" />
                <span>桌面宽屏模式</span>
              </>
            )}
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-sm transition-all"
            >
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${roleLabels[currentRole].color}`}>
                {roleLabels[currentRole].tag}
              </span>
              <span className="hidden sm:inline">{roleLabels[currentRole].label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <>
                {/* Backdrop for mobile touch dismiss */}
                <div 
                  className="fixed inset-0 z-40 bg-black/10 sm:bg-transparent" 
                  onClick={() => setRoleDropdownOpen(false)} 
                />
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900">角色切换模拟</p>
                    <p className="text-[11px] text-slate-500">快速体验不同视角下的业务流转</p>
                  </div>
                  {(Object.keys(roleLabels) as UserRole[]).map(role => {
                    const Icon = roleLabels[role].icon;
                    const active = currentRole === role;
                    return (
                      <button
                        key={role}
                        onClick={() => {
                          onRoleChange(role);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left text-xs transition-colors ${
                          active ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <div className="flex-1">
                          <div>{roleLabels[role].label}</div>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${roleLabels[role].color}`}>
                          {roleLabels[role].tag}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Town selector for town_admin or general context */}
          {currentRole === 'town_admin' && (
            <div className="flex items-center gap-1 bg-sky-50 border border-sky-200 px-2 py-1 rounded-lg text-xs font-medium text-sky-800">
              <span className="text-[11px] text-sky-600 hidden sm:inline">当前乡镇:</span>
              <select
                value={currentTown}
                onChange={(e) => onTownChange(e.target.value as TownName)}
                className="bg-transparent font-bold text-sky-900 outline-none cursor-pointer text-xs"
              >
                {CHONGMING_TOWNS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          )}

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="通知中心"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Reset Demo Data button */}
          <button
            onClick={onResetData}
            title="重置初始演示数据"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
