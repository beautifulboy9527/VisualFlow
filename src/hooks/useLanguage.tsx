import React, { createContext, useContext, useState, useEffect } from 'react';

export type UILanguage = 'zh' | 'en';

interface Translations {
  [key: string]: {
    zh: string;
    en: string;
  };
}

// UI Translations
export const translations: Translations = {
  // Header
  'nav.workbench': { zh: '工作台', en: 'Workbench' },
  'nav.history': { zh: '历史记录', en: 'History' },
  'nav.templates': { zh: '模板库', en: 'Templates' },
  
  // Mode Toggle
  'mode.agent': { zh: '智能模式', en: 'Agent' },
  'mode.manual': { zh: '手动模式', en: 'Manual' },
  'mode.aiAnalyzing': { zh: 'AI 分析中', en: 'Analyzing' },
  
  // Sections
  'section.upload': { zh: '商品上传', en: 'Upload' },
  'section.productInfo': { zh: '商品信息', en: 'Product' },
  'section.platform': { zh: '平台配置', en: 'Platform' },
  'section.scene': { zh: '场景规划', en: 'Scenes' },
  'section.visual': { zh: '视觉与排版', en: 'Style' },
  'section.language': { zh: '画面语言', en: 'Language' },
  'section.logo': { zh: 'Logo 设置', en: 'Logo' },
  'section.brand': { zh: '品牌资产', en: 'Brand' },
  
  // Scene Types
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
  
  // Actions
  'action.start': { zh: '开始设计', en: 'Generate' },
  'action.reset': { zh: '重置', en: 'Reset' },
  'action.selectAll': { zh: '全选', en: 'All' },
  'action.deselectAll': { zh: '清空', en: 'Clear' },
  'action.download': { zh: '下载', en: 'Download' },
  'action.downloadAll': { zh: '全部下载', en: 'Download All' },
  'action.regenerate': { zh: '重新生成', en: 'Regenerate' },
  'action.aiRecommend': { zh: 'AI 推荐', en: 'AI' },
  'action.addCustom': { zh: '添加自定义', en: 'Add' },
  'action.confirm': { zh: '确认', en: 'Confirm' },
  'action.refresh': { zh: '刷新', en: 'Refresh' },
  'action.undo': { zh: '撤销', en: 'Undo' },
  'action.customize': { zh: '手动调整', en: 'Edit' },
  
  // Labels
  'label.brandName': { zh: '品牌名称', en: 'Brand' },
  'label.keywords': { zh: '核心卖点', en: 'Features' },
  'label.platform': { zh: '目标平台', en: 'Platform' },
  'label.modules': { zh: '输出模块', en: 'Modules' },
  'label.selected': { zh: '已选', en: 'Selected' },
  'label.images': { zh: '张', en: '' },
  'label.total': { zh: '合计', en: 'Total' },
  'label.primaryLang': { zh: '主语言', en: 'Primary' },
  'label.secondaryLang': { zh: '副语言', en: 'Secondary' },
  'label.visualStyle': { zh: '视觉风格', en: 'Visual' },
  'label.layoutStyle': { zh: '排版效果', en: 'Layout' },
  'label.optional': { zh: '可选', en: 'Optional' },
  'label.confidence': { zh: '置信度', en: 'Confidence' },
  'label.colors': { zh: '配色', en: 'Colors' },
  'label.output': { zh: '输出内容', en: 'Output' },
  
  // Logo Settings
  'logo.upload': { zh: '上传 Logo', en: 'Upload Logo' },
  'logo.include': { zh: '包含 Logo', en: 'Include Logo' },
  'logo.position': { zh: 'Logo 位置', en: 'Position' },
  'logo.position.topLeft': { zh: '左上', en: 'Top Left' },
  'logo.position.topRight': { zh: '右上', en: 'Top Right' },
  'logo.position.bottomLeft': { zh: '左下', en: 'Bottom Left' },
  'logo.position.bottomRight': { zh: '右下', en: 'Bottom Right' },
  'logo.position.center': { zh: '居中', en: 'Center' },
  'logo.style': { zh: 'Logo 样式', en: 'Style' },
  'logo.style.original': { zh: '原始', en: 'Original' },
  'logo.style.white': { zh: '白色', en: 'White' },
  'logo.style.black': { zh: '黑色', en: 'Black' },
  
  // Placeholders
  'placeholder.brandAuto': { zh: 'AI 自动识别...', en: 'AI detecting...' },
  'placeholder.brandManual': { zh: '输入品牌名称', en: 'Brand name' },
  'placeholder.keywordsAuto': { zh: 'AI 自动提取...', en: 'AI extracting...' },
  'placeholder.keywordsManual': { zh: '输入产品关键词', en: 'Keywords' },
  
  // Status
  'status.generating': { zh: '生成中...', en: 'Generating...' },
  'status.aiCreating': { zh: 'AI 正在创作', en: 'AI creating' },
  'status.complete': { zh: '完成', en: 'Done' },
  'status.analyzing': { zh: 'AI 分析中...', en: 'Analyzing...' },
  
  // Empty states
  'empty.title': { zh: '开始创建', en: 'Start Creating' },
  'empty.description': { zh: '上传产品图片开始', en: 'Upload to start' },
  'empty.step1': { zh: '上传产品图', en: 'Upload' },
  'empty.step2': { zh: 'AI 分析', en: 'Analyze' },
  'empty.step3': { zh: '生成 KV', en: 'Generate' },
  
  // Preview
  'preview.title': { zh: '预览', en: 'Preview' },
  'preview.aiPlan': { zh: 'AI 方案', en: 'AI Plan' },
  'preview.basedOnAnalysis': { zh: '基于分析生成', en: 'Based on analysis' },
  'preview.modulePreview': { zh: '模块预览', en: 'Modules' },
  
  // Results
  'results.title': { zh: '生成结果', en: 'Results' },
  
  // AI Panel
  'ai.recommendation': { zh: 'AI 推荐方案', en: 'AI Recommendation' },
  'ai.based_on': { zh: '基于产品特性', en: 'Based on product' },
  'ai.discuss': { zh: '与 AI 讨论', en: 'Discuss with AI' },
  'ai.ask_adjust': { zh: '告诉 AI 您想调整什么...', en: 'What to adjust...' },
};

interface LanguageContextType {
  language: UILanguage;
  setLanguage: (lang: UILanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<UILanguage>(() => {
    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('zh')) return 'zh';
    return 'en';
  });

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
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
