import React, { useState } from 'react';
import { 
  Search, BookOpen, Download, FileText, Plus, Eye, 
  Tag, Calendar, Check, ExternalLink, X 
} from 'lucide-react';
import { PolicyItem, UserRole } from '../../types';
import { StorageService } from '../../services/storage';
import { useToast } from '../common/Toast';
import { useIsMobile } from '../common/MobileContext';

interface PolicyModuleProps {
  userRole: UserRole;
}

export const PolicyModule: React.FC<PolicyModuleProps> = ({ userRole }) => {
  const isMobile = useIsMobile();
  const { showToast } = useToast();
  const [policies, setPolicies] = useState<PolicyItem[]>(StorageService.getPolicies());
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New policy form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<PolicyItem['category']>('规范性文件');
  const [newDocNumber, setNewDocNumber] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newContent, setNewContent] = useState('');

  const categories = ['全部', '法律法规', '部门规章', '规范性文件', '国家标准', '地方规范'];

  const filtered = policies.filter(item => {
    const matchCategory = activeCategory === '全部' || item.category === activeCategory;
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.docNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const handleAddPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      showToast('请完整填写标题与正文内容', 'error');
      return;
    }

    const created = StorageService.addPolicy({
      title: newTitle,
      category: newCategory,
      docNumber: newDocNumber || '崇食药安办字〔2024〕自拟',
      publishDate: new Date().toISOString().split('T')[0],
      tags: newTags ? newTags.split(/[,， ]+/).filter(Boolean) : ['政策发布'],
      content: newContent
    });

    setPolicies(StorageService.getPolicies());
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewDocNumber('');
    setNewTags('');
    showToast('政策法规已成功发布并在平台生效！');
  };

  const handleDownload = (policy: PolicyItem) => {
    showToast(`正在模拟下载：《${policy.title}》（文号：${policy.docNumber}）...`);
  };

  return (
    <div className={isMobile ? "space-y-3.5" : "space-y-6"}>
      {/* Header Banner */}
      <div className={`bg-gradient-to-r from-emerald-800 to-teal-800 rounded-2xl text-white shadow-md relative overflow-hidden ${
        isMobile ? 'p-4' : 'p-6 sm:p-8'
      }`}>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-200 text-[10px] sm:text-xs font-medium mb-1.5 backdrop-blur-md">
            <BookOpen className="w-3.5 h-3.5" />
            <span>崇明区食品药品政策法规与标准库</span>
          </div>
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl sm:text-3xl'} font-extrabold tracking-tight mb-1`}>
            权威法典 · 规范指引
          </h2>
          <p className={`${isMobile ? 'text-[11px]' : 'text-sm'} text-emerald-100/90 leading-relaxed`}>
            收录国家基本法、上海市农村集体聚餐办法、骑手吹哨人制度与国家标准。
          </p>
        </div>
      </div>

      {/* Filter and Action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Publish button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索法规标题/文号/标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
            />
          </div>

          {(userRole === 'town_admin' || userRole === 'district_admin') && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>发布新法规</span>
            </button>
          )}
        </div>
      </div>

      {/* Policy Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(policy => (
          <div
            key={policy.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {policy.category}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {policy.publishDate}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-1.5">
                {policy.title}
              </h3>
              <p className="text-xs text-slate-400 font-mono mb-3">
                文号：{policy.docNumber}
              </p>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                {policy.content}
              </p>
            </div>

            <div>
              <div className="flex flex-wrap gap-1 mb-4">
                {policy.tags.map((tag, i) => (
                  <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <Eye className="w-3.5 h-3.5" />
                  {policy.views} 次查阅
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(policy)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    title="下载规范文本"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedPolicy(policy)}
                    className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 text-emerald-700 font-medium rounded-lg text-xs transition-colors"
                  >
                    详情研读
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">未找到匹配的政策法规内容</p>
        </div>
      )}

      {/* Policy Detail Modal */}
      {selectedPolicy && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2 inline-block">
                  {selectedPolicy.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{selectedPolicy.title}</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">发文字号：{selectedPolicy.docNumber} · 发布日期：{selectedPolicy.publishDate}</p>
              </div>
              <button
                onClick={() => setSelectedPolicy(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed max-h-[50vh] overflow-y-auto mb-6 whitespace-pre-wrap">
              {selectedPolicy.content}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <div className="flex gap-1.5">
                {selectedPolicy.tags.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(selectedPolicy)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  下载全文
                </button>
                <button
                  onClick={() => setSelectedPolicy(null)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  已读关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Policy Modal (Admin only) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">发布新政策法规/标准条目</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPolicy} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">法规标题 *</label>
                <input
                  type="text"
                  required
                  placeholder="如：崇明区绿色食品安全保障若干措施"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">类别分类</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="法律法规">法律法规</option>
                    <option value="部门规章">部门规章</option>
                    <option value="规范性文件">规范性文件</option>
                    <option value="国家标准">国家标准</option>
                    <option value="地方规范">地方规范</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">发文字号 / 标准号</label>
                  <input
                    type="text"
                    placeholder="如：崇食药安委〔2024〕5号"
                    value={newDocNumber}
                    onChange={e => setNewDocNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">主题标签 (逗号分隔)</label>
                <input
                  type="text"
                  placeholder="如：绿色生态, 监管标准, 专项整治"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">正文详细内容 *</label>
                <textarea
                  required
                  rows={5}
                  placeholder="请输入法规完整释义、工作重点及法律效力..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
