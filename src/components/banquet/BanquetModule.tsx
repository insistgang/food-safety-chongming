import React, { useState, useMemo } from 'react';
import { 
  UtensilsCrossed, AlertTriangle, ShieldCheck, CheckCircle2, 
  Calendar, MapPin, Users, Phone, User, FileText, Plus, 
  Search, ShieldAlert, Award, Clock, ArrowRight, X, Sparkles
} from 'lucide-react';
import { 
  UserRole, TownName, CHONGMING_TOWNS, BanquetTeam, 
  BanquetDeclaration 
} from '../../types';
import { StorageService } from '../../services/storage';
import { SafetyModal } from './SafetyModal';
import { useToast } from '../common/Toast';
import { useIsMobile } from '../common/MobileContext';

interface BanquetModuleProps {
  userRole: UserRole;
  currentTown: TownName;
  onNavigateToAudit?: () => void;
}

const HIGH_RISK_ITEMS = [
  { keyword: '河豚', label: '河豚（国家明令禁止生产加工高危剧毒水产）' },
  { keyword: '草乌', label: '草乌（含剧毒双酯型乌头碱，严禁作为食材或自制药酒）' },
  { keyword: '鲜黄花菜', label: '鲜黄花菜（鲜品含秋水仙碱，易引起急性中毒）' },
  { keyword: '未煮熟四季豆', label: '未煮熟四季豆（皂素与植物红细胞凝集素中毒风险）' },
  { keyword: '野生菌', label: '野生菌（致死性毒蘑菇极高风险，农村聚餐一律禁止）' }
];

export const BanquetModule: React.FC<BanquetModuleProps> = ({
  userRole,
  currentTown,
  onNavigateToAudit
}) => {
  const isMobile = useIsMobile();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'declare' | 'teams' | 'list'>('declare');

  // Stored state
  const [declarations, setDeclarations] = useState<BanquetDeclaration[]>(StorageService.getBanquetDeclarations());
  const [teams, setTeams] = useState<BanquetTeam[]>(StorageService.getBanquetTeams());

  // Safety Modal state
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);

  // Declaration form state
  const [declarantName, setDeclarantName] = useState('施建明');
  const [declarantPhone, setDeclarantPhone] = useState('13917882233');
  const [reason, setReason] = useState<BanquetDeclaration['reason']>('寿宴');
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [tablesCount, setTablesCount] = useState<number>(18);
  const [estimatedPeople, setEstimatedPeople] = useState<number>(180);
  const [town, setTown] = useState<TownName>(currentTown);
  const [detailedAddress, setDetailedAddress] = useState('城桥镇利民村第3村民小组文化礼堂');
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || '');
  const [menuText, setMenuText] = useState('冷盘：白斩草鸡、崇明白山羊肉、糟凤爪、崇明金瓜丝。\n热菜：红烧生态老鹅、清蒸崇明清水大闸蟹、草乌老鸭汤、未煮熟四季豆炒肉丝、扣三丝。\n点心：崇明印糕、鲜肉汤圆。');

  // Team Registration Form State
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [teamTown, setTeamTown] = useState<TownName>(currentTown);
  const [teamAddress, setTeamAddress] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [cooksCount, setCooksCount] = useState<number>(6);
  const [healthCertCount, setHealthCertCount] = useState<number>(6);

  // Detail Modal
  const [selectedDeclaration, setSelectedDeclaration] = useState<BanquetDeclaration | null>(null);

  // Search & Filter
  const [listSearch, setListSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('全部');

  // Detect high risk foods in real-time
  const detectedRiskFoods = useMemo(() => {
    const detected: string[] = [];
    HIGH_RISK_ITEMS.forEach(item => {
      if (menuText.includes(item.keyword)) {
        detected.push(item.label);
      }
    });
    // Also cover shorthand '四季豆' if '未煮熟四季豆' wasn't already caught
    if (menuText.includes('四季豆') && !menuText.includes('未煮熟四季豆')) {
      detected.push('四季豆（须烧熟煮透，严禁半生不熟大锅翻炒）');
    }
    return detected;
  }, [menuText]);

  // Click submit declaration -> trigger SafetyModal first
  const handlePreSubmitDeclaration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declarantName.trim() || !declarantPhone.trim() || !detailedAddress.trim() || !menuText.trim()) {
      showToast('请完整填写举办人姓名、电话、聚餐地址及菜单明细', 'error');
      return;
    }
    // Open mandatory safety modal
    setIsSafetyModalOpen(true);
  };

  // Confirmed SafetyModal -> actually write to StorageService
  const handleConfirmSafetyModal = () => {
    setIsSafetyModalOpen(false);

    const chosenTeam = teams.find(t => t.id === selectedTeamId);
    const resolvedTeamName = chosenTeam ? chosenTeam.teamName : '自聘农村流动厨师班子';

    const newDec = StorageService.addBanquetDeclaration({
      teamId: selectedTeamId || undefined,
      teamName: resolvedTeamName,
      declarantName,
      declarantPhone,
      reason,
      eventDate,
      tablesCount: Number(tablesCount),
      estimatedPeople: Number(estimatedPeople),
      town,
      detailedAddress,
      menuText,
      riskWarningsDetected: detectedRiskFoods,
      cookHealthCertImages: ['cert_upload_mock_01.jpg'],
      safetyPledgeAgreed: true
    });

    setDeclarations(StorageService.getBanquetDeclarations());
    showToast('家宴申报成功！已自动向所属乡镇食安办推送审核待办。');
    setActiveTab('list');
  };

  // Team register submit
  const handleRegisterTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !leaderName.trim() || !leaderPhone.trim() || !teamAddress.trim()) {
      showToast('请完整填写团队名称、负责人、联系电话及驻地地址', 'error');
      return;
    }

    StorageService.registerBanquetTeam({
      teamName,
      leaderName,
      leaderPhone,
      town: teamTown,
      address: teamAddress,
      licenseNo: licenseNo || `CM-CY-${Date.now().toString().slice(-4)}`,
      cooksCount: Number(cooksCount),
      healthCertCount: Number(healthCertCount)
    });

    setTeams(StorageService.getBanquetTeams());
    setIsTeamModalOpen(false);
    showToast(`办酒团队「${teamName}」资质登记成功！初始信用分100分。`);
    // Reset form
    setTeamName('');
    setLeaderName('');
    setLeaderPhone('');
    setTeamAddress('');
    setLicenseNo('');
  };

  // Filter declarations
  const filteredDeclarations = declarations.filter(item => {
    const matchSearch = item.declarantName.includes(listSearch) ||
                        item.teamName.includes(listSearch) ||
                        item.town.includes(listSearch) ||
                        item.detailedAddress.includes(listSearch);
    const matchStatus = statusFilter === '全部' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className={isMobile ? "space-y-3.5" : "space-y-6"}>
      {/* Top Banner */}
      <div className={`bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 rounded-2xl text-white shadow-md relative overflow-hidden ${
        isMobile ? 'p-4' : 'p-6 sm:p-8'
      }`}>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-200 text-[10px] sm:text-xs font-medium mb-2 backdrop-blur-md">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>崇明区农村集体聚餐（安心家宴）全程监管体系</span>
          </div>
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl sm:text-3xl'} font-extrabold tracking-tight mb-1`}>
            安心家宴 · 阳光报备
          </h2>
          <p className={`${isMobile ? 'text-[11px]' : 'text-sm'} text-emerald-100/90 leading-relaxed`}>
            落实举办者责任与大厨自查，严守高危违禁菜品红线，保障全岛红白宴席安全。
          </p>
        </div>
      </div>

      {/* Module Sub-tabs */}
      {isMobile ? (
        <div className="bg-slate-200/80 p-1 rounded-xl flex text-xs font-bold text-center">
          <button
            onClick={() => setActiveTab('declare')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'declare' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            在线申报
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'list' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            台账 ({declarations.length})
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'teams' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            队伍 ({teams.length})
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('declare')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'declare'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              聚餐在线申报
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'list'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              申报记录台账 ({declarations.length})
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'teams'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              认证一条龙队伍 ({teams.length})
            </button>
          </div>

          {activeTab === 'teams' && (
            <button
              onClick={() => setIsTeamModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>新团队登记备案</span>
            </button>
          )}
        </div>
      )}

      {/* 1. DECLARATION FORM TAB */}
      {activeTab === 'declare' && (
        <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm ${
          isMobile ? 'p-4' : 'p-6 sm:p-8'
        }`}>
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              农村集体聚餐安全信息报备表
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              就餐人数 50 人以上或 5 桌以上须提前 3-7 日报备，系统已开启高危违规食材 AI 智能拦截
            </p>
          </div>

          <form onSubmit={handlePreSubmitDeclaration} className="space-y-6">
            {/* Base info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">举办人姓名 *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={declarantName}
                    onChange={e => setDeclarantName(e.target.value)}
                    placeholder="如：施建明"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">联系电话 *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={declarantPhone}
                    onChange={e => setDeclarantPhone(e.target.value)}
                    placeholder="如：13917882233"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">聚餐事由 *</label>
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="婚宴">婚宴</option>
                  <option value="寿宴">寿宴</option>
                  <option value="满月周岁">满月周岁</option>
                  <option value="乔迁新居">乔迁新居</option>
                  <option value="白事">白事</option>
                  <option value="其他宗族聚会">其他宗族聚会</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">聚餐日期 *</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">申报桌数 *</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={tablesCount}
                  onChange={e => {
                    const count = Number(e.target.value);
                    setTablesCount(count);
                    setEstimatedPeople(count * 10);
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">预计就餐人数 *</label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min={1}
                    required
                    value={estimatedPeople}
                    onChange={e => setEstimatedPeople(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Location & Team */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">所属乡镇 *</label>
                <select
                  value={town}
                  onChange={e => setTown(e.target.value as TownName)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  {CHONGMING_TOWNS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">承办“一条龙”餐饮服务队</label>
                <select
                  value={selectedTeamId}
                  onChange={e => setSelectedTeamId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- 自聘乡村厨师班子（未入库） --</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.teamName}（负责人：{t.leaderName} · 信用：{t.score}分）
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">聚餐举办详细地址 *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={detailedAddress}
                  onChange={e => setDetailedAddress(e.target.value)}
                  placeholder="如：城桥镇利民村第3村民小组文化礼堂或某自建院落"
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Menu Text with High Risk AI Detection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  聚餐菜单明细 * <span className="font-normal text-slate-400">(系统自动进行禁令菜品核验)</span>
                </label>
                {detectedRiskFoods.length > 0 && (
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-1 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    已检测到 {detectedRiskFoods.length} 项高风险禁令食材！
                  </span>
                )}
              </div>

              <textarea
                rows={4}
                required
                value={menuText}
                onChange={e => setMenuText(e.target.value)}
                placeholder="请输入拟办家宴完整菜单..."
                className={`w-full p-3 border rounded-xl text-xs leading-relaxed transition-colors ${
                  detectedRiskFoods.length > 0
                    ? 'border-rose-400 bg-rose-50/30 text-rose-950 focus:border-rose-600'
                    : 'border-slate-200 text-slate-800 focus:border-emerald-500'
                }`}
              />

              {/* Red warning alert card */}
              {detectedRiskFoods.length > 0 && (
                <div className="mt-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-1.5 animate-in fade-in">
                  <div className="font-bold flex items-center gap-1.5 text-rose-700">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>【系统高危警示】菜单中包含下列禁止或高风险食材，请务必核实并剔除：</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-rose-800 pl-1 font-medium">
                    {detectedRiskFoods.map((item, idx) => (
                      <li key={idx} className="font-semibold text-rose-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-rose-600 mt-1">
                    注：带有风险食材的申报将在乡镇初审时被重点审查并要求整改，请举办人及大厨严格遵守《崇明区农村集体聚餐食品安全规程》。
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>点击提交前需按规定签署《食品安全核心禁令承诺书》（倒计时+阅读到底）</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>下一步：签署承诺并提交</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. DECLARATIONS LIST TAB */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {['全部', '待乡镇审核', '乡镇已通过', '现场核查中', '已驳回', '整改合格'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    statusFilter === status
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="relative sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索举办人/团队/地址..."
                value={listSearch}
                onChange={e => setListSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* List Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDeclarations.map(dec => {
              const hasRisk = dec.riskWarningsDetected && dec.riskWarningsDetected.length > 0;
              return (
                <div
                  key={dec.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                          {dec.town}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                          {dec.reason} · {dec.tablesCount}桌 / {dec.estimatedPeople}人
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        dec.status === '乡镇已通过'
                          ? 'bg-emerald-100 text-emerald-800'
                          : dec.status === '待乡镇审核'
                          ? 'bg-amber-100 text-amber-800'
                          : dec.status === '现场核查中'
                          ? 'bg-sky-100 text-sky-800'
                          : dec.status === '整改合格'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {dec.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                      举办人：{dec.declarantName}（{dec.declarantPhone}）
                    </h4>
                    <p className="text-xs text-slate-500 mb-2">
                      承办团队：<strong className="text-slate-700">{dec.teamName}</strong>
                    </p>

                    <div className="text-xs text-slate-600 space-y-1 mb-3">
                      <div className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>举办日期：{dec.eventDate}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">地点：{dec.detailedAddress}</span>
                      </div>
                    </div>

                    {hasRisk && (
                      <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-medium mb-3">
                        <div className="font-bold flex items-center gap-1 text-rose-600">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>命中风险食材预警：</span>
                        </div>
                        <div>{dec.riskWarningsDetected.join('、')}</div>
                      </div>
                    )}

                    {dec.auditNote && (
                      <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600 text-xs mb-3">
                        <span className="font-bold text-slate-700">乡镇审核意见：</span>
                        {dec.auditNote}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">申报时间：{dec.createdAt}</span>
                    <button
                      onClick={() => setSelectedDeclaration(dec)}
                      className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 text-emerald-700 rounded-lg font-medium transition-colors"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDeclarations.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
              <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">暂无符合条件的申报记录</p>
            </div>
          )}
        </div>
      )}

      {/* 3. TEAMS LIST TAB */}
      {activeTab === 'teams' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map(team => (
              <div
                key={team.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                      {team.town}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>信用分: {team.score}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">{team.teamName}</h3>
                  <p className="text-xs text-slate-400 font-mono mb-3">资质证号：{team.licenseNo}</p>

                  <div className="text-xs text-slate-600 space-y-1.5 mb-4">
                    <p>负责人：<strong className="text-slate-800">{team.leaderName}</strong>（{team.leaderPhone}）</p>
                    <p>队伍地址：{team.address}</p>
                    <div className="flex items-center gap-3 pt-1">
                      <span className="px-2 py-1 rounded bg-slate-50 text-slate-700 text-[11px]">
                        厨师帮工：<strong>{team.cooksCount}</strong> 人
                      </span>
                      <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-[11px]">
                        持有效健康证：<strong>{team.healthCertCount}</strong> 人
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    team.status === '已认证'
                      ? 'bg-emerald-100 text-emerald-800'
                      : team.status === '待审核'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {team.status}
                  </span>

                  {(userRole === 'town_admin' || userRole === 'district_admin') && onNavigateToAudit && (
                    <button
                      onClick={onNavigateToAudit}
                      className="text-xs text-sky-600 hover:text-sky-700 font-medium"
                    >
                      监管扣分考核 ➔
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safety Pledge Modal (Mandatory 5s + Scroll to bottom) */}
      <SafetyModal
        isOpen={isSafetyModalOpen}
        onConfirm={handleConfirmSafetyModal}
        onCancel={() => setIsSafetyModalOpen(false)}
      />

      {/* Register Team Modal */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">农村家宴一条龙餐饮队资质备案</h3>
              <button
                onClick={() => setIsTeamModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">团队名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="如：崇明新河镇传统喜宴餐饮大厨队"
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">带头人/负责人 *</label>
                  <input
                    type="text"
                    required
                    placeholder="如：黄师傅"
                    value={leaderName}
                    onChange={e => setLeaderName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">联系电话 *</label>
                  <input
                    type="tel"
                    required
                    placeholder="如：13816654321"
                    value={leaderPhone}
                    onChange={e => setLeaderPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">所属乡镇</label>
                  <select
                    value={teamTown}
                    onChange={e => setTeamTown(e.target.value as TownName)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    {CHONGMING_TOWNS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">食品经营许可证/备案号 (可选)</label>
                  <input
                    type="text"
                    placeholder="如：CM-CY-2024-0099"
                    value={licenseNo}
                    onChange={e => setLicenseNo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">驻地详细地址 *</label>
                <input
                  type="text"
                  required
                  placeholder="如：新河镇富盛路128号"
                  value={teamAddress}
                  onChange={e => setTeamAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">厨师及帮工总人数</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={cooksCount}
                    onChange={e => setCooksCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">有效健康合格证明人数</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={healthCertCount}
                    onChange={e => setHealthCertCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  确认备案入库
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Declaration Detail Modal */}
      {selectedDeclaration && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2 inline-block">
                  {selectedDeclaration.town} · {selectedDeclaration.reason}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedDeclaration.declarantName}的家宴报备详情
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">单号：{selectedDeclaration.id}</p>
              </div>
              <button
                onClick={() => setSelectedDeclaration(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl">
                <div>
                  <span className="text-slate-400 block mb-0.5">举办日期</span>
                  <span className="font-bold text-slate-800">{selectedDeclaration.eventDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">规模</span>
                  <span className="font-bold text-slate-800">{selectedDeclaration.tablesCount} 桌 / {selectedDeclaration.estimatedPeople} 人</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">承办队伍</span>
                  <span className="font-bold text-slate-800">{selectedDeclaration.teamName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">举办人电话</span>
                  <span className="font-bold text-slate-800">{selectedDeclaration.declarantPhone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block mb-0.5">聚餐详细地点</span>
                  <span className="font-bold text-slate-800">{selectedDeclaration.detailedAddress}</span>
                </div>
              </div>

              {/* Menu */}
              <div>
                <h4 className="font-bold text-slate-800 mb-1.5">报备菜单明细</h4>
                <div className="p-3 bg-slate-50 rounded-xl text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedDeclaration.menuText}
                </div>
              </div>

              {/* Warnings */}
              {selectedDeclaration.riskWarningsDetected.length > 0 && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
                  <span className="font-bold text-rose-700 block mb-1">系统预警拦截高危食材：</span>
                  <ul className="list-disc list-inside">
                    {selectedDeclaration.riskWarningsDetected.map((w, idx) => (
                      <li key={idx} className="font-medium">{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Audit history */}
              {selectedDeclaration.auditNote && (
                <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl text-sky-900">
                  <div className="font-bold mb-1">乡镇监管人员审核意见：</div>
                  <p>{selectedDeclaration.auditNote}</p>
                  {selectedDeclaration.auditorName && (
                    <div className="text-right text-[11px] text-sky-600 mt-1">审核人：{selectedDeclaration.auditorName}</div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedDeclaration(null)}
                className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
