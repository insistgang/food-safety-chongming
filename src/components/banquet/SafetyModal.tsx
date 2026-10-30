import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, ShieldAlert, CheckCircle2, FileText, 
  Clock, ArrowDown, Lock, Check
} from 'lucide-react';

interface SafetyModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  const [countdown, setCountdown] = useState(5);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setHasScrolledToBottom(false);
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      // Scrolled to bottom within 35px threshold (optimized for mobile touch bouncing)
      if (scrollTop + clientHeight >= scrollHeight - 35) {
        setHasScrolledToBottom(true);
      }
    }
  };

  if (!isOpen) return null;

  const canConfirm = countdown === 0 && hasScrolledToBottom;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-rose-600 p-6 text-white flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
            <ShieldAlert className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/20 inline-block mb-1">
              法定强制确认程序
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
              农村集体聚餐食品安全核心禁令与承诺书
            </h3>
          </div>
        </div>

        {/* Scroll Notice */}
        <div className="bg-amber-50 border-b border-amber-200/60 px-6 py-2.5 flex items-center justify-between text-xs text-amber-800">
          <div className="flex items-center gap-1.5 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>必须仔细阅读条款并滚动至文档底部方可签署确认</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono bg-amber-100/80 px-2 py-0.5 rounded">
            <Clock className="w-3.5 h-3.5" />
            <span>{countdown > 0 ? `倒计时 ${countdown} 秒` : '阅读时间达标'}</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="p-6 max-h-72 overflow-y-auto text-xs text-slate-700 space-y-4 leading-relaxed divide-y divide-slate-100"
        >
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1 text-rose-600">
              一、【一票否决】高风险及违法食材严禁上桌
            </h4>
            <p>1. <strong>严禁加工食用剧毒野生植物：</strong>严禁采购、加工草乌、附子、曼陀罗等有毒中草药泡酒或入菜；严禁采食野生毒蘑菇。</p>
            <p>2. <strong>严禁加工违规水产品：</strong>严禁采购、烹饪野生河豚鱼、织纹螺等国家法律明令禁止的高毒水产品。</p>
            <p>3. <strong>谨慎加工豆类与生冷：</strong>四季豆必须烧熟煮透，禁止大锅未熟翻炒；农村自办宴席缺乏专间消毒条件的，<strong>严禁现场切配冷食熟肉、生食水产品</strong>。</p>
          </div>

          <div className="space-y-2 pt-3">
            <h4 className="font-bold text-slate-900 text-sm text-amber-700">
              二、厨师与帮工从业资格红线
            </h4>
            <p>1. 承办“一条龙”厨师及所有临时帮厨人员，必须持有<strong>有效期内的从业人员预防性健康体检合格证明</strong>，有发热、腹泻、皮肤化脓等症状者严禁接触食材。</p>
            <p>2. 切配与烹饪期间全程规范佩戴口罩、工作帽，指甲修剪整齐，生熟案板与刀具严格物理分色区分，防止交叉污染。</p>
          </div>

          <div className="space-y-2 pt-3">
            <h4 className="font-bold text-slate-900 text-sm text-emerald-800">
              三、现场水源、留样与突发应急
            </h4>
            <p>1. 制作与洗涤必须使用自来水，严禁使用未经检验的河水、井水清洗餐具与熟食。</p>
            <p>2. <strong>强制48小时留样制度：</strong>所有菜品必须按品种独立留样不少于125克，置于专用冷藏容器（0℃-8℃）中规范留样备查。</p>
            <p>3. 聚餐过程中一旦发现就餐人员出现恶心、呕吐、腹痛腹泻等疑似食源性疾患症状，承办团队与举办人必须<strong>立即停止供餐并于1小时内向所属乡镇食安办报告</strong>，保护现场留样备检。</p>
          </div>

          <div className="pt-3 text-center">
            <div 
              onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
                  setHasScrolledToBottom(true);
                }
              }}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
              hasScrolledToBottom 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold' 
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
            }`}>
              {hasScrolledToBottom ? (
                <div className="flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>您已阅读至条款文末，请等待倒计时结束确认</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5 animate-bounce">
                  <ArrowDown className="w-4 h-4 text-amber-600" />
                  <span>点击直接滑至条款文末（或手动向下滚动）</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
          >
            放弃申报
          </button>

          <button
            type="button"
            disabled={!canConfirm}
            onClick={onConfirm}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              canConfirm
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-emerald-500/20'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {canConfirm ? (
              <>
                <Check className="w-4 h-4" />
                <span>我已完全知晓并承诺遵守上述禁令</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>
                  {countdown > 0 ? `请阅读 (${countdown}s)` : '请滚动到底部解锁'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
