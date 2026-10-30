import { 
  PolicyItem, GuideItem, ActivityItem, AntiRumorItem, 
  BanquetTeam, BanquetDeclaration, BanquetDeductionRecord, 
  RiderCertification, WhistleblowerReport, NotificationMsg, UserProfile 
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr_001',
  name: '陈建国（公众/先锋骑手）',
  phone: '13817658899',
  role: 'public',
  town: '城桥镇',
  points: 125,
  riderCertified: true,
  catererCertified: true
};

export const INITIAL_POLICIES: PolicyItem[] = [
  {
    id: 'pol_01',
    title: '中华人民共和国食品安全法（最新修正版解读）',
    category: '法律法规',
    publishDate: '2023-11-15',
    docNumber: '主席令第21号',
    tags: ['国家基本法', '主体责任', '处罚细则'],
    views: 4520,
    content: '为了保证食品安全，保障公众身体健康和生命安全，制定本法。食品生产经营者应当依照法律、法规和食品安全标准从事生产经营活动，保证食品安全，诚信自律，对社会和公众负责，接受社会监督，承担社会责任。'
  },
  {
    id: 'pol_02',
    title: '上海市农村集体聚餐食品安全监督管理办法',
    category: '规范性文件',
    publishDate: '2024-03-01',
    docNumber: '沪食药安办〔2024〕12号',
    tags: ['农村聚餐', '一条龙申报', '崇明特色'],
    views: 3180,
    content: '明确就餐人数在50人（含50人）以上或聚餐桌数在5桌以上的农村集体聚餐活动，举办者和承办者必须提前向所在地乡镇食品药品安全委员会办公室进行安全信息报告并接受现场指导。'
  },
  {
    id: 'pol_03',
    title: '网络餐饮服务食品安全监督管理办法',
    category: '部门规章',
    publishDate: '2023-08-20',
    docNumber: '总局令第36号',
    tags: ['外卖骑手', '网络订餐', '封签规范'],
    views: 2890,
    content: '入网餐饮服务提供者应当具有实体经营门店并依法取得食品经营许可证，网络销售的餐饮食品应当与实体店销售的餐饮食品质量安全保持一致。送餐人员应当保持个人卫生，使用安全、无害的配送容器。'
  },
  {
    id: 'pol_04',
    title: 'GB 14881-2013 食品安全国家标准 食品生产通用卫生规范',
    category: '国家标准',
    publishDate: '2022-09-10',
    docNumber: 'GB 14881-2013',
    tags: ['国标强制', '生产卫生', '交叉污染防控'],
    views: 1940,
    content: '本标准规定了食品生产过程中原料采购、加工、包装、贮存和运输等环节的场所、设施、人员的基本要求和管理准则。'
  },
  {
    id: 'pol_05',
    title: '崇明区鼓励外卖骑手参与食品药品安全吹哨监督激励细则',
    category: '地方规范',
    publishDate: '2024-01-10',
    docNumber: '崇食药安委〔2024〕3号',
    tags: ['吹哨人', '积分奖励', '骑手共治'],
    views: 5620,
    content: '充分发挥外卖骑手走街串巷、熟悉后厨的“移动哨兵”优势，凡经核实属实的后厨脏乱差、无证生产、过期药品等线索，给予积分与物资双重奖励。'
  }
];

export const INITIAL_GUIDES: GuideItem[] = [
  {
    id: 'guide_01',
    title: '农村集体聚餐（家宴）申报指引',
    category: '农村集体聚餐',
    processingTime: '即时响应 / 24小时内审核指导',
    contactPhone: '021-59621120（崇明区食药安办家宴热线）',
    handlingPlace: '崇明区各乡镇食药安办 / “食安崇明”移动端直报',
    materials: [
      { name: '举办者及承办厨师身份证复印件', required: true, tip: '正反面清晰扫描件或照片' },
      { name: '厨师及帮工有效健康合格证明', required: true, tip: '一年内有效健康证，现场需备查' },
      { name: '拟办家宴菜单明细表', required: true, tip: '严格禁止冷食熟肉无专间切配、河豚、鲜黄花菜等高危菜品' },
      { name: '场地消毒与水源自查记录', required: false, tip: '保障聚餐点环境卫生' }
    ],
    steps: [
      { step: 1, title: '在线申报', desc: '提前3-7天通过本系统填报聚餐人数、桌数、地址及菜单' },
      { step: 2, title: '安全要点阅读', desc: '阅读禁止违规菜品提示并签署安全承诺' },
      { step: 3, title: '乡镇分流审查', desc: '所属乡镇食安监管员进行线上初审，超高桌数安排现场指导' },
      { step: 4, title: '现场指导与留样', desc: '宴会当日食材索证索票，关键菜品规范冷藏留样48小时' }
    ],
    flowchartDesc: '提前申报 ➔ 乡镇审查 ➔ 现场指导 ➔ 规范聚餐 ➔ 48小时食材留样'
  },
  {
    id: 'guide_02',
    title: '崇明生态特色小餐饮备案办理指南',
    category: '小餐饮备案',
    processingTime: '3个工作日',
    contactPhone: '021-59612345（区政务服务中心市场监管窗口）',
    handlingPlace: '各乡镇社区事务受理服务中心市场监管窗口',
    materials: [
      { name: '小餐饮备案申请表', required: true, tip: '系统可直接下载打印或现场填报' },
      { name: '经营场所使用证明（租房协议或产权证明）', required: true, tip: '需明确经营范围与地址' },
      { name: '从业人员健康证明', required: true, tip: '从业人员全覆盖' },
      { name: '餐饮加工场所平面布局图', required: true, tip: '标注清洗水池、生熟分区、油烟净化设施' }
    ],
    steps: [
      { step: 1, title: '准备材料', desc: '核对材料清单并完成从业人员体检取得健康证明' },
      { step: 2, title: '提交申请', desc: '线下窗口提交或一网通办崇明专区提交' },
      { step: 3, title: '现场核查', desc: '市场监管所执法人员3日内上门实地勘验' },
      { step: 4, title: '发放便民备案凭证', desc: '勘验合格即时发证并纳入常态化监管' }
    ],
    flowchartDesc: '材料准备 ➔ 窗口受理 ➔ 现场踏勘 ➔ 颁发凭证 ➔ 上墙公示'
  },
  {
    id: 'guide_03',
    title: '食品经营许可证（餐饮/食品销售）新办',
    category: '食品经营许可',
    processingTime: '5个工作日',
    contactPhone: '021-69695000',
    handlingPlace: '崇明区行政服务中心2楼市场监管综合窗口',
    materials: [
      { name: '营业执照复印件', required: true, tip: '已取得合法主体资格' },
      { name: '食品经营许可申请书', required: true, tip: '法定代表人签名盖章' },
      { name: '食品安全规章制度清单', required: true, tip: '包括采购索证、消毒管理等制度' },
      { name: '主要设备设施清单与工艺布局图', required: true, tip: '符合动线不交叉原则' }
    ],
    steps: [
      { step: 1, title: '网申预审', desc: '一网通办平台填报数据上传图纸' },
      { step: 2, title: '现场勘查', desc: '预约执法人员现场查看操作间条件' },
      { step: 3, title: '核发许可证', desc: '发放电子许可证及纸质证书' }
    ],
    flowchartDesc: '企业开办 ➔ 网上申报 ➔ 专人核验 ➔ 发放电子证照'
  }
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act_01',
    title: '“食”光巴士生态崇明巡回科普宣讲（第8期）',
    type: '食光巴士',
    date: '2024-11-20 09:00 - 16:00',
    location: '城桥镇新崇南路广场 ➔ 堡镇市民公园',
    quota: 120,
    enrolled: 98,
    status: '报名中',
    description: '“食”光巴士满载食品快检设备与互动VR体验仓，邀请市民亲手体验农残快速检测、真假中药饮片鉴别，更有崇明特色米糕无添加健康制作互动。',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'act_02',
    title: '食物爱心共享站：崇明暖心骑手驿站补给计划',
    type: '食物爱心共享站',
    date: '常态化运行（每日 10:00 - 20:00）',
    location: '城桥镇八一路骑手之家 / 堡镇商业街驿站',
    quota: 300,
    enrolled: 245,
    status: '进行中',
    description: '联动爱心商超与品牌餐饮，将符合临期安全标准的独立包装点心、饮用水免费提供给奔波的吹哨外卖骑手与环卫工人。',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'act_03',
    title: '2024崇明区食品药品安全宣传周主场启动仪式',
    type: '宣传周活动',
    date: '2024-11-28 09:30',
    location: '崇明区会议中心大礼堂',
    quota: 200,
    enrolled: 200,
    status: '进行中',
    description: '年度表彰优秀外卖吹哨骑手、十佳安心家宴诚信大厨，现场发布崇明区绿色食品安全白皮书与智慧监管大屏。',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'act_04',
    title: '“你点我检，食安共护”崇明菜市场专项抽检票选',
    type: '你点我检',
    date: '2024-11-15 至 2024-11-30',
    location: '线上票选 / 全区农贸市场现场抽样',
    quota: 1000,
    enrolled: 760,
    status: '报名中',
    description: '公众投票选出最关心的食品品种（如崇明清水蟹、本地草鸡、油麦菜、草莓等），专业检测机构全程直播抽检全过程。',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_RUMORS: AntiRumorItem[] = [
  {
    id: 'rumor_01',
    rumor: '无籽西瓜、草莓是用避孕药催熟的，吃了会导致儿童性早熟？',
    truth: '【完全不实】所谓“催熟剂”是植物生长调节剂（植物激素），与人体的动物雌孕激素在受体分子结构上截然不同，完全不会在人体内产生激素作用，国家标准严格限定使用量，正常食用无安全隐患。',
    season: '四季常识',
    category: '果蔬农残',
    expertVoice: '崇明区农产品质量安全监督检测中心 张研究员',
    publishedAt: '2024-10-12',
    reads: 4320
  },
  {
    id: 'rumor_02',
    rumor: '菜市场买的猪肉泛蓝光，是含有剧毒荧光剂或辐射？',
    truth: '【科学解释】猪肉发光多由于在屠宰、运输或储存过程中被发光细菌（如发光杆菌属）二次污染，与磷光剂或核辐射无关。但发光表明肉品已被微生物严重污染变质，切勿食用！',
    season: '春夏高发',
    category: '肉类安全',
    expertVoice: '上海市食品安全风险评估专家委员会 李教授',
    publishedAt: '2024-09-08',
    reads: 6180
  },
  {
    id: 'rumor_03',
    rumor: '感冒药混搭吃好得快？连花清瘟+对乙酰氨基酚+头孢！',
    truth: '【极其危险】多种含有相同解热镇痛成分（如对乙酰氨基酚）的感冒药联合服用极易导致急性肝功能衰竭乃至死亡！抗生素对病毒性感冒无效，严禁自行滥用。',
    season: '秋冬警示',
    category: '药械误区',
    expertVoice: '崇明区中心医院药学部 陈主任药师',
    publishedAt: '2024-11-02',
    reads: 8940
  },
  {
    id: 'rumor_04',
    rumor: '零添加才是好食品，含有防腐剂的食品都会致癌？',
    truth: '【概念误导】只要符合国家GB 2760标准，防腐剂能有效抑制肉毒杆菌等致死性剧毒微生物生长，反而保障了食用安全。“零添加”多为商业营销噱头，不代表更安全。',
    season: '四季常识',
    category: '食品添加剂',
    expertVoice: '区市场监督管理局食品监管科',
    publishedAt: '2024-08-15',
    reads: 5120
  }
];

export const INITIAL_BANQUET_TEAMS: BanquetTeam[] = [
  {
    id: 'team_01',
    teamName: '崇明瀛洲乡味宴席服务队',
    leaderName: '张培新',
    leaderPhone: '13918820011',
    town: '城桥镇',
    address: '城桥镇利民村18号',
    licenseNo: 'CM-CY-2023-0108',
    cooksCount: 8,
    healthCertCount: 8,
    score: 98,
    status: '已认证',
    createdAt: '2023-04-12'
  },
  {
    id: 'team_02',
    teamName: '堡镇金牌喜事一条龙餐饮队',
    leaderName: '陆金生',
    leaderPhone: '13761229988',
    town: '堡镇',
    address: '堡镇向阳路52号',
    licenseNo: 'CM-CY-2023-0219',
    cooksCount: 6,
    healthCertCount: 6,
    score: 94,
    status: '已认证',
    createdAt: '2023-06-20'
  },
  {
    id: 'team_03',
    teamName: '陈家镇生态生态东滩农家大厨班',
    leaderName: '黄耀辉',
    leaderPhone: '13601887766',
    town: '陈家镇',
    address: '陈家镇裕安村8组',
    licenseNo: 'CM-CY-2024-0012',
    cooksCount: 10,
    healthCertCount: 10,
    score: 100,
    status: '已认证',
    createdAt: '2024-01-05'
  },
  {
    id: 'team_04',
    teamName: '庙镇乡村传统百家宴厨师组',
    leaderName: '宋德宝',
    leaderPhone: '13816654321',
    town: '庙镇',
    address: '庙镇宏达村112号',
    licenseNo: 'CM-CY-2024-0089',
    cooksCount: 5,
    healthCertCount: 4, // 1人待复查
    score: 88,
    status: '待审核',
    createdAt: '2024-10-10'
  }
];

export const INITIAL_BANQUET_DECLARATIONS: BanquetDeclaration[] = [
  {
    id: 'dec_20241101',
    teamId: 'team_01',
    teamName: '崇明瀛洲乡味宴席服务队',
    declarantName: '施国民',
    declarantPhone: '13917882233',
    reason: '婚宴',
    eventDate: '2024-11-25',
    tablesCount: 28,
    estimatedPeople: 280,
    town: '城桥镇',
    detailedAddress: '城桥镇运粮村第6村民小组文化大礼堂',
    menuText: '冷盘：白斩草鸡、崇明白山羊肉、五香牛肉、糟凤爪、油爆虾、香干马兰头、崇明金瓜丝、盐水花生。\n热菜：清蒸崇明清水大闸蟹、清蒸鲥鱼、红烧生态老鹅、崇明传统圆子、扣三丝、香菇炒青菜。\n点心：崇明印糕、鲜肉馄饨。',
    riskWarningsDetected: [],
    cookHealthCertImages: ['cert_img_01.jpg', 'cert_img_02.jpg'],
    safetyPledgeAgreed: true,
    status: '乡镇已通过',
    auditNote: '申报信息完整，厨师健康证齐全，已电话核验场地水源与冷藏条件，指派村食安联络员全程指导。',
    auditorName: '李主任（城桥镇食安办）',
    assignedInspector: '王执法员',
    createdAt: '2024-11-10 14:20'
  },
  {
    id: 'dec_20241102',
    teamId: 'team_02',
    teamName: '堡镇金牌喜事一条龙餐饮队',
    declarantName: '沈玉兰',
    declarantPhone: '13611993322',
    reason: '寿宴',
    eventDate: '2024-11-23',
    tablesCount: 16,
    estimatedPeople: 160,
    town: '堡镇',
    detailedAddress: '堡镇南海村村民委员会老年活动中心',
    menuText: '热炒鲜四季豆排骨煲、油焖大虾、草乌老鸭滋补汤（需注意）、清蒸多宝鱼、红烧肉、长寿面。',
    riskWarningsDetected: ['草乌（禁止添加剧毒草药）', '未熟四季豆（皂素及红细胞凝集素风险）'],
    cookHealthCertImages: ['cert_03.jpg'],
    safetyPledgeAgreed: true,
    status: '待乡镇审核',
    auditNote: '系统已拦截高危菜单警告，等待乡镇食药安办勒令剔除违禁食材并下达整改要求。',
    createdAt: '2024-11-12 10:15'
  },
  {
    id: 'dec_20241103',
    teamId: 'team_03',
    teamName: '陈家镇生态生态东滩农家大厨班',
    declarantName: '高卫东',
    declarantPhone: '13501776655',
    reason: '乔迁新居',
    eventDate: '2024-11-28',
    tablesCount: 12,
    estimatedPeople: 120,
    town: '陈家镇',
    detailedAddress: '陈家镇花漂村88号自建院落',
    menuText: '家常农家大拼盘、农家走地土鸡汤、东滩草虾、清炒崇明本地矮脚青菜、时令水果拼盘。',
    riskWarningsDetected: [],
    cookHealthCertImages: ['cert_04.jpg'],
    safetyPledgeAgreed: true,
    status: '现场核查中',
    auditNote: '已通过线上初审，陈家镇食安工作人员计划于办宴当日上午9点到达现场做快检与食品留样监督。',
    auditorName: '张建（陈家镇食安联络员）',
    createdAt: '2024-11-13 16:45'
  }
];

export const INITIAL_DEDUCTION_RECORDS: BanquetDeductionRecord[] = [
  {
    id: 'ded_01',
    teamId: 'team_01',
    teamName: '崇明瀛洲乡味宴席服务队',
    pointsDeducted: 2,
    reason: '现场检查发现有1名帮厨切配时未规范佩戴口罩及工作帽',
    inspectDate: '2024-10-18',
    inspectorName: '陈志坚（城桥镇监管所）',
    town: '城桥镇'
  },
  {
    id: 'ded_02',
    teamId: 'team_02',
    teamName: '堡镇金牌喜事一条龙餐饮队',
    pointsDeducted: 6,
    reason: '聚餐现场未按规范准备专用冷藏柜进行48小时饭菜留样，且未对餐具严格煮沸消毒',
    inspectDate: '2024-10-25',
    inspectorName: '刘明（堡镇市场所）',
    town: '堡镇'
  }
];

export const INITIAL_RIDERS: RiderCertification[] = [
  {
    id: 'rider_01',
    userId: 'usr_001',
    riderName: '陈建国',
    phone: '13817658899',
    platform: '美团外卖',
    riderBadgeNumber: 'MT-SH-CM-88391',
    badgeImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80',
    status: '已认证',
    createdAt: '2024-02-18'
  },
  {
    id: 'rider_02',
    userId: 'usr_002',
    riderName: '王晓亮',
    phone: '13916223344',
    platform: '饿了么',
    riderBadgeNumber: 'ELE-2024-99120',
    badgeImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80',
    status: '已认证',
    createdAt: '2024-03-01'
  },
  {
    id: 'rider_03',
    userId: 'usr_003',
    riderName: '周强',
    phone: '13764551122',
    platform: '闪送/顺丰同城',
    riderBadgeNumber: 'SF-TC-10293',
    badgeImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80',
    status: '待审核',
    createdAt: '2024-11-12'
  }
];

export const INITIAL_WHISTLE_REPORTS: WhistleblowerReport[] = [
  {
    id: 'w_2024110801',
    category: 'food',
    reporterType: '骑手',
    reporterId: 'usr_001',
    reporterName: '陈建国（先锋骑手）',
    reporterPhone: '13817658899',
    targetName: '城桥镇xx麻辣香锅店',
    town: '城桥镇',
    locationAddress: '城桥镇八一路210号内街后巷',
    issueTypes: ['环境脏乱差', '生熟食品混放', '操作人员未戴工作帽口罩'],
    description: '取餐时看到后厨地面污水横流，生冻鸡肉与直接入口的凉菜放在同一个切配台，垃圾桶未加盖且蝇虫较多。',
    evidenceImages: [
      'https://images.unsplash.com/photo-1584727638096-042c45049ebe?w=600&auto=format&fit=crop&q=80'
    ],
    status: '已核实结案',
    assignedDepartment: '城桥市场监督管理所',
    auditComment: '执法人员突击检查属实，现场开具责令改正通知书并罚款2000元，督促该店停业整顿3天。',
    rewardPoints: 5,
    rewardCash: 50,
    createdAt: '2024-11-08 11:42',
    resolvedAt: '2024-11-09 16:30'
  },
  {
    id: 'w_2024111002',
    category: 'drug',
    reporterType: '骑手',
    reporterId: 'usr_002',
    reporterName: '王晓亮（美团骑手）',
    reporterPhone: '13916223344',
    targetName: '堡镇xx益丰大药房便民加盟店',
    town: '堡镇',
    locationAddress: '堡镇正街158号',
    issueTypes: ['执业药师脱岗未挂牌', '处方药与非处方药混放'],
    description: '送买药订单时发现处方药柜台没有执业药师在岗审方，且阴凉药品展示柜温度显示已达28℃，未开启空调。',
    evidenceImages: [
      'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=600&auto=format&fit=crop&q=80'
    ],
    status: '执法核查中',
    assignedDepartment: '堡镇市场监管所药械监管组',
    auditComment: '已转派堡镇所专职执法人员立案核查现场温湿度监控数据及审方记录。',
    rewardPoints: 3,
    rewardCash: 30,
    createdAt: '2024-11-10 15:20'
  },
  {
    id: 'w_2024111303',
    category: 'food',
    reporterType: '公众',
    reporterId: 'usr_009',
    reporterName: '刘女士',
    reporterPhone: '13381992200',
    targetName: '陈家镇东滩海鲜小吃摊',
    town: '陈家镇',
    locationAddress: '陈家镇裕展路菜市场东侧弄口',
    issueTypes: ['疑似无证经营', '无防尘防蝇设施'],
    description: '路边临时摆摊售卖烧烤油炸食品，油烟熏天，没有看到营业执照和食品摊贩登记卡。',
    evidenceImages: [],
    status: '已受理转派',
    assignedDepartment: '陈家镇综合行政执法队 / 陈家镇食安办',
    auditComment: '已录入分流系统，指派网格巡查员前往该点位进行联合检查。',
    rewardPoints: 2,
    rewardCash: 0,
    createdAt: '2024-11-13 18:05'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationMsg[] = [
  {
    id: 'notif_01',
    targetRole: 'all',
    title: '系统通知：崇明区2024年秋冬季农村集体聚餐食品安全预警公告',
    content: '严禁农村自办宴席加工野生河豚鱼、织纹螺、曼陀罗以及未熟四季豆等高风险食品！',
    time: '2024-11-12 09:00',
    read: false,
    type: 'banquet'
  },
  {
    id: 'notif_02',
    targetRole: 'town_admin',
    targetTown: '堡镇',
    title: '【乡镇待办】您收到一笔堡镇农村集体家宴新的网上申报',
    content: '堡镇南海村沈玉兰女士申报16桌寿宴，系统已识别菜单包含高风险警示菜品，请尽快登录审核。',
    time: '2024-11-12 10:16',
    read: false,
    type: 'banquet',
    linkId: 'dec_20241102'
  },
  {
    id: 'notif_03',
    targetRole: 'public',
    title: '吹哨奖励到账通知',
    content: '尊敬的陈建国先生，您反映的“城桥镇xx麻辣香锅店后厨脏乱”线索经核查属实，已奖励您 5 点食安积分与 50 元现金红包！',
    time: '2024-11-09 17:00',
    read: true,
    type: 'points'
  }
];
