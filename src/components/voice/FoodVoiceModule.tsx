import React, { useState } from 'react';
import { 
  Sparkles, Bus, HeartHandshake, Calendar, Search, 
  HelpCircle, ShieldCheck, UserPlus, Check, X, Plus 
} from 'lucide-react';
import { ActivityItem, AntiRumorItem, UserRole } from '../../types';
import { StorageService } from '../../services/storage';
import { useToast } from '../common/Toast';
import { useIsMobile } from '../common/MobileContext';

interface FoodVoiceModuleProps {
  userRole: UserRole;
}

export const FoodVoiceModule: React.FC<FoodVoiceModuleProps> = ({ userRole }) => {
  const isMobile = useIsMobile();
  const { showToast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<'brand' | 'activities' | 'rumors'>('brand');
  const [activities, setActivities] = useState<ActivityItem[]>(StorageService.getActivities());
  const [rumors, setRumors] = useState<AntiRumorItem[]>(StorageService.getRumors());
  const [rumorSearch, setRumorSearch] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<string>('全部');

  // Add rumor state
  const [isAddRumorOpen, setIsAddRumorOpen] = useState(false);
  const [newRumorText, setNewRumorText] = useState('');
  const [newTruthText, setNewTruthText] = useState('');
  const [newSeason, setNewSeason] = useState<AntiRumorItem['season']>('四季常识');
  const [newCategory, setNewCategory] = useState<AntiRumorItem['category']>('果蔬农残');
  const [newExpertVoice, setNewExpertVoice] = useState('');

  const handleEnroll = (activity: ActivityItem) => {
    if (activity.enrolled >= activity.quota) {
      showToast('该场次名额已满，请留意下期发布！', 'info');
      return;
    }
    const success = StorageService.enrollActivity(activity.id);
    if (success) {
      setActivities(StorageService.getActivities());
      showToast(`报名成功！已为您预约「${activity.title}」，请按时参加。`);
    }
  };

  const handleAddRumor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRumorText.trim() || !newTruthText.trim()) {
      showToast('请完整输入谣言内容与科学真相', 'error');
      return;
    }

    StorageService.addRumor({
      rumor: newRumorText,
      truth: newTruthText,
      season: newSeason,
      category: newCategory,
      expertVoice: newExpertVoice || '崇明区市场监督管理局食品监管科'
    });

    setRumors(StorageService.getRumors());
    setIsAddRumorOpen(false);
    setNewRumorText('');
    setNewTruthText('');
    setNewExpertVoice('');
    showToast('科普辟谣内容已成功发布上线！');
  };

  const filteredRumors = rumors.filter(r => {
    const matchSeason = selectedSeason === '全部' || r.season === selectedSeason;
    const matchSearch = r.rumor.toLowerCase().includes(rumorSearch.toLowerCase()) ||
                        r.truth.toLowerCase().includes(rumorSearch.toLowerCase()) ||
                        r.category.toLowerCase().includes(rumorSearch.toLowerCase());
    return matchSeason && matchSearch;
  });

  return (
    <div className={isMobile ? "space-y-3.5" : "space-y-6"}>
      {/* Sub Tabs */}
      {isMobile ? (
        <div className="bg-slate-200/80 p-1 rounded-xl flex text-xs font-bold text-center">
          <button
            onClick={() => setActiveSubTab('brand')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'brand' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            生态IP
          </button>
          <button
            onClick={() => setActiveSubTab('activities')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'activities' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            品牌活动
          </button>
          <button
            onClick={() => setActiveSubTab('rumors')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'rumors' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            科普辟谣
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between border-b border-slate-200">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveSubTab('brand')}
              className={`pb-3 text-sm font-semibold transition-all relative ${
                activeSubTab === 'brand'
                  ? 'text-emerald-700 border-b-2 border-emerald-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              品牌形象与生态IP
            </button>
            <button
              onClick={() => setActiveSubTab('activities')}
              className={`pb-3 text-sm font-semibold transition-all relative ${
                activeSubTab === 'activities'
                  ? 'text-emerald-700 border-b-2 border-emerald-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              品牌活动与预告（“食”光巴士/爱心共享站）
            </button>
            <button
              onClick={() => setActiveSubTab('rumors')}
              className={`pb-3 text-sm font-semibold transition-all relative ${
                activeSubTab === 'rumors'
                  ? 'text-emerald-700 border-b-2 border-emerald-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              科普辟谣专栏（谣言粉碎机）
            </button>
          </div>
        </div>
      )}

      {/* 1. BRAND IP SECTION */}
      {activeSubTab === 'brand' && (
        <div className={isMobile ? "space-y-3" : "space-y-6"}>
          <div className={`bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 rounded-2xl text-white relative overflow-hidden shadow-md ${
            isMobile ? 'p-4' : 'p-8 rounded-3xl'
          }`}>
            <div className="max-w-2xl relative z-10 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-100 text-[10px] font-semibold backdrop-blur-md">
                崇明世界级生态岛 · 食安品牌工程
              </span>
              <h2 className={`${isMobile ? 'text-xl' : 'text-3xl sm:text-4xl'} font-extrabold tracking-tight`}>
                “食安崇明，瀛洲共治”
              </h2>
              <p className={`text-emerald-100/90 ${isMobile ? 'text-[11px]' : 'text-sm'} leading-relaxed`}>
                依托崇明生态岛优质生态底色，打造“从农田到餐桌、从后厨到街巷”的全链条阳光共治网络。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
                瀛
              </div>
              <h3 className="font-bold text-slate-900 text-base">食安IP吉祥物「瀛小安」</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                以崇明生态金瓜与清澈东滩水为灵感造型，佩戴食品快检徽章与电子探针，象征智慧科技与绿色生态的严密守护。
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Bus className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">流动科普「“食”光巴士」</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                穿梭于崇明16个乡镇的专业流动快检与宣教大巴，配备专业仪器，提供免费农残检测、现场辟谣与亲子互动体验。
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">食物爱心共享站</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                践行《反食品浪费法》，联合崇明生鲜商超与优质餐饮，在骑手驿站设立标准化冷藏共享货架，向劳动者免费补给。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACTIVITIES SECTION */}
      {activeSubTab === 'activities' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activities.map(act => (
              <div key={act.id} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                  <img
                    src={act.image}
                    alt={act.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-emerald-800 shadow-sm backdrop-blur-sm">
                      {act.type}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm ${
                      act.status === '报名中'
                        ? 'bg-emerald-500 text-white'
                        : act.status === '进行中'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-500 text-white'
                    }`}>
                      {act.status}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-2">{act.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-3">
                      {act.description}
                    </p>
                    <div className="space-y-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>时间：{act.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 flex items-center justify-center text-slate-400 font-bold">📍</span>
                        <span>地点：{act.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs">
                      <span className="text-slate-400">已报名：</span>
                      <strong className="text-emerald-700">{act.enrolled}</strong>
                      <span className="text-slate-400"> / {act.quota} 人</span>
                    </div>

                    <button
                      disabled={act.status === '已结束'}
                      onClick={() => handleEnroll(act)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-colors ${
                        act.status === '已结束'
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {act.status === '已结束' ? '活动已结束' : '立即报名预约'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ANTI-RUMORS SECTION */}
      {activeSubTab === 'rumors' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              {['全部', '四季常识', '春夏高发', '秋冬警示', '节日特辑'].map(season => (
                <button
                  key={season}
                  onClick={() => setSelectedSeason(season)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedSeason === season
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {season}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索谣言关键字、食品成分..."
                  value={rumorSearch}
                  onChange={(e) => setRumorSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
                />
              </div>

              {(userRole === 'town_admin' || userRole === 'district_admin') && (
                <button
                  onClick={() => setIsAddRumorOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>发布辟谣</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRumors.map(rumor => (
              <div
                key={rumor.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                      谣言粉碎 #{rumor.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {rumor.season} · {rumor.publishedAt}
                    </span>
                  </div>

                  {/* Rumor statement */}
                  <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-3 text-xs text-rose-900 font-semibold mb-3 flex items-start gap-2">
                    <span className="text-rose-500 font-bold">【网络传闻】</span>
                    <span>{rumor.rumor}</span>
                  </div>

                  {/* Truth explanation */}
                  <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-900 leading-relaxed flex items-start gap-2">
                    <span className="text-emerald-600 font-bold flex-shrink-0">【科学真相】</span>
                    <span>{rumor.truth}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="italic text-[11px] text-slate-500">权威发声：{rumor.expertVoice}</span>
                  <span>{rumor.reads} 次阅读</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Rumor Modal */}
      {isAddRumorOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">发布食药科普辟谣条目</h3>
              <button
                onClick={() => setIsAddRumorOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRumor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">传闻谣言内容 *</label>
                <input
                  type="text"
                  required
                  placeholder="如：香蕉不能和酸奶一起吃会产生剧毒？"
                  value={newRumorText}
                  onChange={e => setNewRumorText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">时令场景</label>
                  <select
                    value={newSeason}
                    onChange={e => setNewSeason(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="四季常识">四季常识</option>
                    <option value="春夏高发">春夏高发</option>
                    <option value="秋冬警示">秋冬警示</option>
                    <option value="节日特辑">节日特辑</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">所属专业门类</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="果蔬农残">果蔬农残</option>
                    <option value="肉类安全">肉类安全</option>
                    <option value="食品添加剂">食品添加剂</option>
                    <option value="保健陷阱">保健陷阱</option>
                    <option value="药械误区">药械误区</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">权威声音出处</label>
                <input
                  type="text"
                  placeholder="如：上海市农业生物基因中心 专家组"
                  value={newExpertVoice}
                  onChange={e => setNewExpertVoice(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">科学真相与机理解析 *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="深入浅出阐述实验数据与科学机理，指导公众正确防护..."
                  value={newTruthText}
                  onChange={e => setNewTruthText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddRumorOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  确认发布
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
