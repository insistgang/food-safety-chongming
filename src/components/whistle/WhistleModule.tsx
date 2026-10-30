import React, { useState } from 'react';
import { 
  Megaphone, Bike, Sparkles, ShieldAlert, Camera, MapPin, 
  Clock, Plus, CheckCircle2, AlertCircle, History, Upload, 
  X, Check, Award, Building2, Store, Pill
} from 'lucide-react';
import { 
  UserRole, TownName, CHONGMING_TOWNS, WhistleblowerCategory, 
  WhistleblowerReport, RiderCertification 
} from '../../types';
import { StorageService } from '../../services/storage';
import { useToast } from '../common/Toast';
import { useIsMobile } from '../common/MobileContext';

interface WhistleModuleProps {
  userRole: UserRole;
  currentTown: TownName;
  userPoints: number;
  onPointsChange?: (points: number) => void;
}

const FOOD_ISSUES = [
  '无证/未公示',
  '环境脏乱差',
  '未穿戴工帽口罩',
  '食材落地生熟不分',
  '过期变质食材',
  '店内虫害',
  '无反食品浪费标识',
  '其他'
];

const DRUG_ISSUES = [
  '无证/未公示',
  '经营过期药品化妆品医疗器械',
  '混放未分区',
  '无温湿度计',
  '人员着装不规范',
  '药师不在岗销售处方药',
  '其他'
];

const SAMPLE_EVIDENCE_FOOD = 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?w=600&auto=format&fit=crop&q=80';
const SAMPLE_EVIDENCE_DRUG = 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=600&auto=format&fit=crop&q=80';

export const WhistleModule: React.FC<WhistleModuleProps> = ({
  userRole,
  currentTown,
  userPoints,
  onPointsChange
}) => {
  const isMobile = useIsMobile();
  const { showToast } = useToast();
  const currentUser = StorageService.getUser();
  const [activeTab, setActiveTab] = useState<'whistle' | 'rider_cert' | 'history'>('whistle');

  // Whistleblower Form State
  const [category, setCategory] = useState<WhistleblowerCategory>('food');
  const [targetName, setTargetName] = useState('');
  const [town, setTown] = useState<TownName>(currentTown);
  const [locationAddress, setLocationAddress] = useState('');
  const [incidentTime, setIncidentTime] = useState(() => {
    const now = new Date();
    return `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [evidenceImages, setEvidenceImages] = useState<string[]>([SAMPLE_EVIDENCE_FOOD]);

  // Rider Cert Form State
  const [riderName, setRiderName] = useState(currentUser.name.replace(/（.*）/, '') || '陈建国');
  const [riderPhone, setRiderPhone] = useState(currentUser.phone || '13817658899');
  const [platform, setPlatform] = useState<RiderCertification['platform']>('美团外卖');
  const [riderBadgeNumber, setRiderBadgeNumber] = useState('MT-SH-CM-88391');
  const [badgeImageUrl, setBadgeImageUrl] = useState('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80');

  // History & List
  const [whistles, setWhistles] = useState<WhistleblowerReport[]>(StorageService.getWhistles());
  const [riders, setRiders] = useState<RiderCertification[]>(StorageService.getRiders());

  // Toggle issue selection
  const handleToggleIssue = (issue: string) => {
    if (selectedIssues.includes(issue)) {
      setSelectedIssues(selectedIssues.filter(i => i !== issue));
    } else {
      setSelectedIssues([...selectedIssues, issue]);
    }
  };

  // Switch category
  const handleCategoryChange = (cat: WhistleblowerCategory) => {
    setCategory(cat);
    setSelectedIssues([]);
    // Update default evidence preview
    setEvidenceImages([cat === 'food' ? SAMPLE_EVIDENCE_FOOD : SAMPLE_EVIDENCE_DRUG]);
  };

  // Image upload simulation (local file to dataURL)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setEvidenceImages(prev => [...prev, reader.result as string]);
          showToast('照片凭证已成功添加！');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRiderBadgeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setBadgeImageUrl(reader.result as string);
          showToast('骑手工作工牌照片已更新！');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Whistle Report
  const handleSubmitWhistle = (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetName.trim() || !locationAddress.trim() || !description.trim()) {
      showToast('请完整填写涉事商家/药店名称、地址及详细问题描述', 'error');
      return;
    }
    if (selectedIssues.length === 0) {
      showToast('请至少勾选一项问题类型', 'error');
      return;
    }
    if (evidenceImages.length === 0) {
      showToast('请至少上传或提供 1 张现场照片证据', 'error');
      return;
    }

    const isRider = currentUser.riderCertified || userRole === 'rider';

    StorageService.submitWhistle({
      category,
      reporterType: isRider ? '骑手' : '公众',
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reporterPhone: currentUser.phone,
      targetName,
      town,
      locationAddress,
      issueTypes: selectedIssues,
      description: `【发生时间：${incidentTime}】${description}`,
      evidenceImages
    });

    setWhistles(StorageService.getWhistles());

    // User prompt required:
    // 食品提交后 Toast：「提交成功！感谢您守护崇明食品安全。」药品则把「食品」换成「药品」。
    if (category === 'food') {
      showToast('提交成功！感谢您守护崇明食品安全。', 'success');
    } else {
      showToast('提交成功！感谢您守护崇明药品安全。', 'success');
    }

    // Reset some inputs and jump to history
    setTargetName('');
    setLocationAddress('');
    setDescription('');
    setSelectedIssues([]);
    setActiveTab('history');
  };

  // Submit Rider Certification
  const handleRegisterRider = (e: React.FormEvent) => {
    e.preventDefault();

    if (!riderName.trim() || !riderPhone.trim() || !riderBadgeNumber.trim()) {
      showToast('请完整填写骑手姓名、手机号及平台工号', 'error');
      return;
    }

    StorageService.registerRider({
      userId: currentUser.id,
      riderName,
      phone: riderPhone,
      platform,
      riderBadgeNumber,
      badgeImageUrl: badgeImageUrl || SAMPLE_EVIDENCE_FOOD
    });

    setRiders(StorageService.getRiders());
    showToast(`先锋外卖骑手「${riderName}」认证申请提交成功！平台已为您赋码开通吹哨专区。`);
    setActiveTab('whistle');
  };

  const currentIssueOptions = category === 'food' ? FOOD_ISSUES : DRUG_ISSUES;

  return (
    <div className={isMobile ? "space-y-3.5" : "space-y-6"}>
      {/* Banner */}
      <div className={`bg-gradient-to-r from-amber-700 via-orange-700 to-amber-900 rounded-2xl text-white shadow-md relative overflow-hidden ${
        isMobile ? 'p-4' : 'p-6 sm:p-8'
      }`}>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-amber-200 text-[10px] sm:text-xs font-medium mb-2 backdrop-blur-md">
            <Megaphone className="w-3.5 h-3.5" />
            <span>崇明区移动哨兵 · 食品药品吹哨人监督激励计划</span>
          </div>
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl sm:text-3xl'} font-extrabold tracking-tight mb-1`}>
            食药吹哨 · 移动探针
          </h2>
          <p className={`${isMobile ? 'text-[11px]' : 'text-sm'} text-amber-100/90 leading-relaxed`}>
            后厨脏乱、生熟混放、过期食材一键拍报。立案核实享 1-5 积分与专属红包！
          </p>
        </div>
      </div>

      {/* Points & Identity Card */}
      <div className={`grid gap-2.5 ${isMobile ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3 sm:gap-4'}`}>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-3 text-white shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-100">当前共治积分</span>
            <div className="text-xl font-black mt-0.5">{userPoints} <span className="text-[10px] font-normal text-amber-200">分</span></div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400">吹哨人身份</span>
            <div className="text-xs font-bold text-slate-800 mt-1">
              {currentUser.riderCertified ? (
                <span className="text-emerald-700">先锋骑手哨兵</span>
              ) : (
                <span className="text-slate-600">热心公众</span>
              )}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Bike className="w-4 h-4" />
          </div>
        </div>

        {!isMobile && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">累计提报反馈</span>
              <div className="text-2xl font-black text-slate-800 mt-0.5">
                {whistles.length} <span className="text-xs font-normal text-slate-400">条</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium block mt-1">
                核实结案率: 100% 专人快速受派
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      {isMobile ? (
        <div className="bg-slate-200/80 p-1 rounded-xl flex text-xs font-bold text-center">
          <button
            onClick={() => setActiveTab('whistle')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'whistle' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            即时吹哨
          </button>
          <button
            onClick={() => setActiveTab('rider_cert')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'rider_cert' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            骑手认证
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'history' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            记录 ({whistles.length})
          </button>
        </div>
      ) : (
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('whistle')}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold transition-all relative ${
              activeTab === 'whistle'
                ? 'text-amber-700 border-b-2 border-amber-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            吹哨线索即时提报
          </button>
          <button
            onClick={() => setActiveTab('rider_cert')}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold transition-all relative ${
              activeTab === 'rider_cert'
                ? 'text-amber-700 border-b-2 border-amber-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            外卖先锋骑手身份认证
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold transition-all relative ${
              activeTab === 'history'
                ? 'text-amber-700 border-b-2 border-amber-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            我的吹哨记录与奖励 ({whistles.length})
          </button>
        </div>
      )}

      {/* 1. WHISTLE REPORT FORM */}
      {activeTab === 'whistle' && (
        <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm ${
          isMobile ? 'p-4' : 'p-6 sm:p-8'
        }`}>
          <form onSubmit={handleSubmitWhistle} className="space-y-6">
            {/* Category Toggle */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">吹哨领域类型 *</label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => handleCategoryChange('food')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                    category === 'food'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>餐饮食品安全吹哨</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryChange('drug')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                    category === 'drug'
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Pill className="w-4 h-4" />
                  <span>药店药械安全吹哨</span>
                </button>
              </div>
            </div>

            {/* Target & Town */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {category === 'food' ? '涉事餐饮门店/作坊/摊位名称 *' : '涉事药店/诊所/医疗器械店名称 *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={category === 'food' ? '如：城桥镇xx烧烤店、xx外卖档口' : '如：堡镇xx大药房'}
                  value={targetName}
                  onChange={e => setTargetName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">所在乡镇 *</label>
                <select
                  value={town}
                  onChange={e => setTown(e.target.value as TownName)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                >
                  {CHONGMING_TOWNS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">具体发生/发现时间 *</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={incidentTime}
                    onChange={e => setIncidentTime(e.target.value)}
                    placeholder="如：2024-11-20 12:30"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">门店具体位置与门牌 *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="如：城桥镇八一路210号内街后巷门头"
                    value={locationAddress}
                    onChange={e => setLocationAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Issue Types Multi-select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                涉及安全问题类型（多选）*
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {currentIssueOptions.map(issue => {
                  const selected = selectedIssues.includes(issue);
                  return (
                    <button
                      key={issue}
                      type="button"
                      onClick={() => handleToggleIssue(issue)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-left transition-all ${
                        selected
                          ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                        selected ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {selected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="truncate">{issue}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                现场具体情况详细说明 *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="请详细描述您在取餐或走访中看到的现场违规情形（例如：后厨生熟混放、员工未戴口罩、垃圾桶无盖、阴凉柜未开制冷等）..."
                className="w-full p-3 border border-slate-200 rounded-xl text-xs leading-relaxed text-slate-800 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Evidence Images */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700">
                  现场照片凭证 * <span className="font-normal text-slate-400">(至少上传1张，支持本地拍照或选择图片)</span>
                </label>
                <span className="text-[11px] text-amber-600 font-medium">清晰证据更便于执法人员快速立案</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {evidenceImages.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                    <img src={img} alt="现场证据" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setEvidenceImages(evidenceImages.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/60 text-white hover:bg-rose-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                <label className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 hover:border-amber-500 hover:bg-amber-50/50 flex flex-col items-center justify-center text-slate-400 hover:text-amber-700 cursor-pointer transition-colors">
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-[11px] font-medium">拍照/传图</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>系统已开启严格吹哨人隐私保护，所有举报人个人信息仅供办案执法人员可见</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Megaphone className="w-4 h-4" />
                <span>提交吹哨线索</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. RIDER CERTIFICATION */}
      {activeTab === 'rider_cert' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bike className="w-5 h-5 text-amber-600" />
              外卖先锋骑手·移动哨兵实名认证
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              完成平台工号认证后，线索享有执法绿色通道、优先转派并可领取崇明爱心驿站补给权益。
            </p>
          </div>

          <form onSubmit={handleRegisterRider} className="space-y-5 max-w-xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">骑手真实姓名 *</label>
              <input
                type="text"
                required
                value={riderName}
                onChange={e => setRiderName(e.target.value)}
                placeholder="如：陈建国"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">联系手机号 *</label>
                <input
                  type="tel"
                  required
                  value={riderPhone}
                  onChange={e => setRiderPhone(e.target.value)}
                  placeholder="如：13817658899"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">所属配送平台 *</label>
                <select
                  value={platform}
                  onChange={e => setPlatform(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="美团外卖">美团外卖</option>
                  <option value="饿了么">饿了么</option>
                  <option value="闪送/顺丰同城">闪送/顺丰同城</option>
                  <option value="其他">其他同城配送</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">平台骑手工号 / 账号编号 *</label>
              <input
                type="text"
                required
                value={riderBadgeNumber}
                onChange={e => setRiderBadgeNumber(e.target.value)}
                placeholder="如：MT-SH-CM-88391"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">骑手 App 个人工牌/工作证截图凭证</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                  <img src={badgeImageUrl} alt="工牌照片" className="w-full h-full object-cover" />
                </div>
                <label className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer flex items-center gap-2">
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>上传工牌截屏</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleRiderBadgeUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                提交认证申请
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {whistles.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        item.category === 'food' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                          : 'bg-sky-50 text-sky-800 border border-sky-100'
                      }`}>
                        {item.category === 'food' ? '食品安全' : '药品安全'} · {item.town}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">
                        {item.reporterType}吹哨
                      </span>
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

                  <h4 className="text-sm font-bold text-slate-900 mb-1">{item.targetName}</h4>
                  <p className="text-xs text-slate-400 mb-2">地址：{item.locationAddress}</p>

                  <div className="flex flex-wrap gap-1 mb-2.5">
                    {item.issueTypes.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-medium border border-rose-100">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {/* Evidence thumbnail preview */}
                  {item.evidenceImages.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      {item.evidenceImages.slice(0, 3).map((img, idx) => (
                        <div key={idx} className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200">
                          <img src={img} alt="证据" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Disposal result */}
                  {item.auditComment && (
                    <div className="p-2.5 rounded-xl bg-slate-50 text-xs text-slate-700 border border-slate-100 mb-3 space-y-1">
                      <div className="font-bold text-slate-800">
                        执法处置结论（{item.assignedDepartment || '市场监管执法大队'}）：
                      </div>
                      <p>{item.auditComment}</p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">{item.createdAt}</span>

                  {item.rewardPoints > 0 ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>奖励: +{item.rewardPoints}积分 {item.rewardCash > 0 ? `+¥${item.rewardCash}` : ''}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-[11px]">核实查证后发放奖励</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {whistles.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
              <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">暂无吹哨记录</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
