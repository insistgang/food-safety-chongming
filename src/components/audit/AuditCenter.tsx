import React, { useState } from 'react';
import { 
  ShieldAlert, UtensilsCrossed, Megaphone, Award, CheckCircle2, 
  XCircle, AlertTriangle, Search, Filter, ShieldCheck, 
  Building2, Calendar, FileText, Check, X, Sparkles, AlertCircle
} from 'lucide-react';
import { 
  UserRole, TownName, CHONGMING_TOWNS, BanquetDeclaration, 
  WhistleblowerReport, BanquetTeam, BanquetDeductionRecord 
} from '../../types';
import { StorageService } from '../../services/storage';
import { useToast } from '../common/Toast';
import { useIsMobile } from '../common/MobileContext';

interface AuditCenterProps {
  userRole: UserRole;
  currentTown: TownName;
  onRefreshUserPoints?: () => void;
}

export const AuditCenter: React.FC<AuditCenterProps> = ({
  userRole,
  currentTown,
  onRefreshUserPoints
}) => {
  const isMobile = useIsMobile();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'banquet' | 'whistle' | 'deduction'>('banquet');

  // Filter town: if town_admin, locked to currentTown; if district_admin, can choose
  const [selectedTownFilter, setSelectedTownFilter] = useState<string>(
    userRole === 'town_admin' ? currentTown : '全部'
  );

  // Data states
  const [declarations, setDeclarations] = useState<BanquetDeclaration[]>(StorageService.getBanquetDeclarations());
  const [whistles, setWhistles] = useState<WhistleblowerReport[]>(StorageService.getWhistles());
  const [teams, setTeams] = useState<BanquetTeam[]>(StorageService.getBanquetTeams());
  const [deductions, setDeductions] = useState<BanquetDeductionRecord[]>(StorageService.getDeductions());

  // Audit Banquet Modal
  const [auditBanquetItem, setAuditBanquetItem] = useState<BanquetDeclaration | null>(null);
  const [banquetAuditNote, setBanquetAuditNote] = useState('');
  const [banquetAuditorName, setBanquetAuditorName] = useState(
    userRole === 'town_admin' ? `${currentTown}食药安办专管员` : '区食药安办综合监管组'
  );

  // Audit Whistle Modal
  const [auditWhistleItem, setAuditWhistleItem] = useState<WhistleblowerReport | null>(null);
  const [whistleStatus, setWhistleStatus] = useState<WhistleblowerReport['status']>('已核实结案');
  const [whistleComment, setWhistleComment] = useState('经执法大队现地突击勘验，反映情况属实。已责令改正并给予诚信记分处理。');
  const [whistleDepartment, setWhistleDepartment] = useState(
    userRole === 'town_admin' ? `${currentTown}市场监督管理所` : '崇明区市场监督管理局综合执法大队'
  );
  const [rewardPoints, setRewardPoints] = useState<number>(5);
  const [rewardCash, setRewardCash] = useState<number>(50);

  // Deduction Form State
  const [deductTeamId, setDeductTeamId] = useState<string>(teams[0]?.id || '');
  const [deductPoints, setDeductPoints] = useState<number>(3);
  const [deductReason, setDeductReason] = useState('聚餐现场有帮厨未佩戴口罩手套，且生熟用具未严格分色放置');
  const [deductInspector, setDeductInspector] = useState(
    userRole === 'town_admin' ? `${currentTown}市场所巡查员` : '区食安抽检督查专员'
  );

  // Effective town for filtering
  const effectiveTown = userRole === 'town_admin' ? currentTown : selectedTownFilter;

  // Filtered lists
  const filteredDeclarations = declarations.filter(d => {
    if (userRole === 'town_admin') return d.town === currentTown;
    if (selectedTownFilter !== '全部') return d.town === selectedTownFilter;
    return true;
  });

  const filteredWhistles = whistles.filter(w => {
    if (userRole === 'town_admin') return w.town === currentTown;
    if (selectedTownFilter !== '全部') return w.town === selectedTownFilter;
    return true;
  });

  const filteredDeductions = deductions.filter(ded => {
    if (userRole === 'town_admin') return ded.town === currentTown;
    if (selectedTownFilter !== '全部') return ded.town === selectedTownFilter;
    return true;
  });

  // Guard for non-gov role
  if (userRole !== 'town_admin' && userRole !== 'district_admin') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm text-center max-w-lg mx-auto my-12 space-y-4">
        <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">监管审核权限提示</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          审核处置中心面向【乡镇监管审核端】与【区食药安办全局监管】开放。您当前处于公众/社会视角，请在顶部导航右侧角色切换中切换为监管角色以体验审核闭环。
        </p>
      </div>
    );
  }

  // Handle Banquet Audit Execution
  const handleExecuteBanquetAudit = (status: BanquetDeclaration['status']) => {
    if (!auditBanquetItem) return;

    StorageService.auditBanquetDeclaration(
      auditBanquetItem.id,
      status,
      banquetAuditNote || `审核结论：${status}`,
      banquetAuditorName
    );

    setDeclarations(StorageService.getBanquetDeclarations());
    setAuditBanquetItem(null);
    setBanquetAuditNote('');
    showToast(`家宴申报单【${auditBanquetItem.id}】审核已更新为「${status}」`);
  };

  // Handle Whistle Audit Execution
  const handleExecuteWhistleAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditWhistleItem) return;

    StorageService.auditWhistle(
      auditWhistleItem.id,
      whistleStatus,
      whistleComment,
      whistleStatus === '已核实结案' ? Number(rewardPoints) : 0,
      whistleStatus === '已核实结案' ? Number(rewardCash) : 0,
      whistleDepartment
    );

    setWhistles(StorageService.getWhistles());
    setAuditWhistleItem(null);
    onRefreshUserPoints?.();
    showToast(`吹哨线索【${auditWhistleItem.id}】处置完成，已下发奖励并同步通知！`);
  };

  // Handle Team Deduction
  const handleRecordDeduction = (e: React.FormEvent) => {
    e.preventDefault();
    const team = teams.find(t => t.id === deductTeamId);
    if (!team) {
      showToast('请选择办酒团队', 'error');
      return;
    }

    StorageService.recordDeduction({
      teamId: team.id,
      teamName: team.teamName,
      pointsDeducted: Number(deductPoints),
      reason: deductReason,
      inspectDate: new Date().toISOString().split('T')[0],
      inspectorName: deductInspector,
      town: team.town
    });

    setTeams(StorageService.getBanquetTeams());
    setDeductions(StorageService.getDeductions());
    showToast(`已对「${team.teamName}」记录扣除信用分 ${deductPoints} 分！`);
  };

  return (
    <div className={isMobile ? "space-y-3.5" : "space-y-6"}>
      {/* Header Banner */}
      <div className={`bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 rounded-2xl text-white shadow-md relative overflow-hidden ${
        isMobile ? 'p-4' : 'p-6 sm:p-8'
      }`}>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-sky-200 text-[10px] sm:text-xs font-medium mb-2 backdrop-blur-md">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>
              {userRole === 'town_admin' ? `崇明区 · ${currentTown}属地网格` : '崇明区食药安办 · 全区监督'}
            </span>
          </div>
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl sm:text-3xl'} font-extrabold tracking-tight mb-1`}>
            监管处置中心 · 闭环督办
          </h2>
          <p className={`${isMobile ? 'text-[11px]' : 'text-sm'} text-sky-100/90 leading-relaxed`}>
            {userRole === 'town_admin'
              ? `负责处理【${currentTown}】范围内的农村集体聚餐报备审批与外卖吹哨立案核实。`
              : '统筹全岛16个乡镇农村家宴高危食材拦截、外卖骑手哨兵奖励裁决与积分发放。'}
          </p>
        </div>
      </div>

      {/* Role and Town Notice */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">
              审核权能：
              <span className="text-sky-700">
                {userRole === 'town_admin' ? `${currentTown} 属地管理员` : '区食药安办全区管理员'}
              </span>
            </div>
            <div className="text-[10px] text-slate-500">
              {userRole === 'town_admin' ? '仅显示并处理本乡镇业务' : '检索并协调全区16个乡镇线索'}
            </div>
          </div>
        </div>

        {userRole === 'district_admin' && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-500">筛选乡镇：</span>
            <select
              value={selectedTownFilter}
              onChange={e => setSelectedTownFilter(e.target.value)}
              className="px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none"
            >
              <option value="全部">全部崇明乡镇</option>
              {CHONGMING_TOWNS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Sub Tabs */}
      {isMobile ? (
        <div className="bg-slate-200/80 p-1 rounded-xl flex text-xs font-bold text-center">
          <button
            onClick={() => setActiveTab('banquet')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'banquet' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            家宴初审 ({filteredDeclarations.length})
          </button>
          <button
            onClick={() => setActiveTab('whistle')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'whistle' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            吹哨立案 ({filteredWhistles.length})
          </button>
          <button
            onClick={() => setActiveTab('deduction')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'deduction' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            大厨扣分
          </button>
        </div>
      ) : (
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('banquet')}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold transition-all relative ${
              activeTab === 'banquet'
                ? 'text-sky-700 border-b-2 border-sky-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            家宴申报初审与整改 ({filteredDeclarations.length})
          </button>
          <button
            onClick={() => setActiveTab('whistle')}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold transition-all relative ${
              activeTab === 'whistle'
                ? 'text-sky-700 border-b-2 border-sky-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            食药吹哨立案核实 ({filteredWhistles.length})
          </button>
          <button
            onClick={() => setActiveTab('deduction')}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold transition-all relative ${
              activeTab === 'deduction'
                ? 'text-sky-700 border-b-2 border-sky-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            办酒团队扣分与台账
          </button>
        </div>
      )}

      {/* 1. BANQUET AUDIT TAB */}
      {activeTab === 'banquet' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDeclarations.map(item => {
              const hasRisk = item.riskWarningsDetected.length > 0;
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border p-5 shadow-sm space-y-3 flex flex-col justify-between transition-all ${
                    hasRisk ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-100 text-sky-800">
                          {item.town}
                        </span>
                        <span className="text-xs font-semibold text-slate-800">
                          {item.declarantName}（{item.reason} · {item.tablesCount}桌）
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        item.status === '乡镇已通过'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === '待乡镇审核'
                          ? 'bg-amber-100 text-amber-800'
                          : item.status === '已驳回'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1 mb-2">
                      <p>承办团队：<strong>{item.teamName}</strong></p>
                      <p>聚餐日期：{item.eventDate} · 地点：{item.detailedAddress}</p>
                      <p>联系电话：{item.declarantPhone}</p>
                    </div>

                    {/* Risk Badge */}
                    {hasRisk && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs mb-3">
                        <div className="font-bold flex items-center gap-1.5 text-rose-700 mb-1">
                          <AlertTriangle className="w-4 h-4" />
                          <span>已拦截高风险菜单：</span>
                        </div>
                        <p className="font-medium text-[11px]">{item.riskWarningsDetected.join('、')}</p>
                      </div>
                    )}

                    <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600 max-h-20 overflow-y-auto mb-2">
                      <span className="font-bold text-slate-700">菜单明细：</span>
                      {item.menuText}
                    </div>

                    {item.auditNote && (
                      <div className="text-[11px] text-sky-800 bg-sky-50/60 p-2 rounded-lg">
                        <strong>审核留痕：</strong>{item.auditNote} ({item.auditorName || '监管人员'})
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">{item.createdAt}</span>
                    <button
                      onClick={() => {
                        setAuditBanquetItem(item);
                        setBanquetAuditNote(
                          hasRisk 
                            ? '菜单包含高风险违规食材，已勒令承办大厨立即剔除并整改。'
                            : '资料齐全，现场水源与冷藏条件核查合格，准予举办。'
                        );
                      }}
                      className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                    >
                      审核处置 ➔
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDeclarations.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
              <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">当前筛选条件下暂无家宴申报审核件</p>
            </div>
          )}
        </div>
      )}

      {/* 2. WHISTLE AUDIT TAB */}
      {activeTab === 'whistle' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWhistles.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.category === 'food' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                      }`}>
                        {item.category === 'food' ? '食品' : '药品'} · {item.town}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{item.targetName}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      item.status === '已核实结案'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === '执法核查中'
                        ? 'bg-amber-100 text-amber-800'
                        : item.status === '已受理转派'
                        ? 'bg-sky-100 text-sky-800'
                        : item.status === '待受理'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 mb-2">
                    吹哨人：{item.reporterName}（{item.reporterPhone}） · 发生地：{item.locationAddress}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.issueTypes.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-bold">
                        {t}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {item.evidenceImages.length > 0 && (
                    <div className="flex gap-2 mb-2">
                      {item.evidenceImages.map((img, idx) => (
                        <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                          <img src={img} alt="证据" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {item.auditComment && (
                    <div className="text-[11px] text-emerald-800 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                      <strong>结案处置结果：</strong>{item.auditComment}
                      <div className="mt-1 flex items-center justify-between text-[10px] text-emerald-600">
                        <span>经办部门：{item.assignedDepartment}</span>
                        <span>奖励：+{item.rewardPoints}分 / ¥{item.rewardCash}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{item.createdAt}</span>
                  <button
                    onClick={() => {
                      setAuditWhistleItem(item);
                      setWhistleStatus('已核实结案');
                      setWhistleDepartment(
                        userRole === 'town_admin' ? `${item.town}市场监管所` : '崇明区市场监督管理局执法大队'
                      );
                    }}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                  >
                    核查与裁决奖励 ➔
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredWhistles.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
              <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">当前筛选条件下暂无吹哨核查件</p>
            </div>
          )}
        </div>
      )}

      {/* 3. DEDUCTIONS MANAGEMENT & LEDGER TAB */}
      {activeTab === 'deduction' && (
        <div className="space-y-6">
          {/* Deduction Form */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              办酒一条龙团队监管巡查记分扣除
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              现场核验发现违反食品留样、健康证脱节、生熟混放等行为，实施动态信用记分管理（低于60分自动暂停资格）。
            </p>

            <form onSubmit={handleRecordDeduction} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">选择承办大厨团队 *</label>
                  <select
                    value={deductTeamId}
                    onChange={e => setDeductTeamId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.teamName}（{t.town} · 现分：{t.score}）
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">扣除信用积分 *</label>
                  <select
                    value={deductPoints}
                    onChange={e => setDeductPoints(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                  >
                    <option value={1}>扣 1 分（轻微卫生瑕疵）</option>
                    <option value={2}>扣 2 分（未戴口罩工帽/未生熟分色）</option>
                    <option value={3}>扣 3 分（帮厨健康证缺失/过期）</option>
                    <option value={6}>扣 6 分（未严格48小时冷藏留样）</option>
                    <option value={12}>扣 12 分（违规加工高危野生食材/严重交叉污染）</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">检查执法人员姓名 *</label>
                  <input
                    type="text"
                    required
                    value={deductInspector}
                    onChange={e => setDeductInspector(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">现场违规事实及扣分依据 *</label>
                <input
                  type="text"
                  required
                  value={deductReason}
                  onChange={e => setDeductReason(e.target.value)}
                  placeholder="如：聚餐现场发现帮厨未规范佩戴工作帽口罩，且操作间水源非市政自来水"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                >
                  确认下达扣分决定书
                </button>
              </div>
            </form>
          </div>

          {/* Points Ledger (台账) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              团队信用积分实时台账
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">办酒团队</th>
                    <th className="py-2.5 px-3">所属乡镇</th>
                    <th className="py-2.5 px-3">带头人</th>
                    <th className="py-2.5 px-3">当前信用分</th>
                    <th className="py-2.5 px-3">监管状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teams.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-bold text-slate-800">{t.teamName}</td>
                      <td className="py-2.5 px-3">{t.town}</td>
                      <td className="py-2.5 px-3">{t.leaderName} ({t.leaderPhone})</td>
                      <td className="py-2.5 px-3">
                        <span className={`font-bold px-2 py-0.5 rounded ${
                          t.score >= 90 ? 'text-emerald-700 bg-emerald-50' : t.score >= 60 ? 'text-amber-700 bg-amber-50' : 'text-rose-700 bg-rose-50'
                        }`}>
                          {t.score} 分
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === '已认证' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider pt-4 border-t border-slate-100">
              近期现场扣分处置留痕记录
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
              {filteredDeductions.map(ded => (
                <div key={ded.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-800">{ded.teamName}</span>
                      <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 font-bold text-[10px]">
                        -{ded.pointsDeducted} 分
                      </span>
                      <span className="text-[11px] text-slate-400">（{ded.town}）</span>
                    </div>
                    <p className="text-slate-600 text-xs">{ded.reason}</p>
                  </div>
                  <div className="text-right text-[11px] text-slate-400 whitespace-nowrap">
                    <div>执法员：{ded.inspectorName}</div>
                    <div>{ded.inspectDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Banquet Audit Modal */}
      {auditBanquetItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">农村家宴申报初审与整改处置</h3>
              <button
                onClick={() => setAuditBanquetItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs mb-4">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div><strong>举办人：</strong>{auditBanquetItem.declarantName}（{auditBanquetItem.declarantPhone}）</div>
                <div><strong>承办团队：</strong>{auditBanquetItem.teamName}</div>
                <div><strong>规模：</strong>{auditBanquetItem.tablesCount} 桌 / {auditBanquetItem.estimatedPeople} 人</div>
                <div><strong>地址：</strong>{auditBanquetItem.town} · {auditBanquetItem.detailedAddress}</div>
              </div>

              {auditBanquetItem.riskWarningsDetected.length > 0 && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
                  <strong className="text-rose-700 block mb-1">系统拦截风险食材：</strong>
                  <p>{auditBanquetItem.riskWarningsDetected.join('、')}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">审核意见 / 整改指令 *</label>
                <textarea
                  rows={3}
                  required
                  value={banquetAuditNote}
                  onChange={e => setBanquetAuditNote(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">审核监管员姓名</label>
                <input
                  type="text"
                  value={banquetAuditorName}
                  onChange={e => setBanquetAuditorName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleExecuteBanquetAudit('已驳回')}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-colors"
              >
                驳回不予举办
              </button>
              <button
                onClick={() => handleExecuteBanquetAudit('现场核查中')}
                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold transition-colors"
              >
                下达现场核查
              </button>
              <button
                onClick={() => handleExecuteBanquetAudit('整改合格')}
                className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl text-xs font-bold transition-colors"
              >
                确认整改合格
              </button>
              <button
                onClick={() => handleExecuteBanquetAudit('乡镇已通过')}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
              >
                审核通过
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Whistle Audit Modal */}
      {auditWhistleItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">食药吹哨线索立案核实与奖励裁决</h3>
              <button
                onClick={() => setAuditWhistleItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteWhistleAudit} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div><strong>涉事对象：</strong>{auditWhistleItem.targetName}</div>
                <div><strong>问题归类：</strong>{auditWhistleItem.issueTypes.join('、')}</div>
                <div><strong>吹哨人：</strong>{auditWhistleItem.reporterName}（{auditWhistleItem.reporterPhone}）</div>
                <div><strong>详细事实：</strong>{auditWhistleItem.description}</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">处置结案状态 *</label>
                <select
                  value={whistleStatus}
                  onChange={e => setWhistleStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="已核实结案">已核实属实 · 正式立案结案并下发奖励</option>
                  <option value="执法核查中">执法核查中 · 取证中</option>
                  <option value="已受理转派">已受理转派 · 指派网格</option>
                  <option value="不属实归档">不属实 · 予以归档</option>
                </select>
              </div>

              {whistleStatus === '已核实结案' && (
                <div className="grid grid-cols-2 gap-3 bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                  <div>
                    <label className="block text-xs font-bold text-amber-900 mb-1">
                      吹哨积分奖励 (1-5分) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      required
                      value={rewardPoints}
                      onChange={e => setRewardPoints(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border border-amber-300 rounded-xl text-xs text-amber-900 font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-amber-900 mb-1">
                      现金/红包激励 (元)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={200}
                      value={rewardCash}
                      onChange={e => setRewardCash(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border border-amber-300 rounded-xl text-xs text-amber-900 font-bold focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">承办执法部门</label>
                <input
                  type="text"
                  required
                  value={whistleDepartment}
                  onChange={e => setWhistleDepartment(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">执法查处结果公示文本 *</label>
                <textarea
                  rows={3}
                  required
                  value={whistleComment}
                  onChange={e => setWhistleComment(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAuditWhistleItem(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  确认办结并推送奖励
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
