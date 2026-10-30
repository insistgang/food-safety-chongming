import React, { useMemo } from 'react';
import { 
  BarChart3, Download, ShieldCheck, AlertTriangle, UtensilsCrossed, 
  Megaphone, Bike, Award, Sparkles, Building2, MapPin, 
  ArrowUpRight, CheckCircle2, TrendingUp
} from 'lucide-react';
import { UserRole, TownName, CHONGMING_TOWNS } from '../../types';
import { StorageService } from '../../services/storage';
import { useToast } from '../common/Toast';
import { useIsMobile } from '../common/MobileContext';

interface DashboardScreenProps {
  userRole: UserRole;
  currentTown: TownName;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  userRole,
  currentTown
}) => {
  const isMobile = useIsMobile();
  const { showToast } = useToast();
  const declarations = StorageService.getBanquetDeclarations();
  const whistles = StorageService.getWhistles();
  const riders = StorageService.getRiders();
  const teams = StorageService.getBanquetTeams();

  // Metrics
  const approvedDeclarations = declarations.filter(d => d.status === '乡镇已通过' || d.status === '整改合格').length;
  const interceptedRiskCount = declarations.filter(d => d.riskWarningsDetected && d.riskWarningsDetected.length > 0).length;
  const resolvedWhistles = whistles.filter(w => w.status === '已核实结案').length;
  const totalRewardPoints = whistles.reduce((acc, w) => acc + (w.rewardPoints || 0), 0);
  const totalRewardCash = whistles.reduce((acc, w) => acc + (w.rewardCash || 0), 0);
  const certifiedRiders = riders.filter(r => r.status === '已认证').length;
  const certifiedTeams = teams.filter(t => t.status === '已认证').length;

  // Town breakdown data
  const townStats = useMemo(() => {
    return CHONGMING_TOWNS.map(town => {
      const townDecs = declarations.filter(d => d.town === town);
      const townWhistles = whistles.filter(w => w.town === town);
      const townTeams = teams.filter(t => t.town === town);
      const townRisk = townDecs.filter(d => d.riskWarningsDetected && d.riskWarningsDetected.length > 0).length;
      return {
        town,
        declarationsCount: townDecs.length,
        whistlesCount: townWhistles.length,
        teamsCount: townTeams.length,
        riskCount: townRisk,
        totalActivity: townDecs.length + townWhistles.length
      };
    }).sort((a, b) => b.totalActivity - a.totalActivity);
  }, [declarations, whistles, teams]);

  const maxActivity = Math.max(...townStats.map(t => t.totalActivity), 1);

  // Export to CSV with UTF-8 BOM
  const handleExportCSV = () => {
    const rows: string[] = [];

    // Header 1: 家宴申报
    rows.push('【崇明区农村集体聚餐（家宴）报备台账】');
    rows.push('申报单号,举办人,联系电话,事由,聚餐日期,桌数,预估人数,所属乡镇,详细地址,承办大厨团队,风险食材预警,审核状态,审核人,审核意见,申报时间');
    declarations.forEach(d => {
      const riskStr = (d.riskWarningsDetected || []).join(';');
      rows.push([
        `"${d.id}"`,
        `"${d.declarantName}"`,
        `"${d.declarantPhone}"`,
        `"${d.reason}"`,
        `"${d.eventDate}"`,
        d.tablesCount,
        d.estimatedPeople,
        `"${d.town}"`,
        `"${d.detailedAddress.replace(/"/g, '""')}"`,
        `"${d.teamName}"`,
        `"${riskStr}"`,
        `"${d.status}"`,
        `"${d.auditorName || ''}"`,
        `"${(d.auditNote || '').replace(/"/g, '""')}"`,
        `"${d.createdAt}"`
      ].join(','));
    });

    rows.push('');
    rows.push('');

    // Header 2: 食药吹哨
    rows.push('【崇明区食品药品安全吹哨人监督台账】');
    rows.push('吹哨单号,分类,涉事对象,所属乡镇,详细地址,问题类型,详细事实描述,吹哨人类型,吹哨人,联系电话,状态,承办部门,执法处置结论,奖励积分,奖励现金(元),提报时间,结案时间');
    whistles.forEach(w => {
      const issuesStr = (w.issueTypes || []).join(';');
      rows.push([
        `"${w.id}"`,
        `"${w.category === 'food' ? '食品安全' : '药品安全'}"`,
        `"${w.targetName}"`,
        `"${w.town}"`,
        `"${w.locationAddress.replace(/"/g, '""')}"`,
        `"${issuesStr}"`,
        `"${w.description.replace(/"/g, '""')}"`,
        `"${w.reporterType}"`,
        `"${w.reporterName}"`,
        `"${w.reporterPhone}"`,
        `"${w.status}"`,
        `"${w.assignedDepartment || ''}"`,
        `"${(w.auditComment || '').replace(/"/g, '""')}"`,
        w.rewardPoints,
        w.rewardCash,
        `"${w.createdAt}"`,
        `"${w.resolvedAt || ''}"`
      ].join(','));
    });

    // UTF-8 BOM to prevent Excel garbled Chinese
    const csvContent = '\uFEFF' + rows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `崇明食药安办_综合监管数据台账_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('综合监管台账已成功导出为 UTF-8 Excel (CSV) 文件！');
  };

  return (
    <div className={isMobile ? "space-y-3.5" : "space-y-6"}>
      {/* Header Banner */}
      <div className={`bg-gradient-to-r from-slate-900 via-indigo-950 to-emerald-950 rounded-2xl text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        isMobile ? 'p-4' : 'p-6 sm:p-8'
      }`}>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-300 text-[10px] sm:text-xs font-medium mb-1.5 backdrop-blur-md">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>崇明区食品药品安全大数据监管座舱</span>
          </div>
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl sm:text-3xl'} font-black tracking-tight mb-1`}>
            智慧食安 · 宏观大屏
          </h2>
          <p className={`${isMobile ? 'text-[11px]' : 'text-sm'} text-slate-300 leading-relaxed`}>
            实时汇聚全岛16个乡镇家宴申报、骑手吹哨、记分及闭环查处数据。
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="relative z-10 w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/30 transition-all flex-shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>导出全区数据 (Excel/CSV)</span>
        </button>
      </div>

      {/* Metrics Row 1: 家宴 & 吹哨 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-3 sm:p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500">
            <span>家宴申报</span>
            <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{declarations.length} <span className="text-[10px] font-normal text-slate-400">单</span></div>
          <div className="text-[10px] text-emerald-700 font-medium">
            通过/整改: <strong>{approvedDeclarations}</strong> 单
          </div>
        </div>

        <div className="bg-white rounded-xl border border-rose-200/80 bg-rose-50/20 p-3 sm:p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-rose-700 font-semibold">
            <span>高危拦截</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-700">{interceptedRiskCount} <span className="text-[10px] font-normal text-rose-400">起</span></div>
          <div className="text-[10px] text-rose-600">
            草乌/河豚/四季豆等
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-3 sm:p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500">
            <span>吹哨线索</span>
            <Megaphone className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{whistles.length} <span className="text-[10px] font-normal text-slate-400">起</span></div>
          <div className="text-[10px] text-emerald-700 font-medium">
            查实结案: <strong>{resolvedWhistles}</strong> 起
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-3 sm:p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500">
            <span>吹哨奖励</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600">{totalRewardPoints} <span className="text-[10px] font-normal text-slate-400">分</span></div>
          <div className="text-[10px] text-amber-800 font-medium">
            红包: <strong>¥{totalRewardCash}</strong> 元
          </div>
        </div>
      </div>

      {/* Metrics Row 2: 队伍与骑手 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">认证先锋骑手</div>
            <div className="text-lg font-black text-slate-800">{certifiedRiders} <span className="text-xs font-normal text-slate-400">人</span></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">办酒一条龙大厨团队</div>
            <div className="text-lg font-black text-slate-800">{certifiedTeams} <span className="text-xs font-normal text-slate-400">支</span></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">覆盖全区乡镇</div>
            <div className="text-lg font-black text-slate-800">16 <span className="text-xs font-normal text-slate-400">个乡镇全覆盖</span></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">食材48小时留样率</div>
            <div className="text-lg font-black text-emerald-700">100%</div>
          </div>
        </div>
      </div>

      {/* Town Distribution Analysis (No 3rd-party chart library, clean tailwind bars) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              崇明全区 16 乡镇食药安办综合网格数据分布
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              各乡镇家宴报备体量、吹哨线索密度与高危食材拦截强度对比
            </p>
          </div>
          <span className="text-xs font-medium text-slate-400">按综合活跃度排序</span>
        </div>

        <div className="space-y-3">
          {townStats.map((item, idx) => {
            const percentage = Math.round((item.totalActivity / maxActivity) * 100);
            const isHighlighted = item.town === currentTown;
            return (
              <div 
                key={item.town} 
                className={`p-3.5 rounded-xl border transition-all ${
                  isHighlighted ? 'bg-sky-50/50 border-sky-300 ring-1 ring-sky-200' : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-center font-bold text-slate-400 text-[11px]">#{idx + 1}</span>
                    <span className="font-bold text-slate-900">{item.town}</span>
                    {isHighlighted && (
                      <span className="px-1.5 py-0.2 rounded bg-sky-200 text-sky-800 text-[10px] font-bold">
                        当前所在乡镇
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 sm:gap-6 text-slate-600 text-[11px]">
                    <span>家宴: <strong>{item.declarationsCount}</strong></span>
                    <span>吹哨: <strong>{item.whistlesCount}</strong></span>
                    <span>大厨队: <strong>{item.teamsCount}</strong></span>
                    {item.riskCount > 0 && (
                      <span className="text-rose-600 font-bold">高危: {item.riskCount}</span>
                    )}
                  </div>
                </div>

                {/* Progress Visual Bar */}
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${Math.max(percentage, 6)}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.riskCount > 0 
                        ? 'bg-gradient-to-r from-emerald-500 to-amber-500' 
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
