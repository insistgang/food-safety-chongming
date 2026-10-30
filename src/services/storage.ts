import { 
  UserProfile, PolicyItem, GuideItem, ActivityItem, AntiRumorItem, 
  BanquetTeam, BanquetDeclaration, BanquetDeductionRecord, 
  RiderCertification, WhistleblowerReport, NotificationMsg, TownName
} from '../types';
import {
  INITIAL_USER, INITIAL_POLICIES, INITIAL_GUIDES, 
  INITIAL_ACTIVITIES, INITIAL_RUMORS, INITIAL_BANQUET_TEAMS, 
  INITIAL_BANQUET_DECLARATIONS, INITIAL_DEDUCTION_RECORDS, 
  INITIAL_RIDERS, INITIAL_WHISTLE_REPORTS, INITIAL_NOTIFICATIONS
} from '../data/mockData';

const KEYS = {
  USER: 'cm_food_safety_user',
  POLICIES: 'cm_food_safety_policies',
  GUIDES: 'cm_food_safety_guides',
  ACTIVITIES: 'cm_food_safety_activities',
  RUMORS: 'cm_food_safety_rumors',
  BANQUET_TEAMS: 'cm_food_safety_banquet_teams',
  BANQUET_DECLARATIONS: 'cm_food_safety_banquet_declarations',
  DEDUCTIONS: 'cm_food_safety_deductions',
  RIDERS: 'cm_food_safety_riders',
  WHISTLES: 'cm_food_safety_whistles',
  NOTIFICATIONS: 'cm_food_safety_notifications'
};

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to read ${key} from localStorage`, e);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to write ${key} to localStorage`, e);
  }
}

export const StorageService = {
  // Reset all data to factory demo defaults
  resetAll: () => {
    localStorage.clear();
    setStored(KEYS.USER, INITIAL_USER);
    setStored(KEYS.POLICIES, INITIAL_POLICIES);
    setStored(KEYS.GUIDES, INITIAL_GUIDES);
    setStored(KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    setStored(KEYS.RUMORS, INITIAL_RUMORS);
    setStored(KEYS.BANQUET_TEAMS, INITIAL_BANQUET_TEAMS);
    setStored(KEYS.BANQUET_DECLARATIONS, INITIAL_BANQUET_DECLARATIONS);
    setStored(KEYS.DEDUCTIONS, INITIAL_DEDUCTION_RECORDS);
    setStored(KEYS.RIDERS, INITIAL_RIDERS);
    setStored(KEYS.WHISTLES, INITIAL_WHISTLE_REPORTS);
    setStored(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },

  // User
  getUser: (): UserProfile => getStored<UserProfile>(KEYS.USER, INITIAL_USER),
  saveUser: (user: UserProfile) => setStored(KEYS.USER, user),
  updatePoints: (delta: number) => {
    const user = StorageService.getUser();
    user.points = Math.max(0, user.points + delta);
    StorageService.saveUser(user);
    return user.points;
  },

  // Policies
  getPolicies: (): PolicyItem[] => getStored<PolicyItem[]>(KEYS.POLICIES, INITIAL_POLICIES),
  savePolicies: (items: PolicyItem[]) => setStored(KEYS.POLICIES, items),
  addPolicy: (item: Omit<PolicyItem, 'id' | 'views'>) => {
    const items = StorageService.getPolicies();
    const newItem: PolicyItem = {
      ...item,
      id: `pol_${Date.now()}`,
      views: 1
    };
    items.unshift(newItem);
    StorageService.savePolicies(items);
    return newItem;
  },

  // Guides
  getGuides: (): GuideItem[] => getStored<GuideItem[]>(KEYS.GUIDES, INITIAL_GUIDES),

  // Activities
  getActivities: (): ActivityItem[] => getStored<ActivityItem[]>(KEYS.ACTIVITIES, INITIAL_ACTIVITIES),
  saveActivities: (items: ActivityItem[]) => setStored(KEYS.ACTIVITIES, items),
  enrollActivity: (activityId: string) => {
    const items = StorageService.getActivities();
    const idx = items.findIndex(a => a.id === activityId);
    if (idx !== -1 && items[idx].enrolled < items[idx].quota) {
      items[idx].enrolled += 1;
      StorageService.saveActivities(items);
      return true;
    }
    return false;
  },

  // Rumors
  getRumors: (): AntiRumorItem[] => getStored<AntiRumorItem[]>(KEYS.RUMORS, INITIAL_RUMORS),
  saveRumors: (items: AntiRumorItem[]) => setStored(KEYS.RUMORS, items),
  addRumor: (item: Omit<AntiRumorItem, 'id' | 'reads' | 'publishedAt'>) => {
    const items = StorageService.getRumors();
    const newItem: AntiRumorItem = {
      ...item,
      id: `rumor_${Date.now()}`,
      reads: 1,
      publishedAt: new Date().toISOString().split('T')[0]
    };
    items.unshift(newItem);
    StorageService.saveRumors(items);
    return newItem;
  },

  // Banquet Teams
  getBanquetTeams: (): BanquetTeam[] => getStored<BanquetTeam[]>(KEYS.BANQUET_TEAMS, INITIAL_BANQUET_TEAMS),
  saveBanquetTeams: (items: BanquetTeam[]) => setStored(KEYS.BANQUET_TEAMS, items),
  registerBanquetTeam: (data: Omit<BanquetTeam, 'id' | 'score' | 'status' | 'createdAt'>) => {
    const items = StorageService.getBanquetTeams();
    const newTeam: BanquetTeam = {
      ...data,
      id: `team_${Date.now()}`,
      score: 100,
      status: '已认证',
      createdAt: new Date().toISOString().split('T')[0]
    };
    items.unshift(newTeam);
    StorageService.saveBanquetTeams(items);
    return newTeam;
  },

  // Banquet Declarations
  getBanquetDeclarations: (): BanquetDeclaration[] => getStored<BanquetDeclaration[]>(KEYS.BANQUET_DECLARATIONS, INITIAL_BANQUET_DECLARATIONS),
  saveBanquetDeclarations: (items: BanquetDeclaration[]) => setStored(KEYS.BANQUET_DECLARATIONS, items),
  addBanquetDeclaration: (data: Omit<BanquetDeclaration, 'id' | 'createdAt' | 'status'>) => {
    const items = StorageService.getBanquetDeclarations();
    const newDec: BanquetDeclaration = {
      ...data,
      id: `dec_${Date.now()}`,
      status: '待乡镇审核',
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false })
    };
    items.unshift(newDec);
    StorageService.saveBanquetDeclarations(items);

    // Auto-dispatch town notification
    StorageService.addNotification({
      targetRole: 'town_admin',
      targetTown: data.town,
      title: `【乡镇待办】您收到一笔新的${data.town}农村集体家宴在线申报`,
      content: `举办人${data.declarantName}申报了${data.tablesCount}桌${data.reason}，承办队伍：${data.teamName}。`,
      time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
      read: false,
      type: 'banquet',
      linkId: newDec.id
    });

    return newDec;
  },
  auditBanquetDeclaration: (id: string, status: BanquetDeclaration['status'], note: string, auditorName: string) => {
    const items = StorageService.getBanquetDeclarations();
    const idx = items.findIndex(d => d.id === id);
    if (idx !== -1) {
      items[idx].status = status;
      items[idx].auditNote = note;
      items[idx].auditorName = auditorName;
      StorageService.saveBanquetDeclarations(items);
      return items[idx];
    }
    return null;
  },

  // Deductions
  getDeductions: (): BanquetDeductionRecord[] => getStored<BanquetDeductionRecord[]>(KEYS.DEDUCTIONS, INITIAL_DEDUCTION_RECORDS),
  saveDeductions: (items: BanquetDeductionRecord[]) => setStored(KEYS.DEDUCTIONS, items),
  recordDeduction: (record: Omit<BanquetDeductionRecord, 'id'>) => {
    const records = StorageService.getDeductions();
    const newRecord: BanquetDeductionRecord = {
      ...record,
      id: `ded_${Date.now()}`
    };
    records.unshift(newRecord);
    StorageService.saveDeductions(records);

    // Deduct team score
    const teams = StorageService.getBanquetTeams();
    const team = teams.find(t => t.id === record.teamId);
    if (team) {
      team.score = Math.max(0, team.score - record.pointsDeducted);
      if (team.score < 60) {
        team.status = '暂停资格';
      }
      StorageService.saveBanquetTeams(teams);
    }
    return newRecord;
  },

  // Riders
  getRiders: (): RiderCertification[] => getStored<RiderCertification[]>(KEYS.RIDERS, INITIAL_RIDERS),
  saveRiders: (items: RiderCertification[]) => setStored(KEYS.RIDERS, items),
  registerRider: (data: Omit<RiderCertification, 'id' | 'status' | 'createdAt'>) => {
    const riders = StorageService.getRiders();
    const newRider: RiderCertification = {
      ...data,
      id: `rider_${Date.now()}`,
      status: '已认证', // 演示模式默认直接通过，亦可在后台审核
      createdAt: new Date().toISOString().split('T')[0]
    };
    riders.unshift(newRider);
    StorageService.saveRiders(riders);

    // Update active user status
    const user = StorageService.getUser();
    user.riderCertified = true;
    StorageService.saveUser(user);

    return newRider;
  },
  auditRider: (id: string, status: RiderCertification['status'], reason?: string) => {
    const riders = StorageService.getRiders();
    const idx = riders.findIndex(r => r.id === id);
    if (idx !== -1) {
      riders[idx].status = status;
      riders[idx].auditReason = reason;
      StorageService.saveRiders(riders);
      return riders[idx];
    }
    return null;
  },

  // Whistleblower Reports
  getWhistles: (): WhistleblowerReport[] => getStored<WhistleblowerReport[]>(KEYS.WHISTLES, INITIAL_WHISTLE_REPORTS),
  saveWhistles: (items: WhistleblowerReport[]) => setStored(KEYS.WHISTLES, items),
  submitWhistle: (data: Omit<WhistleblowerReport, 'id' | 'status' | 'createdAt' | 'rewardPoints' | 'rewardCash'>) => {
    const whistles = StorageService.getWhistles();
    const newReport: WhistleblowerReport = {
      ...data,
      id: `w_${Date.now()}`,
      status: '待受理',
      rewardPoints: 0,
      rewardCash: 0,
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false })
    };
    whistles.unshift(newReport);
    StorageService.saveWhistles(whistles);

    // Town notice
    StorageService.addNotification({
      targetRole: 'town_admin',
      targetTown: data.town,
      title: `【食药吹哨待办】收到${data.town}${data.category === 'food' ? '食品' : '药品'}安全问题线索`,
      content: `反映对象：${data.targetName}，涉及问题：${data.issueTypes.join('、')}`,
      time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
      read: false,
      type: 'whistle',
      linkId: newReport.id
    });

    return newReport;
  },
  auditWhistle: (
    id: string, 
    status: WhistleblowerReport['status'], 
    comment: string, 
    rewardPoints: number, 
    rewardCash: number,
    department: string
  ) => {
    const whistles = StorageService.getWhistles();
    const idx = whistles.findIndex(w => w.id === id);
    if (idx !== -1) {
      whistles[idx].status = status;
      whistles[idx].auditComment = comment;
      whistles[idx].rewardPoints = rewardPoints;
      whistles[idx].rewardCash = rewardCash;
      whistles[idx].assignedDepartment = department;
      if (status === '已核实结案') {
        whistles[idx].resolvedAt = new Date().toLocaleString('zh-CN', { hour12: false });
        // Award points to user
        StorageService.updatePoints(rewardPoints);
        // Notice to user
        StorageService.addNotification({
          targetRole: 'public',
          title: `吹哨核实结案与积分奖励通知`,
          content: `您反馈关于「${whistles[idx].targetName}」的问题已被市场监管部门查实结案，已奖励您 ${rewardPoints} 积分与 ${rewardCash} 元现金奖励！`,
          time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
          read: false,
          type: 'points'
        });
      }
      StorageService.saveWhistles(whistles);
      return whistles[idx];
    }
    return null;
  },

  // Notifications
  getNotifications: (): NotificationMsg[] => getStored<NotificationMsg[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  saveNotifications: (items: NotificationMsg[]) => setStored(KEYS.NOTIFICATIONS, items),
  addNotification: (item: Omit<NotificationMsg, 'id'>) => {
    const list = StorageService.getNotifications();
    const newItem: NotificationMsg = {
      ...item,
      id: `notif_${Date.now()}`
    };
    list.unshift(newItem);
    StorageService.saveNotifications(list);
    return newItem;
  },
  markNotificationRead: (id: string) => {
    const list = StorageService.getNotifications();
    const item = list.find(n => n.id === id);
    if (item) {
      item.read = true;
      StorageService.saveNotifications(list);
    }
  }
};
