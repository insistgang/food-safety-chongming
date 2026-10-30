import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Compass, UtensilsCrossed, Megaphone, ShieldAlert, Sparkles, 
  Grid, X, ChevronRight, Smartphone, Monitor, BookOpen, 
  FileText, BarChart3, Settings, Bell, RotateCcw, Building2,
  Wifi, Battery, ShieldCheck, Check, ZoomIn, ZoomOut, UserCheck
} from 'lucide-react';
import { UserRole, TownName, NotificationMsg, UserProfile, CHONGMING_TOWNS } from './types';
import { StorageService } from './services/storage';
import { ToastProvider, useToast } from './components/common/Toast';
import { MobileContext } from './components/common/MobileContext';
import { Header } from './components/layout/Header';
import { Navigation, MainTabType } from './components/layout/Navigation';
import { NotificationModal } from './components/layout/NotificationModal';

// Modules
import { OverviewModule } from './components/overview/OverviewModule';
import { BanquetModule } from './components/banquet/BanquetModule';
import { WhistleModule } from './components/whistle/WhistleModule';
import { PolicyModule } from './components/policy/PolicyModule';
import { GuideModule } from './components/policy/GuideModule';
import { FoodVoiceModule } from './components/voice/FoodVoiceModule';
import { AuditCenter } from './components/audit/AuditCenter';
import { DashboardScreen } from './components/dashboard/DashboardScreen';
import { SettingsModule } from './components/settings/SettingsModule';

const AppContent: React.FC = () => {
  const { showToast } = useToast();

  // Startup User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => StorageService.getUser());

  // Global state
  const [currentRole, setCurrentRole] = useState<UserRole>('public');
  const [currentTown, setCurrentTown] = useState<TownName>('城桥镇');
  const [currentTab, setCurrentTab] = useState<MainTabType>('overview');
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isRoleSheetOpen, setIsRoleSheetOpen] = useState<boolean>(false);
  const [simScale, setSimScale] = useState<number>(0.92);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Live phone time
  const [currentTime, setCurrentTime] = useState<string>(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  // Track real mobile screen width
  const [isWindowMobile, setIsWindowMobile] = useState<boolean>(() => 
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsWindowMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Re-fetch notifications whenever refreshKey changes
  const [allNotifications, setAllNotifications] = useState<NotificationMsg[]>(() => 
    StorageService.getNotifications()
  );

  const refreshData = useCallback(() => {
    setUserProfile(StorageService.getUser());
    setAllNotifications(StorageService.getNotifications());
    setRefreshKey(k => k + 1);
  }, []);

  // Filter notifications according to current role and town
  const relevantNotifications = useMemo(() => {
    return allNotifications.filter(n => {
      if (currentRole === 'district_admin') return true;

      const roleMatch = n.targetRole === 'all' || n.targetRole === currentRole;
      if (!roleMatch) return false;

      if (currentRole === 'town_admin' && n.targetTown) {
        return n.targetTown === currentTown;
      }

      return true;
    });
  }, [allNotifications, currentRole, currentTown]);

  // Unread count
  const unreadCount = useMemo(() => {
    return relevantNotifications.filter(n => !n.read).length;
  }, [relevantNotifications]);

  // Pending audit count for Gov badge
  const pendingAuditCount = useMemo(() => {
    if (currentRole !== 'town_admin' && currentRole !== 'district_admin') return 0;

    const decs = StorageService.getBanquetDeclarations();
    const whistles = StorageService.getWhistles();

    const pendingDecs = decs.filter(d => {
      const matchTown = currentRole === 'district_admin' || d.town === currentTown;
      return matchTown && (d.status === '待乡镇审核' || d.status === '现场核查中');
    }).length;

    const pendingWhistles = whistles.filter(w => {
      const matchTown = currentRole === 'district_admin' || w.town === currentTown;
      return matchTown && (w.status === '待受理' || w.status === '执法核查中');
    }).length;

    return pendingDecs + pendingWhistles;
  }, [currentRole, currentTown, refreshKey]);

  // Role change: only change viewing perspective, do not overwrite stored user
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    showToast(`已切换视角：【${role === 'public' ? '公众门户' : role === 'rider' ? '先锋骑手端' : role === 'caterer' ? '大厨专区' : role === 'town_admin' ? '乡镇监管端' : '区级指挥端'}】`);
    if ((role !== 'town_admin' && role !== 'district_admin') && (currentTab === 'audit_center' || currentTab === 'settings')) {
      setCurrentTab('overview');
    }
  };

  // Reset Demo Data
  const handleResetData = () => {
    StorageService.resetAll();
    refreshData();
    setCurrentRole('public');
    setCurrentTown('城桥镇');
    setCurrentTab('overview');
    showToast('演示测试数据已全部重置为初始状态！');
  };

  // Mark notification read
  const handleMarkNotificationRead = (id: string) => {
    StorageService.markNotificationRead(id);
    setAllNotifications(StorageService.getNotifications());
  };

  // Navigation from notification
  const handleNavigateFromNotification = (linkId?: string, type?: string) => {
    if (currentRole === 'town_admin' || currentRole === 'district_admin') {
      setCurrentTab('audit_center');
    } else if (type === 'banquet') {
      setCurrentTab('banquet');
    } else if (type === 'whistle') {
      setCurrentTab('whistle');
    }
  };

  const isGovRole = currentRole === 'town_admin' || currentRole === 'district_admin';

  // Role details map
  const roleMeta: Record<UserRole, { label: string; tag: string; color: string; desc: string }> = {
    public: { label: '公众用户端', tag: '市民', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', desc: '家宴在线报备、食药科普、线索反馈' },
    rider: { label: '外卖先锋骑手端', tag: '骑手哨兵', color: 'bg-amber-100 text-amber-800 border-amber-300', desc: '后厨随手拍、移动探针、立案领红包' },
    caterer: { label: '办酒一条龙团队', tag: '大厨', color: 'bg-orange-100 text-orange-800 border-orange-300', desc: '资质备案、信用记分管理、留样自查' },
    town_admin: { label: '乡镇网格监管端', tag: '属地网格', color: 'bg-sky-100 text-sky-800 border-sky-300', desc: '本乡镇家宴审批、现场踏勘、大厨扣分' },
    district_admin: { label: '区食药安办监管', tag: '全区宏观', color: 'bg-indigo-100 text-indigo-800 border-indigo-300', desc: '全岛大数据大屏、跨乡镇督办、数据导出' }
  };

  // Render current main module
  const renderCurrentModule = () => {
    switch (currentTab) {
      case 'overview':
        return (
          <OverviewModule
            key={refreshKey}
            onTabChange={setCurrentTab}
            userRole={currentRole}
            currentTown={currentTown}
            userPoints={userProfile.points}
          />
        );
      case 'banquet':
        return (
          <BanquetModule
            key={refreshKey}
            userRole={currentRole}
            currentTown={currentTown}
            onNavigateToAudit={() => setCurrentTab('audit_center')}
          />
        );
      case 'whistle':
        return (
          <WhistleModule
            key={refreshKey}
            userRole={currentRole}
            currentTown={currentTown}
            userPoints={userProfile.points}
            onPointsChange={() => refreshData()}
          />
        );
      case 'policy':
        return <PolicyModule key={refreshKey} userRole={currentRole} />;
      case 'guide':
        return <GuideModule key={refreshKey} />;
      case 'food_voice':
        return <FoodVoiceModule key={refreshKey} userRole={currentRole} />;
      case 'audit_center':
        return (
          <AuditCenter
            key={refreshKey}
            userRole={currentRole}
            currentTown={currentTown}
            onRefreshUserPoints={refreshData}
          />
        );
      case 'dashboard_screen':
        return <DashboardScreen key={refreshKey} userRole={currentRole} currentTown={currentTown} />;
      case 'settings':
        return (
          <SettingsModule
            key={refreshKey}
            userRole={currentRole}
            currentTown={currentTown}
            onResetAll={handleResetData}
            onNotificationChange={refreshData}
            onNavigateToAudit={() => setCurrentTab('audit_center')}
          />
        );
      default:
        return (
          <OverviewModule
            key={refreshKey}
            onTabChange={setCurrentTab}
            userRole={currentRole}
            currentTown={currentTown}
            userPoints={userProfile.points}
          />
        );
    }
  };

  // Mobile Bottom Navigation Bar
  const renderMobileBottomNav = () => (
    <nav className="bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-3 flex items-center justify-around flex-shrink-0 z-30 shadow-lg">
      <button 
        onClick={() => { setCurrentTab('overview'); setIsMobileMenuOpen(false); }} 
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
          currentTab === 'overview' ? 'text-emerald-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Compass className="w-4 h-4 mb-0.5" />
        <span className="text-[10px]">总览</span>
      </button>

      <button 
        onClick={() => { setCurrentTab('banquet'); setIsMobileMenuOpen(false); }} 
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
          currentTab === 'banquet' ? 'text-emerald-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <UtensilsCrossed className="w-4 h-4 mb-0.5" />
        <span className="text-[10px]">安心家宴</span>
      </button>

      <button 
        onClick={() => { setCurrentTab('whistle'); setIsMobileMenuOpen(false); }} 
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
          currentTab === 'whistle' ? 'text-amber-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Megaphone className="w-4 h-4 mb-0.5" />
        <span className="text-[10px]">食药吹哨</span>
      </button>

      {isGovRole ? (
        <button 
          onClick={() => { setCurrentTab('audit_center'); setIsMobileMenuOpen(false); }} 
          className={`relative flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'audit_center' ? 'text-sky-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ShieldAlert className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">审核中心</span>
          {pendingAuditCount > 0 && (
            <span className="absolute top-0.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>
      ) : (
        <button 
          onClick={() => { setCurrentTab('food_voice'); setIsMobileMenuOpen(false); }} 
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'food_voice' ? 'text-teal-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">食安新语</span>
        </button>
      )}

      {/* More Drawer Button */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
          isMobileMenuOpen || ['policy', 'guide', 'dashboard_screen', 'settings'].includes(currentTab)
            ? 'text-indigo-600 font-bold scale-105' 
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Grid className="w-4 h-4 mb-0.5" />
        <span className="text-[10px]">全部服务</span>
      </button>
    </nav>
  );

  // Mobile Services Drawer
  const renderMobileServicesDrawer = () => (
    isMobileMenuOpen && (
      <div 
        className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className="bg-white w-full max-w-md rounded-t-3xl p-5 shadow-2xl border-t border-slate-200 animate-in slide-in-from-bottom duration-200"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
              <h3 className="font-bold text-slate-800 text-sm">崇明食安微服务专区</h3>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <button
              onClick={() => { setCurrentTab('policy'); setIsMobileMenuOpen(false); }}
              className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-colors ${
                currentTab === 'policy' ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold' : 'border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold">政策宝典</div>
                <div className="text-[10px] text-slate-400">法规标准库</div>
              </div>
            </button>

            <button
              onClick={() => { setCurrentTab('guide'); setIsMobileMenuOpen(false); }}
              className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-colors ${
                currentTab === 'guide' ? 'bg-sky-50 border-sky-300 text-sky-800 font-bold' : 'border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold">办事指南</div>
                <div className="text-[10px] text-slate-400">一件事一次办</div>
              </div>
            </button>

            <button
              onClick={() => { setCurrentTab('food_voice'); setIsMobileMenuOpen(false); }}
              className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-colors ${
                currentTab === 'food_voice' ? 'bg-teal-50 border-teal-300 text-teal-800 font-bold' : 'border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold">食安新语</div>
                <div className="text-[10px] text-slate-400">活动与辟谣</div>
              </div>
            </button>

            <button
              onClick={() => { setCurrentTab('dashboard_screen'); setIsMobileMenuOpen(false); }}
              className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-colors ${
                currentTab === 'dashboard_screen' ? 'bg-indigo-50 border-indigo-300 text-indigo-800 font-bold' : 'border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold">监管大屏</div>
                <div className="text-[10px] text-slate-400">全区数据台账</div>
              </div>
            </button>

            {isGovRole && (
              <button
                onClick={() => { setCurrentTab('settings'); setIsMobileMenuOpen(false); }}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 col-span-2 transition-colors ${
                  currentTab === 'settings' ? 'bg-slate-100 border-slate-300 text-slate-900 font-bold' : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-200 text-slate-700">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold">平台配置与消息中心</div>
                  <div className="text-[10px] text-slate-400">网格化设置与初始数据重置</div>
                </div>
              </button>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
            >
              收起菜单
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Mobile In-App Role Selector Bottom Sheet
  const renderMobileRoleSheet = () => (
    isRoleSheetOpen && (
      <div 
        className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
        onClick={() => setIsRoleSheetOpen(false)}
      >
        <div 
          className="bg-white w-full max-w-md rounded-t-3xl p-5 shadow-2xl border-t border-slate-200 animate-in slide-in-from-bottom duration-200"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">切换端侧业务视角</h3>
              <p className="text-[11px] text-slate-400">体验多主体协同与网格分流闭环</p>
            </div>
            <button 
              onClick={() => setIsRoleSheetOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            {(Object.keys(roleMeta) as UserRole[]).map(role => {
              const meta = roleMeta[role];
              const active = currentRole === role;
              return (
                <button
                  key={role}
                  onClick={() => {
                    handleRoleChange(role);
                    setIsRoleSheetOpen(false);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    active ? 'bg-emerald-50 border-emerald-500 shadow-xs' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{meta.label}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${meta.color}`}>
                        {meta.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{meta.desc}</p>
                  </div>
                  {active && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased">
      {/* 
        ======================================================================
        MODE 1: DESKTOP MOBILE SIMULATOR WORKBENCH (When isMobilePreview is true)
        ======================================================================
      */}
      {isMobilePreview ? (
        <div className="flex-1 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col h-screen overflow-hidden select-none">
          {/* Top Workbench Studio Bar */}
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 text-white flex items-center justify-between text-xs backdrop-blur-md flex-shrink-0 z-40">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="font-bold text-slate-200 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>崇明食安移动真机模拟器</span>
              </div>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono border border-slate-700">
                iPhone 15 Pro · 393 × 852
              </span>
            </div>

            {/* Scaling and Exit Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-[11px]">
                <button
                  onClick={() => setSimScale(0.85)}
                  className={`px-2 py-0.5 rounded ${simScale === 0.85 ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
                >
                  85%
                </button>
                <button
                  onClick={() => setSimScale(0.92)}
                  className={`px-2 py-0.5 rounded ${simScale === 0.92 ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
                >
                  92%
                </button>
                <button
                  onClick={() => setSimScale(1.0)}
                  className={`px-2 py-0.5 rounded ${simScale === 1.0 ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
                >
                  100%
                </button>
              </div>

              <button
                onClick={handleResetData}
                title="重置出厂测试数据"
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 border border-slate-700 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">重置数据</span>
              </button>

              <button
                onClick={() => setIsMobilePreview(false)}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>返回宽屏模式</span>
              </button>
            </div>
          </div>

          {/* Centered Phone Canvas Area (Fits 100% height, zero window scroll) */}
          <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden relative">
            {/* Realistic iPhone Exterior Titanium Case */}
            <div 
              style={{ transform: `scale(${simScale})`, transformOrigin: 'center center' }}
              className="w-[393px] h-[820px] rounded-[52px] border-[11px] border-slate-900 bg-slate-50 relative flex flex-col overflow-hidden shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] ring-1 ring-white/10 transition-transform duration-200"
            >
              {/* Left Hardware Buttons (Volume & Action Button) */}
              <div className="absolute -left-[14px] top-28 w-[3px] h-8 bg-slate-700 rounded-l" />
              <div className="absolute -left-[14px] top-42 w-[3px] h-12 bg-slate-700 rounded-l" />
              <div className="absolute -left-[14px] top-58 w-[3px] h-12 bg-slate-700 rounded-l" />
              {/* Right Hardware Power Button */}
              <div className="absolute -right-[14px] top-40 w-[3px] h-16 bg-slate-700 rounded-r" />

              {/* In-Phone iOS Status Bar + Dynamic Island */}
              <div className="bg-white/95 backdrop-blur-md pt-2 px-6 pb-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-900 flex-shrink-0 z-40 border-b border-slate-100">
                <span className="font-mono">{currentTime}</span>
                {/* Dynamic Island Notch */}
                <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end pr-2 shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800/80 border border-slate-700" />
                </div>
                <div className="flex items-center gap-1 text-slate-800">
                  <span className="text-[10px] font-bold">5G</span>
                  <Wifi className="w-3.5 h-3.5" />
                  <Battery className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                </div>
              </div>

              {/* In-Phone WeChat / Native App Header */}
              <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 border-b border-slate-200 flex items-center justify-between flex-shrink-0 z-30">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                    食安崇明
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Town badge if town_admin */}
                  {currentRole === 'town_admin' && (
                    <select
                      value={currentTown}
                      onChange={e => setCurrentTown(e.target.value as TownName)}
                      className="px-1.5 py-0.5 bg-sky-50 border border-sky-200 rounded text-[11px] font-bold text-sky-800 outline-none cursor-pointer"
                    >
                      {CHONGMING_TOWNS.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  )}

                  {/* Tap to open Role Selector Bottom Sheet */}
                  <button
                    onClick={() => setIsRoleSheetOpen(true)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${roleMeta[currentRole].color} border shadow-2xs flex items-center gap-1`}
                  >
                    <span>{roleMeta[currentRole].tag}</span>
                    <span className="text-[9px] opacity-60">▼</span>
                  </button>

                  {/* Notification Bell */}
                  <button
                    onClick={() => setIsNotificationOpen(true)}
                    className="relative p-1 text-slate-600 hover:text-slate-900"
                    title="通知"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* In-Phone Scrollable Content (Wrapped with MobileContext = true!) */}
              <MobileContext.Provider value={true}>
                <div className="flex-1 overflow-y-auto p-3.5 bg-slate-50/80 space-y-3.5 no-scrollbar select-text">
                  {renderCurrentModule()}
                </div>
              </MobileContext.Provider>

              {/* In-Phone Bottom Tab Navigation */}
              {renderMobileBottomNav()}

              {/* In-Phone Home Bar Indicator */}
              <div className="bg-white h-4 w-full flex items-center justify-center flex-shrink-0">
                <div className="w-28 h-1 bg-slate-900/60 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 
          ======================================================================
          MODE 2: REAL MOBILE & RESPONSIVE DESKTOP DUAL VIEW
          ======================================================================
        */
        <>
          {/* Top Header */}
          <Header
            currentRole={currentRole}
            onRoleChange={handleRoleChange}
            currentTown={currentTown}
            onTownChange={setCurrentTown}
            isMobilePreview={isMobilePreview}
            onToggleMobilePreview={() => setIsMobilePreview(true)}
            unreadCount={unreadCount}
            onOpenNotifications={() => setIsNotificationOpen(true)}
            onResetData={handleResetData}
            userPoints={userProfile.points}
          />

          {/* Desktop Tab Navigation (Hidden on mobile screens to avoid horizontal scroll clutter) */}
          <div className="hidden md:block">
            <Navigation
              currentTab={currentTab}
              onTabChange={setCurrentTab}
              userRole={currentRole}
              pendingAuditCount={pendingAuditCount}
            />
          </div>

          {/* Main Content Area (Wrapped with MobileContext = isWindowMobile) */}
          <MobileContext.Provider value={isWindowMobile}>
            <main className="flex-1 py-4 sm:py-6 px-3 sm:px-6 lg:px-8 pb-24 md:pb-6">
              <div className="max-w-7xl mx-auto">
                {renderCurrentModule()}
              </div>
            </main>
          </MobileContext.Provider>

          {/* Real Mobile Fixed Bottom Tab Bar (Visible on mobile screens < md) */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 shadow-2xl">
            {renderMobileBottomNav()}
          </div>

          {/* Desktop Footer */}
          <footer className="hidden md:block bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
            <div className="max-w-7xl mx-auto px-4 space-y-1">
              <p className="font-medium text-slate-600">
                崇明区食品药品安全委员会办公室 · 智慧监管与公众共治数字化平台
              </p>
              <p className="text-[11px]">
                备案号：沪ICP备20240012号 · 演示系统基于 LocalStorage 客户端状态驱动 · 纯前端离线可用
              </p>
            </div>
          </footer>
        </>
      )}

      {/* Global Notification Modal */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={relevantNotifications}
        onMarkRead={handleMarkNotificationRead}
        onNavigateToItem={handleNavigateFromNotification}
      />

      {/* Mobile Services Drawer */}
      {renderMobileServicesDrawer()}

      {/* Mobile Role Selector Sheet */}
      {renderMobileRoleSheet()}
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
