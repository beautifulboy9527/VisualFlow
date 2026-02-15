import React, { createContext, useContext, useState, useEffect } from 'react';

export type UILanguage = 'zh' | 'en';

interface Translations {
  [key: string]: {
    zh: string;
    en: string;
  };
}

const LANGUAGE_STORAGE_KEY = 'pixmiller-ui-language';

// UI Translations - Comprehensive dictionary
export const translations: Translations = {
  // === Header ===
  'nav.workbench': { zh: '工作台', en: 'Workbench' },
  'nav.history': { zh: '历史记录', en: 'History' },
  'nav.templates': { zh: '模板库', en: 'Templates' },
  'header.aiDesignStudio': { zh: 'AI 设计工作室', en: 'AI Design Studio' },
  
  // === Mode Toggle ===
  'mode.agent': { zh: '智能', en: 'Agent' },
  'mode.manual': { zh: '手动', en: 'Manual' },
  'mode.aiAnalyzing': { zh: 'AI 分析中', en: 'Analyzing' },
  
  // === Sections ===
  'section.upload': { zh: '商品上传', en: 'Product Upload' },
  'section.productInfo': { zh: '商品信息', en: 'Product Info' },
  'section.platform': { zh: '平台配置', en: 'Platform' },
  'section.scene': { zh: '场景规划', en: 'Scenes' },
  'section.visual': { zh: '视觉风格', en: 'Visual Style' },
  'section.language': { zh: '画面语言', en: 'Language' },
  'section.logo': { zh: 'Logo 设置', en: 'Logo Settings' },
  'section.brand': { zh: '品牌资产', en: 'Brand Assets' },
  
  // === Scene Types ===
  'scene.main': { zh: '主图', en: 'Main' },
  'scene.front': { zh: '正视图', en: 'Front' },
  'scene.side': { zh: '侧视图', en: 'Side' },
  'scene.back': { zh: '背视图', en: 'Back' },
  'scene.whiteBg': { zh: '白底图', en: 'White BG' },
  'scene.detail': { zh: '细节图', en: 'Detail' },
  'scene.lifestyle': { zh: '场景图', en: 'Lifestyle' },
  'scene.promo': { zh: '促销图', en: 'Promo' },
  'scene.sale': { zh: '大促图', en: 'Sale' },
  'scene.specs': { zh: '规格图', en: 'Specs' },
  'scene.store': { zh: '店铺资质', en: 'Store' },
  'scene.custom': { zh: '自定义', en: 'Custom' },
  
  // === Actions ===
  'action.start': { zh: '开始设计', en: 'Generate' },
  'action.startAI': { zh: '开始 AI 分析', en: 'Start AI Analysis' },
  'action.reset': { zh: '重置', en: 'Reset' },
  'action.selectAll': { zh: '全选', en: 'All' },
  'action.deselectAll': { zh: '清空', en: 'Clear' },
  'action.download': { zh: '下载', en: 'Download' },
  'action.downloadAll': { zh: '全部下载', en: 'Download All' },
  'action.regenerate': { zh: '重新生成', en: 'Regenerate' },
  'action.aiRecommend': { zh: 'AI 推荐', en: 'AI Recommend' },
  'action.addCustom': { zh: '添加自定义', en: 'Add Custom' },
  'action.confirm': { zh: '确认生成', en: 'Confirm' },
  'action.refresh': { zh: '刷新方案', en: 'Refresh Plan' },
  'action.undo': { zh: '撤销', en: 'Undo' },
  'action.customize': { zh: '手动调整', en: 'Customize' },
  'action.cancel': { zh: '取消', en: 'Cancel' },
  'action.send': { zh: '发送', en: 'Send' },
  'action.startCreating': { zh: '开始创建', en: 'Start Creating' },
  'action.getStarted': { zh: '立即开始', en: 'Get Started' },
  'action.viewResults': { zh: '查看结果', en: 'View Results' },
  
  // === Labels ===
  'label.brandName': { zh: '品牌名称', en: 'Brand Name' },
  'label.productName': { zh: '产品名称', en: 'Product Name' },
  'label.keywords': { zh: '核心卖点', en: 'Key Features' },
  'label.platform': { zh: '目标平台', en: 'Platform' },
  'label.modules': { zh: '输出模块', en: 'Output Modules' },
  'label.selected': { zh: '已选', en: 'Selected' },
  'label.images': { zh: '张', en: 'images' },
  'label.total': { zh: '合计', en: 'Total' },
  'label.primaryLang': { zh: '主语言', en: 'Primary' },
  'label.secondaryLang': { zh: '副语言', en: 'Secondary' },
  'label.visualStyle': { zh: '视觉风格', en: 'Visual Style' },
  'label.layoutStyle': { zh: '排版效果', en: 'Layout Style' },
  'label.optional': { zh: '可选', en: 'Optional' },
  'label.confidence': { zh: '置信度', en: 'Confidence' },
  'label.colors': { zh: '配色', en: 'Colors' },
  'label.output': { zh: '输出内容', en: 'Output' },
  'label.credits': { zh: '积分', en: 'Credits' },
  'label.scenes': { zh: '场景', en: 'Scenes' },
  'label.currentPlan': { zh: '当前方案', en: 'Current Plan' },
  
  // === Logo Settings ===
  'logo.upload': { zh: '上传 Logo', en: 'Upload Logo' },
  'logo.include': { zh: '包含 Logo', en: 'Include Logo' },
  'logo.position': { zh: 'Logo 位置', en: 'Logo Position' },
  'logo.position.topLeft': { zh: '左上', en: 'Top Left' },
  'logo.position.topRight': { zh: '右上', en: 'Top Right' },
  'logo.position.bottomLeft': { zh: '左下', en: 'Bottom Left' },
  'logo.position.bottomRight': { zh: '右下', en: 'Bottom Right' },
  'logo.position.center': { zh: '居中', en: 'Center' },
  'logo.style': { zh: 'Logo 样式', en: 'Logo Style' },
  'logo.style.original': { zh: '原色', en: 'Original' },
  'logo.style.white': { zh: '白色', en: 'White' },
  'logo.style.black': { zh: '黑色', en: 'Black' },
  
  // === Placeholders ===
  'placeholder.brandAuto': { zh: 'AI 自动识别...', en: 'AI detecting...' },
  'placeholder.brandManual': { zh: '输入品牌名称', en: 'Enter brand name' },
  'placeholder.keywordsAuto': { zh: 'AI 自动提取...', en: 'AI extracting...' },
  'placeholder.keywordsManual': { zh: '输入产品关键词', en: 'Enter keywords' },
  'placeholder.productName': { zh: '输入产品名称', en: 'Enter product name' },
  'placeholder.chatInput': { zh: '告诉 AI 您想调整什么...', en: 'Tell AI what to adjust...' },
  
  // === Status ===
  'status.generating': { zh: '生成中...', en: 'Generating...' },
  'status.aiCreating': { zh: 'AI 正在创作', en: 'AI is creating' },
  'status.complete': { zh: '完成', en: 'Done' },
  'status.analyzing': { zh: 'AI 分析中...', en: 'Analyzing...' },
  'status.ready': { zh: '就绪', en: 'Ready' },
  
  // === Empty states ===
  'empty.title': { zh: '开始创建', en: 'Start Creating' },
  'empty.description': { zh: '上传产品图片开始', en: 'Upload product to start' },
  'empty.step1': { zh: '上传产品图', en: 'Upload' },
  'empty.step2': { zh: 'AI 分析', en: 'Analyze' },
  'empty.step3': { zh: '生成 KV', en: 'Generate' },
  'empty.noImages': { zh: '暂无图片', en: 'No images' },
  'empty.noHistory': { zh: '暂无历史记录', en: 'No history yet' },
  'empty.noTemplates': { zh: '暂无模板', en: 'No templates' },
  
  // === Preview ===
  'preview.title': { zh: '预览', en: 'Preview' },
  'preview.aiPlan': { zh: 'AI 方案', en: 'AI Plan' },
  'preview.basedOnAnalysis': { zh: '基于产品分析', en: 'Based on analysis' },
  'preview.modulePreview': { zh: '模块预览', en: 'Module Preview' },
  
  // === Results ===
  'results.title': { zh: '生成结果', en: 'Generated Results' },
  'results.generationComplete': { zh: '生成完成！', en: 'Generation Complete!' },
  'results.imagesCreated': { zh: '张精美图片已生成', en: 'stunning images created' },
  'results.images': { zh: '张图片', en: 'images' },
  
  // === Canvas ===
  'canvas.title': { zh: '开始创建电商视觉', en: 'Start Creating E-commerce Visuals' },
  'canvas.subtitle': { zh: '上传产品图片，AI 将自动分析并生成专业的电商 KV 设计', en: 'Upload product images, AI will analyze and generate professional e-commerce KV designs' },
  'canvas.step1': { zh: '上传', en: 'Upload' },
  'canvas.step2': { zh: 'AI 分析', en: 'AI Analysis' },
  'canvas.step3': { zh: '生成 KV', en: 'Generate KV' },
  'canvas.readyToStart': { zh: '准备好开始视觉革命了吗？', en: 'Ready to start a visual revolution?' },
  'canvas.readyDesc': { zh: '上传产品图片和品牌 Logo，AI 将深度分析您的品牌 DNA，生成大师级电商 KV 视觉方案', en: 'Upload product images and brand logo, AI will deeply analyze your brand DNA and generate master-level e-commerce KV visual solutions' },
  'canvas.generating': { zh: '正在生成设计...', en: 'Generating designs...' },
  'canvas.aiCrafting': { zh: 'AI 正在创作您的视觉方案', en: 'AI is crafting your visuals' },
  'canvas.complete': { zh: '完成', en: 'complete' },
  
  // === AI Panel ===
  'ai.recommendation': { zh: 'AI 推荐方案', en: 'AI Recommendation' },
  'ai.based_on': { zh: '基于产品特性', en: 'Based on product' },
  'ai.discuss': { zh: '与 AI 讨论', en: 'Discuss with AI' },
  'ai.ask_adjust': { zh: '告诉 AI 您想调整什么...', en: 'Tell AI what to adjust...' },
  'ai.chatMode': { zh: 'AI 对话模式', en: 'AI Chat Mode' },
  'ai.discussInMain': { zh: '在主面板与 AI 讨论方案', en: 'Discuss with AI in main panel' },
  'ai.clickToStart': { zh: '点击主面板「开始 AI 分析」按钮', en: 'Click "Start AI Analysis" in main panel' },
  'ai.readyForDesign': { zh: '准备好开始 AI 智能设计了', en: 'Ready for AI Smart Design' },
  'ai.uploadedImages': { zh: '张产品图片。点击下方按钮，AI 将分析您的产品并生成专属设计方案。', en: 'product image(s) uploaded. Click below to let AI analyze your product and generate a custom design plan.' },
  'ai.analyzingProduct': { zh: 'AI 正在分析您的产品...', en: 'AI is analyzing your product...' },
  'ai.identifyingBrand': { zh: '识别品牌特征...', en: 'Identifying brand features...' },
  'ai.analyzingPoints': { zh: '分析产品卖点', en: 'Analyzing selling points' },
  'ai.generatingPlan': { zh: '生成设计方案', en: 'Generating design plan' },
  'ai.smartMatching': { zh: '智能风格匹配', en: 'Smart Style Matching' },
  'ai.colorExtraction': { zh: '自动配色提取', en: 'Auto Color Extraction' },
  'ai.chatAdjust': { zh: '对话式调整', en: 'Chat to Adjust' },
  
  // === Quick suggestions ===
  'suggestion.changeStyle': { zh: '换个风格', en: 'Change style' },
  'suggestion.addScenes': { zh: '增加场景', en: 'More scenes' },
  'suggestion.adjustLayout': { zh: '调整排版', en: 'Adjust layout' },
  'suggestion.optimizeColors': { zh: '优化配色', en: 'Optimize colors' },
  
  // === Homepage ===
  'home.badge': { zh: 'AI 多智能体视觉系统', en: 'AI Multi-Agent Visual System' },
  'home.headline1': { zh: '创建', en: 'Create' },
  'home.headline2': { zh: '惊艳的', en: 'stunning' },
  'home.headline3': { zh: '视觉效果', en: 'visuals' },
  'home.subtitle': { zh: '上传您的产品，AI 处理一切 —— 主图、横幅、社交媒体等。', en: 'Upload your product. AI handles everything — Main KV, Banners, Social, and more.' },
  'home.startCreating': { zh: '开始创建', en: 'Start Creating' },
  'home.start': { zh: '开始', en: 'Start' },
  'home.feature1.title': { zh: '上传', en: 'Upload' },
  'home.feature1.desc': { zh: '拖放您的产品图片', en: 'Drop your product image' },
  'home.feature2.title': { zh: '配置', en: 'Configure' },
  'home.feature2.desc': { zh: 'AI 生成文案与布局', en: 'AI generates copy & layout' },
  'home.feature3.title': { zh: '生成', en: 'Generate' },
  'home.feature3.desc': { zh: '获取全平台适用的视觉素材', en: 'Get all platform-ready visuals' },
  'home.stat1.label': { zh: '生成速度', en: 'Generation' },
  'home.stat2.label': { zh: '准确率', en: 'Accuracy' },
  'home.stat3.label': { zh: '已创建', en: 'Created' },
  'home.humanInLoop': { zh: '人机协作 AI', en: 'Human-in-the-loop AI' },
  'home.ctaTitle': { zh: '准备好改变您的产品视觉了吗？', en: 'Ready to transform your product visuals?' },
  'home.ctaSubtitle': { zh: '无需设计技能，几分钟内获得专业级电商图片', en: 'No design skills needed. Get professional e-commerce images in minutes.' },
  'home.ctaFeature1': { zh: '免费试用', en: 'Free to try' },
  'home.ctaFeature2': { zh: '无需信用卡', en: 'No credit card' },
  'home.ctaFeature3': { zh: '即刻开始', en: 'Start instantly' },
  'home.ctaButton': { zh: '免费开始', en: 'Get Started — Free' },
  'home.privacy': { zh: '隐私政策', en: 'Privacy' },
  'home.terms': { zh: '服务条款', en: 'Terms' },
  
  // === Settings ===
  'settings.title': { zh: '设置', en: 'Settings' },
  'settings.account': { zh: '账户', en: 'Account' },
  'settings.profile': { zh: '个人资料', en: 'Profile' },
  'settings.profileDesc': { zh: '管理您的账户详情', en: 'Manage your account details' },
  'settings.security': { zh: '安全', en: 'Security' },
  'settings.securityDesc': { zh: '密码和双重认证设置', en: 'Password and 2FA settings' },
  'settings.preferences': { zh: '偏好设置', en: 'Preferences' },
  'settings.notifications': { zh: '通知', en: 'Notifications' },
  'settings.notificationsDesc': { zh: '邮件和推送通知', en: 'Email and push notifications' },
  'settings.appearance': { zh: '外观', en: 'Appearance' },
  'settings.appearanceDesc': { zh: '主题和显示设置', en: 'Theme and display settings' },
  'settings.billing': { zh: '账单', en: 'Billing' },
  'settings.creditsPlans': { zh: '积分与套餐', en: 'Credits & Plans' },
  'settings.creditsPlansDesc': { zh: '查看使用量和升级', en: 'View usage and upgrade' },
  'settings.language': { zh: '界面语言', en: 'UI Language' },
  'settings.languageDesc': { zh: '选择您偏好的语言', en: 'Choose your preferred language' },
  'settings.back': { zh: '返回', en: 'Back' },
  'settings.logout': { zh: '退出登录', en: 'Log out' },
  
  // === User menu ===
  'user.profile': { zh: '个人资料', en: 'Profile' },
  'user.settings': { zh: '设置', en: 'Settings' },
  'user.logout': { zh: '退出登录', en: 'Log out' },
  
  // === Upload ===
  'upload.dragDrop': { zh: '拖放图片到此处', en: 'Drag & drop images here' },
  'upload.dropHere': { zh: '将图片拖放到这里', en: 'Drop your images here' },
  'upload.dropOrClick': { zh: '拖放产品图片或点击上传', en: 'Drop product images or click to upload' },
  'upload.hint': { zh: '主图 • 多角度 • 细节图', en: 'Main product shot • Multiple angles • Detail shots' },
  'upload.or': { zh: '或', en: 'or' },
  'upload.browse': { zh: '浏览文件', en: 'Browse files' },
  'upload.selectFile': { zh: '选择文件', en: 'Select File' },
  'upload.additional': { zh: '附加图片', en: 'Additional Images' },
  'upload.mainImage': { zh: '主图', en: 'Main' },
  'upload.angleImage': { zh: '角度图', en: 'Angle' },
  'upload.detailImage': { zh: '细节图', en: 'Detail' },
  'upload.lifestyleImage': { zh: '场景图', en: 'Lifestyle' },
  'upload.modelImage': { zh: '模特图', en: 'Model' },
  'upload.packagingImage': { zh: '包装图', en: 'Packaging' },
  'upload.supportedFormats': { zh: '支持 JPG、PNG，最大 10MB', en: 'JPG, PNG up to 10MB' },
  'upload.aiAnalyzing': { zh: 'AI 正在分析产品...', en: 'AI analyzing product...' },
  'upload.dropImage': { zh: '拖放图片或点击上传', en: 'Drop image or click to upload' },
  
  // === Platforms ===
  'platform.amazon': { zh: 'Amazon', en: 'Amazon' },
  'platform.shopify': { zh: 'Shopify', en: 'Shopify' },
  'platform.tiktok': { zh: 'TikTok Shop', en: 'TikTok Shop' },
  'platform.instagram': { zh: 'Instagram', en: 'Instagram' },
  'platform.xiaohongshu': { zh: '小红书', en: 'Xiaohongshu' },
  'platform.custom': { zh: '自定义', en: 'Custom' },
  
  // === Visual Styles ===
  'style.ai_auto': { zh: 'AI 自动匹配', en: 'AI Auto-match' },
  'style.ai_auto.desc': { zh: '根据产品特性智能推荐', en: 'Smart recommendation based on product' },
  'style.magazine': { zh: '杂志编辑风格', en: 'Magazine Editorial' },
  'style.magazine.desc': { zh: '高级留白，大片感', en: 'Premium layout with bold typography' },
  'style.watercolor': { zh: '水彩艺术风格', en: 'Watercolor Art' },
  'style.watercolor.desc': { zh: '温暖手绘，晕染效果', en: 'Warm hand-drawn effects' },
  'style.tech_futuristic': { zh: '科技未来风格', en: 'Tech Futuristic' },
  'style.tech_futuristic.desc': { zh: '数据光效，冷色调', en: 'Data visualization with cool tones' },
  'style.vintage_film': { zh: '复古胶片风格', en: 'Vintage Film' },
  'style.vintage_film.desc': { zh: '颗粒怀旧，暖色调', en: 'Nostalgic grain with warm colors' },
  'style.minimalist_nordic': { zh: '极简北欧风格', en: 'Minimalist Nordic' },
  'style.minimalist_nordic.desc': { zh: '几何纯净，大留白', en: 'Clean geometric with whitespace' },
  'style.neon_cyberpunk': { zh: '霓虹赛博风格', en: 'Neon Cyberpunk' },
  'style.neon_cyberpunk.desc': { zh: '荧光发光，暗色背景', en: 'Glowing neon on dark backgrounds' },
  'style.natural_organic': { zh: '自然有机风格', en: 'Natural Organic' },
  'style.natural_organic.desc': { zh: '植物环保，大地色系', en: 'Earthy tones with botanical elements' },
  
  // === Layout Styles ===
  'layout.ai_auto': { zh: 'AI 自动匹配', en: 'AI Auto-match' },
  'layout.magazine_grid': { zh: '粗衬线 + 网格', en: 'Bold Serif + Grid' },
  'layout.glassmorphism': { zh: '玻璃拟态卡片', en: 'Glassmorphism' },
  'layout.3d_luxury': { zh: '3D 浮雕奢华', en: '3D Embossed' },
  'layout.handwritten': { zh: '手写艺术风', en: 'Handwritten' },
  'layout.neon_glow': { zh: '霓虹发光', en: 'Neon Glow' },
  'layout.ultra_minimal': { zh: '极细线条极简', en: 'Ultra Minimal' },
  
  // === Toast messages ===
  'toast.switchedToAgent': { zh: '已切换至智能模式', en: 'Switched to Agent Mode' },
  'toast.switchedToManual': { zh: '已切换至手动模式', en: 'Switched to Manual Mode' },
  'toast.agentModeDesc': { zh: 'AI 将为您智能推荐设计方案', en: 'AI will intelligently recommend design plans for you' },
  'toast.manualModeDesc': { zh: '您现在可以自由调整所有配置，点击撤销可恢复', en: 'You can now freely adjust all settings, click undo to restore' },
  'toast.undone': { zh: '已撤销', en: 'Undone' },
  'toast.undoDesc': { zh: '已恢复到上一步配置', en: 'Restored to previous configuration' },
  'toast.aiModuleRecommend': { zh: 'AI 模块推荐', en: 'AI Module Recommendation' },
  'toast.modulesRecommended': { zh: '已为您推荐输出模块', en: 'Recommended output modules for you' },
  'toast.aiAnalysisComplete': { zh: 'AI 分析完成', en: 'AI Analysis Complete' },
  'toast.downloading': { zh: '下载中...', en: 'Downloading...' },
  'toast.downloadingAll': { zh: '下载全部...', en: 'Downloading all...' },
  'toast.regenerating': { zh: '重新生成中...', en: 'Regenerating...' },
  'toast.rateLimited': { zh: 'AI 请求限制', en: 'Rate Limited' },
  'toast.rateLimitedDesc': { zh: '请稍后重试', en: 'Please try again later' },
  'toast.creditsExhausted': { zh: 'AI 额度不足', en: 'Credits Exhausted' },
  'toast.creditsExhaustedDesc': { zh: '请添加额度', en: 'Please add credits' },
  'toast.languageChanged': { zh: '语言已切换', en: 'Language Changed' },
  
  // === Confirmation Modal ===
  'confirm.title': { zh: '确认生成', en: 'Confirm Generation' },
  'confirm.style': { zh: '视觉风格', en: 'Visual Style' },
  'confirm.modules': { zh: '输出模块', en: 'Output Modules' },
  'confirm.totalImages': { zh: '总图片数', en: 'Total Images' },
  'confirm.estimatedTime': { zh: '预计时间', en: 'Est. Time' },
  'confirm.totalCredits': { zh: '消耗积分', en: 'Credits Used' },
  'confirm.insufficientCredits': { zh: '积分不足', en: 'Insufficient credits' },
  'confirm.sufficientCredits': { zh: '积分充足', en: 'Sufficient credits' },
  'confirm.generateNow': { zh: '立即生成', en: 'Generate Now' },
  
  // === History ===
  'history.title': { zh: '历史记录', en: 'History' },
  'history.search': { zh: '搜索历史...', en: 'Search history...' },
  'history.view': { zh: '查看', en: 'View' },
  'history.delete': { zh: '删除', en: 'Delete' },
  'history.createdAt': { zh: '创建于', en: 'Created at' },
  'history.noHistory': { zh: '暂无生成记录', en: 'No generation history yet' },
  'history.noHistoryDesc': { zh: '您生成的图片将显示在这里。开始创建，构建您的历史记录！', en: 'Your generated images will appear here. Start creating to build your history!' },
  'history.noResults': { zh: '未找到相关结果', en: 'No results found for' },
  
  // === Templates ===
  'templates.title': { zh: '模板库', en: 'Templates' },
  'templates.quickStart': { zh: '快速开始模板', en: 'Quick Start Templates' },
  'templates.quickStartDesc': { zh: '选择一个模板快速开始', en: 'Choose a template to get started quickly' },
  'templates.items': { zh: '个模板', en: 'templates' },
  'templates.category.all': { zh: '全部', en: 'All' },
  'templates.category.featured': { zh: '精选', en: 'Featured' },
  'templates.category.minimal': { zh: '极简', en: 'Minimal' },
  'templates.category.vibrant': { zh: '活力', en: 'Vibrant' },
  'templates.category.amazon': { zh: 'Amazon', en: 'Amazon' },
  'templates.category.shopify': { zh: 'Shopify', en: 'Shopify' },
  'templates.category.tiktok': { zh: 'TikTok', en: 'TikTok' },
  'templates.category.xiaohongshu': { zh: '小红书', en: 'Xiaohongshu' },
  'templates.category.holiday': { zh: '节日', en: 'Holiday' },
  'templates.category.food': { zh: '食品饮料', en: 'Food & Beverage' },
  'templates.category.fashion': { zh: '时尚', en: 'Fashion' },
  'templates.category.luxury': { zh: '奢侈品', en: 'Luxury' },
  'templates.category.smart': { zh: '智能', en: 'Smart' },
  'templates.category.beauty': { zh: '美妆', en: 'Beauty' },
  'templates.category.health': { zh: '健康', en: 'Health' },
  'templates.category.tech': { zh: '科技', en: 'Tech' },
  'templates.category.beverage': { zh: '饮品', en: 'Beverage' },
  'templates.category.kids': { zh: '母婴', en: 'Kids' },
  'templates.useTemplate': { zh: '使用模板', en: 'Use Template' },
  'templates.use': { zh: '使用', en: 'Use' },
  'templates.all': { zh: '全部', en: 'All' },
  'templates.loading': { zh: '加载中...', en: 'Loading...' },
  'templates.loaded': { zh: '已加载', en: 'Loaded' },
  'templates.selectToApply': { zh: '点击模板一键应用配置', en: 'Click to apply template settings' },
  'templates.noTemplates': { zh: '暂无模板', en: 'No templates found' },
  
  // Template Items
  'templates.skincare': { zh: '护肤精华', en: 'Skincare Essence' },
  'templates.skincareDesc': { zh: '极简白金风格', en: 'Minimalist white & gold style' },
  'templates.artisanCoffee': { zh: '手工咖啡', en: 'Artisan Coffee' },
  'templates.artisanCoffeeDesc': { zh: '温暖咖啡馆氛围', en: 'Warm café atmosphere' },
  'templates.techEarbuds': { zh: '科技耳机', en: 'Tech Earbuds' },
  'templates.techEarbudsDesc': { zh: '霓虹渐变风格', en: 'Neon gradient style' },
  'templates.kbeauty': { zh: 'K-美妆', en: 'K-Beauty' },
  'templates.kbeautyDesc': { zh: '粉嫩少女风格', en: 'Cute pastel aesthetic' },
  'templates.luxuryBag': { zh: '奢华手袋', en: 'Luxury Handbag' },
  'templates.luxuryBagDesc': { zh: '高端时尚展示', en: 'Premium fashion display' },
  'templates.luxuryWatch': { zh: '奢华腕表', en: 'Luxury Watch' },
  'templates.luxuryWatchDesc': { zh: '暗调奢华风格', en: 'Dark luxury aesthetic' },
  'templates.holidayGift': { zh: '节日礼盒', en: 'Holiday Gift' },
  'templates.holidayGiftDesc': { zh: '温馨节日氛围', en: 'Festive holiday mood' },
  'templates.organicBeauty': { zh: '有机美妆', en: 'Organic Beauty' },
  'templates.organicBeautyDesc': { zh: '自然植物风格', en: 'Natural botanical style' },
  'templates.fitnessSupplement': { zh: '健身补剂', en: 'Fitness Supplement' },
  'templates.fitnessSupplementDesc': { zh: '动感运动风格', en: 'Dynamic sports style' },
  'templates.smartHome': { zh: '智能家居', en: 'Smart Home' },
  'templates.smartHomeDesc': { zh: '现代科技感', en: 'Modern tech aesthetic' },
  'templates.premiumWine': { zh: '高端红酒', en: 'Premium Wine' },
  'templates.premiumWineDesc': { zh: '典雅暗调风格', en: 'Elegant dark mood' },
  'templates.kidsToys': { zh: '儿童玩具', en: 'Kids Toys' },
  'templates.kidsToysDesc': { zh: '活力彩虹风格', en: 'Colorful playful style' },
  
  // Legacy template keys (kept for compatibility)
  'templates.ecommerceHero': { zh: '电商主图', en: 'E-commerce Hero' },
  'templates.ecommerceHeroDesc': { zh: '适合产品列表展示', en: 'Perfect for product listings' },
  'templates.lifestyleScene': { zh: '生活场景', en: 'Lifestyle Scene' },
  'templates.lifestyleSceneDesc': { zh: '展示产品使用场景', en: 'Show product in context' },
  'templates.socialMediaAd': { zh: '社交媒体广告', en: 'Social Media Ad' },
  'templates.socialMediaAdDesc': { zh: '热门视觉风格', en: 'Trending visual styles' },
  'templates.giftBox': { zh: '礼盒包装', en: 'Gift Box' },
  'templates.giftBoxDesc': { zh: '节日促销', en: 'Seasonal promotions' },
  'templates.coffeeProduct': { zh: '咖啡产品', en: 'Coffee Product' },
  'templates.coffeeProductDesc': { zh: '温暖邀请风格', en: 'Warm, inviting style' },
  'templates.fashionItem': { zh: '时尚单品', en: 'Fashion Item' },
  'templates.fashionItemDesc': { zh: '潮流时尚展示', en: 'Trendy fashion display' },
  'templates.aiGenerated': { zh: 'AI 生成', en: 'AI Generated' },
  'templates.aiGeneratedDesc': { zh: 'AI 驱动创意', en: 'AI-powered creativity' },
};

interface LanguageContextType {
  language: UILanguage;
  setLanguage: (lang: UILanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<UILanguage>(() => {
    // First check localStorage
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage === 'zh' || savedLanguage === 'en') {
      return savedLanguage;
    }
    // Fall back to browser language detection
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('zh')) return 'zh';
    return 'en';
  });

  // Persist language to localStorage when it changes
  const setLanguage = (lang: UILanguage) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
