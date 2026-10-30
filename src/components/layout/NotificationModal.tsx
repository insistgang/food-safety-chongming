import React from 'react';
import { X, Check, Bell, Shield, Info, ArrowRight } from 'lucide-react';
import { NotificationMsg } from '../../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationMsg[];
  onMarkRead: (id: string) => void;
  onNavigateToItem?: (linkId?: string, type?: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onNavigateToItem
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">系统消息通知中心</h3>
              <p className="text-xs text-slate-500">家宴分流派发、吹哨线索及全区预警广播</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100 p-2">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              暂无任何消息通知
            </div>
          ) : (
            notifications.map(item => (
              <div 
                key={item.id} 
                className={`p-4 rounded-xl transition-all ${item.read ? 'bg-white opacity-70' : 'bg-emerald-50/40 border border-emerald-100'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                      )}
                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      {item.targetTown && (
                        <span className="px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 text-[10px] font-medium">
                          {item.targetTown}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">
                      {item.content}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{item.time}</span>
                      <div className="flex items-center gap-3">
                        {!item.read && (
                          <button
                            onClick={() => onMarkRead(item.id)}
                            className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> 标为已读
                          </button>
                        )}
                        {item.linkId && onNavigateToItem && (
                          <button
                            onClick={() => {
                              onNavigateToItem(item.linkId, item.type);
                              onClose();
                            }}
                            className="text-sky-600 hover:text-sky-700 font-medium inline-flex items-center gap-0.5"
                          >
                            <span>去处理</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
