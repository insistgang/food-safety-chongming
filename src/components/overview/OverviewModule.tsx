import React from 'react';
import { 
  BookOpen, FileText, Sparkles, UtensilsCrossed, Megaphone, 
  ShieldCheck, Bike, Users, Award, ChevronRight, AlertCircle, 
  ArrowUpRight, HeartHandshake, Eye, BarChart3, Settings, ShieldAlert
} from 'lucide-react';
import { UserRole, TownName } from '../../types';
import { StorageService } from '../../services/storage';
import { MainTabType } from '../layout/Navigation';
import { useIsMobile } from '../common/MobileContext';

interface OverviewModuleProps {
  onTabChange: (tab: MainTabType) => void;
  userRole: UserRole;
  currentTown: TownName;
  userPoints: number;
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({
  onTabChange,
  userRole,
  currentTown,
  userPoints
}) => {
  const isMobile = useIsMobile();
  const declarations = StorageService.getBanquetDeclarations();
  const whistles = StorageService.getWhistles();
  const riders = StorageService.getRiders();
  const teams = StorageService.getBanquetTeams();

  // Statistics
  const certifiedRidersCount = riders.filter(r => r.status === '已认证').length;
  const activeTeamsCount = teams.filter(t => t.status === '已认证').length;
  const pendingWhistlesCount = whistles.filter(w => w.status === '待受理' || w.status === '执法核查中').length;
  const totalDecCount = declarations.length;
  const totalWhistleCount = whistles.length;

  const isGovRole = userRole === 'town_admin' || userRole === 'district_admin';

  /* ======================== MOBILE SPECIFIC LAYOUT ======================== */
  if (isMobile) {
    return (
      <div className="space-y-3.5">
        {/* Mobile Compact Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-teal-800 to-cyan-900 p-4 text-white shadow-md">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-medium text-emerald-200">
              <ShieldCheck className="h-3 w-3 text-emerald-300" />
              <span>崇明生态岛 · 数字化智慧共治</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-tight">
                食安崇明 · 瀛洲共治
              </h1>
              <p className="text-[11px] text-emerald-100/90 mt-0.5 leading-relaxed">
                农村家宴备案 · 外卖骑手吹哨 · 16 乡镇网格闭环
              </p>
            </div>

            <div className="pt-1.5 grid grid-cols-2 gap-2">
              <button
                onClick={() => onTabChange('banquet')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold shadow-sm transition-colors"
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>申报家宴</span>
              </button>
              <button
                onClick={() => onTabChange('whistle')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold shadow-sm transition-colors"
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>食药吹哨</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile 2x2 Compact Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400">家宴申报</div>
              <div className="text-lg font-black text-slate-800 mt-0.5">{totalDecCount} <span className="text-[10px] font-normal text-slate-400">单</span></div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400">吹哨线索</div>
              <div className="text-lg font-black text-slate-800 mt-0.5">{totalWhistleCount} <span className="text-[10px] font-normal text-slate-400">起</span></div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400">先锋骑手</div>
              <div className="text-lg font-black text-slate-800 mt-0.5">{certifiedRidersCount} <span className="text-[10px] font-normal text-slate-400">人</span></div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Bike className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400">大厨团队</div>
              <div className="text-lg font-black text-slate-800 mt-0.5">{activeTeamsCount} <span className="text-[10px] font-normal text-slate-400">支</span></div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Mobile Points Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/80 p-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-amber-800">当前共治积分</div>
              <div className="text-base font-black text-amber-900">{userPoints} <span className="text-[10px] font-normal text-amber-600">分</span></div>
            </div>
          </div>
          <button 
            onClick={() => onTabChange('whistle')}
            className="text-[11px] font-bold text-amber-700 bg-white/80 px-2.5 py-1 rounded-lg border border-amber-200"
          >
            吹哨获积分 ➔
          </button>
        </div>

        {/* Mobile Native App Service Grid (WeChat / Mini-Program Style) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-3 px-0.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-1.5 h-3.5 bg-emerald-600 rounded-full" />
              特色便民与治理服务
            </span>
            <span className="text-[10px] text-slate-400">一触直达</span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <button
              onClick={() => onTabChange('banquet')}
              className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-sm mb-1.5">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-800">安心家宴</span>
              <span className="text-[9px] text-slate-400">5桌报备</span>
            </button>

            <button
              onClick={() => onTabChange('whistle')}
              className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-sm mb-1.5">
                <Megaphone className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-800">食药吹哨</span>
              <span className="text-[9px] text-slate-400">骑手哨兵</span>
            </button>

            <button
              onClick={() => onTabChange('food_voice')}
              className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-600 text-white flex items-center justify-center shadow-sm mb-1.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-800">食安新语</span>
              <span className="text-[9px] text-slate-400">辟谣专栏</span>
            </button>

            <button
              onClick={() => onTabChange('policy')}
              className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-sm mb-1.5">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-800">政策宝典</span>
              <span className="text-[9px] text-slate-400">标准法规</span>
            </button>

            <button
              onClick={() => onTabChange('guide')}
              className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-600 text-white flex items-center justify-center shadow-sm mb-1.5">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-800">办事指南</span>
              <span className="text-[9px] text-slate-400">一件事一次办</span>
            </button>

            <button
              onClick={() => onTabChange('dashboard_screen')}
              className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-sm mb-1.5">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-800">监管大屏</span>
              <span className="text-[9px] text-slate-400">全区数据</span>
            </button>

            {isGovRole && (
              <button
                onClick={() => onTabChange('audit_center')}
                className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-700 text-white flex items-center justify-center shadow-sm mb-1.5 relative">
                  <ShieldAlert className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white" />
                </div>
                <span className="text-[11px] font-bold text-slate-800">审核中心</span>
                <span className="text-[9px] text-slate-400">网格处置</span>
              </button>
            )}

            {isGovRole && (
              <button
                onClick={() => onTabChange('settings')}
                className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-600 to-slate-800 text-white flex items-center justify-center shadow-sm mb-1.5">
                  <Settings className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-800">平台配置</span>
                <span className="text-[9px] text-slate-400">系统管理</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Safety Alert */}
        <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-bold text-[11px] text-amber-950">崇明秋冬家宴安全警示</div>
            <p className="text-[10px] text-amber-800 leading-relaxed">
              严禁自办宴席加工野生河豚鱼、有毒中草药（草乌/附子），四季豆必须彻底烧熟煮透并留样48小时。
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ======================== DESKTOP FULL LAYOUT ======================== */
  const coreModules = [
    {
      id: 'banquet' as MainTabType,
      title: '安心家宴',
      subTitle: '农村集体聚餐登记报备',
      desc: '实行5桌/50人以上聚餐全流程报备，严控高危禁令食材，大厨健康证与信用赋码管理。',
      icon: UtensilsCrossed,
      color: 'from-emerald-500 to-teal-600',
      badge: `${totalDecCount} 笔申报`,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'whistle' as MainTabType,
      title: '食药吹哨',
      subTitle: '外卖先锋骑手与公众移动哨兵',
      desc: '发挥骑手穿街走巷触角优势，快速反馈后厨脏乱与药品违规，立案结案即享积分与现金激励。',
      icon: Megaphone,
      color: 'from-amber-500 to-orange-600',
      badge: `${pendingWhistlesCount} 条待办`,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'food_voice' as MainTabType,
      title: '食安新语',
      subTitle: '生态IP、流动快检与科学辟谣',
      desc: '“瀛小安”代言、“食”光巴士巡回快检宣教、爱心共享站补给，粉碎食品安全网络传闻。',
      icon: Sparkles,
      color: 'from-teal-500 to-cyan-600',
      badge: '流动科普',
      badgeColor: 'bg-teal-100 text-teal-800'
    },
    {
      id: 'policy' as MainTabType,
      title: '政策宝典',
      subTitle: '国家法规、地方法规与标准库',
      desc: '收录《食品安全法》、上海市农村集体聚餐办法、崇明骑手吹哨制度与最新国家强制标准。',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-600',
      badge: '权威法典',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'guide' as MainTabType,
      title: '办事指南',
      subTitle: '一件事一次办与便民材料清单',
      desc: '小餐饮便民备案、食品经营许可证新办、农村自办宴席报备全流程图示与材料范本下载。',
      icon: FileText,
      color: 'from-sky-500 to-teal-600',
      badge: '高效政务',
      badgeColor: 'bg-sky-100 text-sky-800'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-emerald-200 backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            <span>崇明世界级生态岛 · 食品药品智慧治理系统</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            全岛守护 · 瀛洲共治
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            构建“政府网格监管 + 外卖骑手哨兵 + 农村家宴大厨 + 广大居民群众”四位一体的崇明食药安全治理共同体，守护绿水青山间的每一口放心美味。
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={() => onTabChange('banquet')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition-colors"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>我要申报家宴</span>
            </button>
            <button
              onClick={() => onTabChange('whistle')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold shadow-md shadow-amber-950/20 transition-colors"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>食药问题吹哨</span>
            </button>
            {isGovRole && (
              <button
                onClick={() => onTabChange('audit_center')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-md transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>进入审核中心</span>
              </button>
            )}
          </div>
        </div>

        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">家宴申报总数</div>
            <div className="text-xl font-black text-slate-800">{totalDecCount} <span className="text-xs font-normal text-slate-400">单</span></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">食药吹哨线索</div>
            <div className="text-xl font-black text-slate-800">{totalWhistleCount} <span className="text-xs font-normal text-slate-400">起</span></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">认证先锋骑手</div>
            <div className="text-xl font-black text-slate-800">{certifiedRidersCount} <span className="text-xs font-normal text-slate-400">人</span></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">认证办酒团队</div>
            <div className="text-xl font-black text-slate-800">{activeTeamsCount} <span className="text-xs font-normal text-slate-400">支</span></div>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-amber-700 font-medium">当前个人共治积分</div>
            <div className="text-xl font-black text-amber-900">{userPoints} <span className="text-xs font-normal text-amber-600">分</span></div>
          </div>
        </div>
      </div>

      {/* Main Core Modules Entry Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
            核心业务协同入口
          </h2>
          <span className="text-xs text-slate-400">点击进入专属业务处理模块</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coreModules.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="group relative bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                    {item.title}
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-emerald-600 transition-opacity" />
                  </h3>
                  <p className="text-xs font-medium text-emerald-800/80 mb-2">
                    {item.subTitle}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                  <span>立即办理 / 查看</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700 flex-shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-amber-900 mb-0.5">崇明区秋冬季农村家宴食品安全警示</div>
            <div className="text-amber-700 leading-relaxed">
              自办聚餐严禁加工野生河豚鱼、有毒中草药（草乌/附子）入菜，大锅四季豆必须彻底烧熟煮透并实施 48 小时独立留样。
            </div>
          </div>
        </div>
        <button
          onClick={() => onTabChange('banquet')}
          className="self-end sm:self-auto px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold whitespace-nowrap transition-colors"
        >
          查看红线禁令
        </button>
      </div>
    </div>
  );
};
