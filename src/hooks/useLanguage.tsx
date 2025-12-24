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
  'mode.agent': { zh: '智能模式', en: 'Agent Mode' },
  'mode.manual': { zh: '手动模式', en: 'Manual Mode' },
  'mode.aiAnalyzing': { zh: 'AI 分析中', en: 'AI Analyzing' },
  
  // Sections
  'section.upload': { zh: '商品上传', en: 'Product Upload' },
  'section.productInfo': { zh: '商品信息', en: 'Product Info' },
  'section.platform': { zh: '平台配置', en: 'Platform Config' },
  'section.scene': { zh: '场景规划', en: 'Scene Planning' },
  'section.visual': { zh: '视觉与排版', en: 'Visual & Layout' },
  'section.language': { zh: '画面语言', en: 'Image Language' },
  'section.logo': { zh: 'Logo 设置', en: 'Logo Settings' },
  
  // Scene Types
  'scene.main': { zh: '主图', en: 'Main Image' },
  'scene.front': { zh: '正视图', en: 'Front View' },
  'scene.side': { zh: '侧视图', en: 'Side View' },
  'scene.back': { zh: '背视图', en: 'Back View' },
  'scene.whiteBg': { zh: '白底图', en: 'White BG' },
  'scene.detail': { zh: '细节图', en: 'Detail' },
  'scene.lifestyle': { zh: '场景图', en: 'Lifestyle' },
  'scene.promo': { zh: '促销图', en: 'Promo' },
  'scene.sale': { zh: '大促图', en: 'Sale Event' },
  'scene.specs': { zh: '规格图', en: 'Specs' },
  'scene.store': { zh: '店铺资质', en: 'Store Info' },
  'scene.custom': { zh: '自定义', en: 'Custom' },
  
  // Actions
  'action.start': { zh: '开始设计', en: 'Start Design' },
  'action.reset': { zh: '重置', en: 'Reset' },
  'action.selectAll': { zh: '全选', en: 'Select All' },
  'action.deselectAll': { zh: '取消全选', en: 'Deselect All' },
  'action.download': { zh: '下载', en: 'Download' },
  'action.downloadAll': { zh: '全部下载', en: 'Download All' },
  'action.regenerate': { zh: '重新生成', en: 'Regenerate' },
  'action.aiRecommend': { zh: 'AI 推荐', en: 'AI Recommend' },
  'action.addCustom': { zh: '添加自定义', en: 'Add Custom' },
  
  // Labels
  'label.brandName': { zh: '品牌名称', en: 'Brand Name' },
  'label.keywords': { zh: '核心卖点', en: 'Key Points' },
  'label.platform': { zh: '目标平台', en: 'Target Platform' },
  'label.modules': { zh: '输出模块', en: 'Output Modules' },
  'label.selected': { zh: '已选', en: 'Selected' },
  'label.images': { zh: '张', en: 'images' },
  'label.total': { zh: '合计', en: 'Total' },
  'label.primaryLang': { zh: '主语言', en: 'Primary Lang' },
  'label.secondaryLang': { zh: '副语言', en: 'Secondary Lang' },
  'label.visualStyle': { zh: '视觉风格', en: 'Visual Style' },
  'label.layoutStyle': { zh: '排版细节', en: 'Layout Style' },
  'label.optional': { zh: '可选', en: 'Optional' },
  
  // Logo Settings
  'logo.upload': { zh: '上传 Logo', en: 'Upload Logo' },
  'logo.include': { zh: '包含 Logo', en: 'Include Logo' },
  'logo.position': { zh: 'Logo 位置', en: 'Logo Position' },
  'logo.position.topLeft': { zh: '左上', en: 'Top Left' },
  'logo.position.topRight': { zh: '右上', en: 'Top Right' },
  'logo.position.bottomLeft': { zh: '左下', en: 'Bottom Left' },
  'logo.position.bottomRight': { zh: '右下', en: 'Bottom Right' },
  'logo.position.center': { zh: '居中', en: 'Center' },
  'logo.style': { zh: 'Logo 样式', en: 'Logo Style' },
  'logo.style.original': { zh: '原始', en: 'Original' },
  'logo.style.white': { zh: '白色', en: 'White' },
  'logo.style.black': { zh: '黑色', en: 'Black' },
  
  // Placeholders
  'placeholder.brandAuto': { zh: 'AI 自动识别...', en: 'AI auto-detect...' },
  'placeholder.brandManual': { zh: '输入品牌名称', en: 'Enter brand name' },
  'placeholder.keywordsAuto': { zh: 'AI 自动提取...', en: 'AI auto-extract...' },
  'placeholder.keywordsManual': { zh: '输入产品关键词', en: 'Enter keywords' },
  
  // Status
  'status.generating': { zh: '生成中...', en: 'Generating...' },
  'status.aiCreating': { zh: 'AI 正在创作您的视觉', en: 'AI is creating your visuals' },
  'status.complete': { zh: '完成', en: 'Complete' },
  
  // Empty states
  'empty.title': { zh: '开始创建电商视觉', en: 'Start Creating E-commerce Visuals' },
  'empty.description': { zh: '上传产品图片，AI 将自动分析并生成专业的电商 KV 设计', en: 'Upload product images, AI will analyze and generate professional e-commerce KV designs' },
  'empty.step1': { zh: '上传产品图', en: 'Upload Product' },
  'empty.step2': { zh: 'AI 智能分析', en: 'AI Analysis' },
  'empty.step3': { zh: '生成 KV 设计', en: 'Generate KV' },
  
  // Preview
  'preview.title': { zh: '设计预览', en: 'Design Preview' },
  'preview.aiPlan': { zh: 'AI 设计方案', en: 'AI Design Plan' },
  'preview.basedOnAnalysis': { zh: '基于产品分析自动生成', en: 'Auto-generated based on product analysis' },
  'preview.modulePreview': { zh: '输出模块预览', en: 'Module Preview' },
  
  // Results
  'results.title': { zh: '生成结果', en: 'Generated Results' },
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
