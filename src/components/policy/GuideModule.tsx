import React, { useState } from 'react';
import { 
  FileCheck2, Clock, Phone, MapPin, CheckCircle, 
  ArrowRight, Download, Info, ChevronRight, HelpCircle 
} from 'lucide-react';
import { GuideItem } from '../../types';
import { StorageService } from '../../services/storage';
import { useToast } from '../common/Toast';
import { useIsMobile } from '../common/MobileContext';

export const GuideModule: React.FC = () => {
  const isMobile = useIsMobile();
  const { showToast } = useToast();
  const guides: GuideItem[] = StorageService.getGuides();
  const [selectedGuide, setSelectedGuide] = useState<GuideItem>(guides[0]);

  const handleDownloadTemplate = (materialName: string) => {
    showToast(`正在下载申请示范文本表格：${materialName}`);
  };

  return (
    <div className={isMobile ? "space-y-3.5" : "space-y-6"}>
      {/* Top Banner */}
      <div className={`bg-gradient-to-r from-teal-800 to-cyan-900 rounded-2xl text-white shadow-md ${
        isMobile ? 'p-4' : 'p-6 sm:p-8'
      }`}>
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-cyan-200 text-[10px] sm:text-xs font-medium mb-1.5 backdrop-blur-md">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>崇明区食品药品便民办事一站式指引</span>
          </div>
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl sm:text-3xl'} font-extrabold tracking-tight mb-1`}>
            政务指南 · 一件事一次办
          </h2>
          <p className={`${isMobile ? 'text-[11px]' : 'text-sm'} text-cyan-100/90 leading-relaxed`}>
            涵盖农村集体聚餐报备、小餐饮便民备案、食品生产经营许可证申领。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Nav list */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-3">
              业务指南清单
            </h3>
            <div className="space-y-1">
              {guides.map(item => {
                const active = selectedGuide.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedGuide(item)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${
                      active
                        ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="text-xs sm:text-sm">{item.title}</div>
                      <div className={`text-[11px] mt-0.5 ${active ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {item.category} · {item.processingTime}
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4 text-emerald-900">
            <div className="flex items-center gap-2 mb-2 font-bold text-xs">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>办事疑问线上专员</span>
            </div>
            <p className="text-xs text-emerald-700 leading-relaxed mb-3">
              若在准备材料或申报过程中遇到任何疑问，欢迎致电崇明各乡镇市场监督管理所或区食药安办专线咨询。
            </p>
            <div className="text-xs font-mono font-semibold bg-white/80 px-3 py-1.5 rounded-lg border border-emerald-200 inline-block">
              ☎ 021-59621120
            </div>
          </div>
        </div>

        {/* Right Detail Content */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-5">
            <div className="inline-block px-2.5 py-1 rounded bg-teal-50 text-teal-800 text-xs font-semibold mb-2">
              {selectedGuide.category}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              {selectedGuide.title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 办理时限
                </span>
                <span className="font-semibold text-slate-800">{selectedGuide.processingTime}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> 咨询热线
                </span>
                <span className="font-semibold text-slate-800">{selectedGuide.contactPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> 办理地点
                </span>
                <span className="font-semibold text-slate-800">{selectedGuide.handlingPlace}</span>
              </div>
            </div>
          </div>

          {/* Process Flow Steps */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              办理流程与关键节点
            </h3>

            <div className="relative pl-6 border-l-2 border-emerald-200 space-y-6 my-4">
              {selectedGuide.steps.map(s => (
                <div key={s.step} className="relative">
                  <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center ring-4 ring-white">
                    {s.step}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800">{s.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 font-mono flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>流程概览：{selectedGuide.flowchartDesc}</span>
            </div>
          </div>

          {/* Materials checklist */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              申请材料清单与要点
            </h3>

            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
              {selectedGuide.materials.map((m, idx) => (
                <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-slate-50/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-800">{m.name}</span>
                      {m.required ? (
                        <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 text-[10px] font-semibold">
                          必需
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 text-[10px]">
                          条件提供
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{m.tip}</p>
                  </div>
                  <button
                    onClick={() => handleDownloadTemplate(m.name)}
                    className="self-start sm:self-auto flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 text-xs font-medium transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>规范模版</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
