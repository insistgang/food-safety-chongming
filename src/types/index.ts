// Data Models & Interface Contracts for Chongming Food & Drug Safety Platform

export type UserRole = 'public' | 'rider' | 'caterer' | 'town_admin' | 'district_admin';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  town?: string; // e.g., '城桥镇', '堡镇', '陈家镇'
  avatar?: string;
  points: number;
  riderCertified?: boolean;
  catererCertified?: boolean;
}

export type TownName = 
  | '城桥镇' | '堡镇' | '庙镇' | '中兴镇' | '陈家镇' 
  | '三星镇' | '港沿镇' | '向化镇' | '绿华镇' | '港西镇' 
  | '建设镇' | '新河镇' | '竖新镇' | '横沙乡' | '新海镇' | '东平镇';

export const CHONGMING_TOWNS: TownName[] = [
  '城桥镇', '堡镇', '庙镇', '中兴镇', '陈家镇', 
  '三星镇', '港沿镇', '向化镇', '绿华镇', '港西镇', 
  '建设镇', '新河镇', '竖新镇', '横沙乡', '新海镇', '东平镇'
];

// 政策宝典
export interface PolicyItem {
  id: string;
  title: string;
  category: '法律法规' | '部门规章' | '规范性文件' | '国家标准' | '地方规范';
  publishDate: string;
  docNumber: string;
  content: string;
  tags: string[];
  views: number;
  downloadUrl?: string;
}

export interface GuideItem {
  id: string;
  title: string;
  category: '营业执照' | '食品生产许可' | '食品经营许可' | '小餐饮备案' | '食品摊贩' | '农村集体聚餐';
  processingTime: string;
  contactPhone: string;
  handlingPlace: string;
  materials: { name: string; required: boolean; tip: string }[];
  steps: { step: number; title: string; desc: string }[];
  flowchartDesc: string;
}

// 食安新语
export interface ActivityItem {
  id: string;
  title: string;
  type: '食光巴士' | '食物爱心共享站' | '宣传周活动' | '你点我检';
  date: string;
  location: string;
  quota: number;
  enrolled: number;
  description: string;
  status: '报名中' | '进行中' | '已结束';
  image: string;
}

export interface AntiRumorItem {
  id: string;
  rumor: string;
  truth: string;
  season: '四季常识' | '春夏高发' | '秋冬警示' | '节日特辑';
  category: '果蔬农残' | '肉类安全' | '食品添加剂' | '保健陷阱' | '药械误区';
  expertVoice: string;
  publishedAt: string;
  reads: number;
}

// 安心家宴（农村集体聚餐）
export interface BanquetTeam {
  id: string;
  teamName: string;
  leaderName: string;
  leaderPhone: string;
  town: TownName;
  address: string;
  licenseNo: string;
  cooksCount: number;
  healthCertCount: number;
  score: number; // 初始100分
  status: '已认证' | '待审核' | '暂停资格';
  createdAt: string;
}

export interface BanquetDeclaration {
  id: string;
  teamId?: string;
  teamName: string;
  declarantName: string;
  declarantPhone: string;
  reason: '婚宴' | '寿宴' | '满月周岁' | '乔迁新居' | '白事' | '其他宗族聚会';
  eventDate: string;
  tablesCount: number;
  estimatedPeople: number;
  town: TownName;
  detailedAddress: string;
  menuText: string;
  riskWarningsDetected: string[]; // 检测出的风险食材
  cookHealthCertImages: string[];
  safetyPledgeAgreed: boolean;
  status: '待乡镇审核' | '乡镇已通过' | '现场核查中' | '已驳回' | '整改合格';
  auditNote?: string;
  auditorName?: string;
  assignedInspector?: string;
  createdAt: string;
}

export interface BanquetDeductionRecord {
  id: string;
  teamId: string;
  teamName: string;
  declarationId?: string;
  pointsDeducted: number;
  reason: string;
  inspectDate: string;
  inspectorName: string;
  town: TownName;
  proofImages?: string[];
}

// 食药吹哨
export interface RiderCertification {
  id: string;
  userId: string;
  riderName: string;
  phone: string;
  platform: '美团外卖' | '饿了么' | '闪送/顺丰同城' | '其他';
  riderBadgeNumber: string;
  badgeImageUrl: string;
  status: '待审核' | '已认证' | '已驳回';
  auditReason?: string;
  createdAt: string;
}

export type WhistleblowerCategory = 'food' | 'drug';

export interface WhistleblowerReport {
  id: string;
  category: WhistleblowerCategory;
  reporterType: '骑手' | '公众';
  reporterId: string;
  reporterName: string;
  reporterPhone: string;
  targetName: string; // 商家或药店名
  town: TownName;
  locationAddress: string;
  issueTypes: string[]; // 多选
  description: string;
  evidenceImages: string[];
  status: '待受理' | '已受理转派' | '执法核查中' | '已核实结案' | '不属实归档';
  assignedDepartment?: string;
  auditComment?: string;
  rewardPoints: number; // 0-5分
  rewardCash: number; // 0 或 10-50元奖励模拟
  createdAt: string;
  resolvedAt?: string;
}

// 站内消息
export interface NotificationMsg {
  id: string;
  targetRole: UserRole | 'all';
  targetTown?: TownName;
  title: string;
  content: string;
  time: string;
  read: boolean;
  type: 'banquet' | 'whistle' | 'system' | 'points';
  linkId?: string;
}

// 系统统计
export interface PlatformStats {
  totalDeclarations: number;
  totalWhistleReports: number;
  certifiedRiders: number;
  activeBanquetTeams: number;
  resolvedRiskCount: number;
  totalRewardPointsIssued: number;
}
