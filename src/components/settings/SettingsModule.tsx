import React, { useState } from 'react';
import { 
  Settings, Phone, Shield, Building2, Bell, RotateCcw, 
  Check, Info, Sparkles, ChevronRight, AlertCircle, FileCheck
} from 'lucide-react';
import { UserRole, TownName, NotificationMsg } from '../../types';
import { StorageService } from '../../services/storage';
import { useToast } from '../common/Toast';
import { useIsMobile } from '../common/MobileContext';

interface SettingsModuleProps {
  userRole: UserRole;
  currentTown: TownName;
  onResetAll: () => void;
  onNotificationChange?: () => void;
  onNavigateToAudit?: () => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  userRole,
  currentTown,
  onResetAll,
  onNotificationChange,
  onNavigateToAudit
}) => {
  const isMobile = useIsMobile();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<NotificationMsg[]>(StorageService.getNotifications());
  const [filterType, setFilterType] = useState<string>('all');

  const handleMarkRead = (id: string) => {
    StorageService.markNotificationRead(id);
    const updated = StorageService.getNotifications();
    setNotifications(updated);
    onNotificationChange?.();
    showToast('该通知消息已标记为已读');
  };

  const handleMarkAllRead = () => {
    notifications.forEach(n => {
      if (!n.read) StorageService.markNotificationRead(n.id);
    });
    setNotifications(StorageService.getNotifications());
    onNotificationChange?.();
    showToast('所有通知消息已全部标记为已读！');
  };

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'unread') return !n.read;
    if (filterType === 'banquet') return n.type === 'banquet';
    if (filterType === 'whistle') return n.type === 'whistle';
    return true;
  });

  return (
    <div className={isMobile ? "space-y-3.5" : "space-y-6"}>
      {/* Top Banner */}
      <div className={`bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl text-white shadow-md ${
        isMobile ? 'p-4' : 'p-6 sm:p-8'
      }`}>
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-[10px] sm:text-xs font-medium mb-1.5 backdrop-blur-md">
            <Settings className="w-3.5 h-3.5" />
            <span>崇明区食品药品安全数字化平台 · 系统配置</span>
          </div>
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl sm:text-3xl'} font-extrabold tracking-tight mb-1`}>
            平台管理配置 · 消息总线
          </h2>
          <p className={`${isMobile ? 'text-[11px]' : 'text-sm'} text-slate-300 leading-relaxed`}>
            管理全岛 16 乡镇网格分流推送、政务咨询热线与系统演示数据重置。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Platform Profile & Contacts */}
        <div className="lg:col-span-5 space-y-5">
          {/* Platform Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              平台基本架构信息
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">平台全称</span>
                <span className="font-bold text-slate-800">食安崇明·智慧监管与公众共治数字化平台</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">主管单位</span>
                <span className="font-semibold text-slate-800">崇明区食品药品安全委员会办公室</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">技术架构</span>
                <span className="font-mono text-slate-800">Vite + React + Tailwind + LocalStorage</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">数据隔离</span>
                <span className="text-emerald-700 font-semibold">16 乡镇网格化自动路由分流</span>
              </div>
            </div>
          </div>

          {/* Hotline & Consultations */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-sky-600" />
              政务热线与咨询电话
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">崇明区食药安办专线（家宴报备）</div>
                  <div className="text-[11px] text-slate-400">工作日 08:30 - 17:00</div>
                </div>
                <div className="font-mono font-bold text-emerald-700 text-sm">
                  021-59621120
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">上海市政务服务便民热线</div>
                  <div className="text-[11px] text-slate-400">24小时市民热线</div>
                </div>
                <div className="font-mono font-bold text-sky-700 text-sm">
                  12345
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">全国市场监管投诉举报电话</div>
                  <div className="text-[11px] text-slate-400">假冒伪劣 / 吹哨直通</div>
                </div>
                <div className="font-mono font-bold text-amber-700 text-sm">
                  12315
                </div>
              </div>
            </div>
          </div>

          {/* Role Explanations */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              管理员角色权能规范
            </h3>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100">
                <div className="font-bold text-sky-900 mb-0.5">乡镇管理员 (town_admin)</div>
                <p>
                  按属地网格管辖，仅可见本乡镇的家宴申报件与吹哨线索。负责现场踏勘、大厨健康证复核及信用记分。
                </p>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                <div className="font-bold text-indigo-900 mb-0.5">区食药安办全局管理员 (district_admin)</div>
                <p>
                  统领全岛 16 个乡镇宏观监管态势，支持跨乡镇线索检索、查处裁决、全区数据导出与应急指令发布。
                </p>
              </div>
            </div>
          </div>

          {/* Reset Demo Data */}
          <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-rose-900">
              <RotateCcw className="w-4 h-4 text-rose-600" />
              <span>演示环境数据还原</span>
            </div>
            <p className="text-xs text-rose-700 leading-relaxed">
              如果演示过程中新建了大量测试家宴、吹哨或记分，可点击此按钮清空并重置为预设的出厂演示测试数据。
            </p>
            <button
              onClick={onResetAll}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>一键重置所有演示数据</span>
            </button>
          </div>
        </div>

        {/* Right Column: Notification Management Center */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                系统通知中心台账
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                包含家宴申报自动分流推送、吹哨立案督办与积分到账提示
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAllRead}
                className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg text-xs font-medium transition-colors"
              >
                全部标为已读
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium ${
                filterType === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              全部 ({notifications.length})
            </button>
            <button
              onClick={() => setFilterType('unread')}
              className={`px-3 py-1 rounded-lg text-xs font-medium ${
                filterType === 'unread' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              未读 ({notifications.filter(n => !n.read).length})
            </button>
            <button
              onClick={() => setFilterType('banquet')}
              className={`px-3 py-1 rounded-lg text-xs font-medium ${
                filterType === 'banquet' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              家宴分流
            </button>
            <button
              onClick={() => setFilterType('whistle')}
              className={`px-3 py-1 rounded-lg text-xs font-medium ${
                filterType === 'whistle' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              吹哨线索
            </button>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden max-h-[600px] overflow-y-auto">
            {filteredNotifications.map(item => (
              <div
                key={item.id}
                className={`p-4 transition-all ${
                  item.read ? 'bg-white opacity-75' : 'bg-emerald-50/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                      )}
                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      {item.targetTown && (
                        <span className="px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 text-[10px] font-medium">
                          {item.targetTown}
                        </span>
                      )}
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 text-[10px]">
                        受众：{item.targetRole}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.content}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>时间：{item.time}</span>
                      <div className="flex items-center gap-2">
                        {!item.read && (
                          <button
                            onClick={() => handleMarkRead(item.id)}
                            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>标为已读</span>
                          </button>
                        )}
                        {item.linkId && onNavigateToAudit && (
                          <button
                            onClick={onNavigateToAudit}
                            className="text-sky-600 hover:text-sky-700 font-medium flex items-center gap-0.5"
                          >
                            <span>前往处置</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredNotifications.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs">
                暂无此分类下的系统通知
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
