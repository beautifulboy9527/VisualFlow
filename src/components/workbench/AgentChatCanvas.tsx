import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot,
  RefreshCw,
  Check,
  Palette,
  Type,
  Layers,
  Package,
  Loader2,
  ChevronRight,
  User,
  Play,
  Zap,
  ArrowRight,
  MessageSquare,
  Lightbulb,
  Wand2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { VisualStyleId, LayoutStyleId, visualStyles, layoutStyles } from './VisualStylePicker';
import { ProductAnalysis } from '@/lib/aiAnalysis';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  planUpdate?: {
    visualStyle?: VisualStyleId;
    layoutStyle?: LayoutStyleId;
    modules?: { id: string; name: string; aspectRatio: string }[];
    scenes?: string[];
  };
}

interface AgentChatCanvasProps {
  // Product data
  analysis: ProductAnalysis | null;
  isAnalyzing: boolean;
  
  // AI Recommended config
  recommendedVisualStyle: VisualStyleId;
  recommendedLayoutStyle: LayoutStyleId;
  recommendedScenes: string[];
  recommendedModules: { id: string; name: string; aspectRatio: string }[];
  
  // Image count
  totalImages: number;
  aiRecommendedCount?: number;
  uploadedImagesCount: number;
  
  // Actions
  onConfirm: () => void;
  onRefresh: () => void;
  onCustomize: () => void;
  onStartAnalysis: () => void;
  onUpdatePlan?: (update: {
    visualStyle?: VisualStyleId;
    layoutStyle?: LayoutStyleId;
    modules?: { id: string; name: string; aspectRatio: string }[];
    scenes?: string[];
  }) => void;
  isRefreshing: boolean;
  isReady: boolean;
}

// Quick suggestion chips
const quickSuggestions = {
  zh: [
    { icon: <Palette className="h-3.5 w-3.5" />, text: '换个风格', query: '帮我换一个更简约的风格' },
    { icon: <Layers className="h-3.5 w-3.5" />, text: '增加场景', query: '多增加一些场景变化' },
    { icon: <Type className="h-3.5 w-3.5" />, text: '调整排版', query: '排版风格调整得更现代一些' },
    { icon: <Wand2 className="h-3.5 w-3.5" />, text: '优化配色', query: '根据产品优化配色方案' },
  ],
  en: [
    { icon: <Palette className="h-3.5 w-3.5" />, text: 'Change style', query: 'Change to a more minimal style' },
    { icon: <Layers className="h-3.5 w-3.5" />, text: 'More scenes', query: 'Add more scene variations' },
    { icon: <Type className="h-3.5 w-3.5" />, text: 'Adjust layout', query: 'Make the layout more modern' },
    { icon: <Wand2 className="h-3.5 w-3.5" />, text: 'Optimize colors', query: 'Optimize the color scheme' },
  ],
};

export const AgentChatCanvas: React.FC<AgentChatCanvasProps> = ({
  analysis,
  isAnalyzing,
  recommendedVisualStyle,
  recommendedLayoutStyle,
  recommendedScenes,
  recommendedModules,
  totalImages,
  aiRecommendedCount,
  uploadedImagesCount,
  onConfirm,
  onRefresh,
  onCustomize,
  onStartAnalysis,
  onUpdatePlan,
  isRefreshing,
  isReady,
}) => {
  const { language } = useLanguage();
  const [chatInput, setChatInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Initialize chat with welcome message when analysis is ready
  useEffect(() => {
    if (analysis && chatMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: language === 'zh' 
          ? `我已完成对您产品「${analysis.productName?.zh || analysis.brandName.zh}」的分析，并为您生成了专属设计方案：\n\n• 视觉风格：${visualStyles.find(s => s.id === recommendedVisualStyle)?.nameZh || '智能推荐'}\n• 排版风格：${layoutStyles.find(s => s.id === recommendedLayoutStyle)?.nameZh || '智能推荐'}\n• 输出内容：${recommendedModules.length} 个模块 + ${recommendedScenes.length} 个场景\n\n您可以直接确认开始生成，或者告诉我您想要调整的地方。`
          : `I've analyzed your product "${analysis.productName?.en || analysis.brandName.en}" and generated a custom design plan:\n\n• Visual: ${visualStyles.find(s => s.id === recommendedVisualStyle)?.name || 'AI Auto'}\n• Layout: ${layoutStyles.find(s => s.id === recommendedLayoutStyle)?.name || 'AI Auto'}\n• Output: ${recommendedModules.length} modules + ${recommendedScenes.length} scenes\n\nYou can confirm to start generating, or tell me what you'd like to adjust.`,
        timestamp: new Date(),
      };
      setChatMessages([welcomeMessage]);
    }
  }, [analysis, recommendedVisualStyle, recommendedLayoutStyle, recommendedModules.length, recommendedScenes.length, language]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const currentVisualStyle = visualStyles.find(s => s.id === recommendedVisualStyle);
  const currentLayoutStyle = layoutStyles.find(s => s.id === recommendedLayoutStyle);

  const handleSendMessage = async (customMessage?: string) => {
    const messageText = customMessage || chatInput;
    if (!messageText.trim() || isAITyping) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsAITyping(true);
    
    // Simulate AI response with plan update
    setTimeout(() => {
      const userInput = messageText.toLowerCase();
      let responseContent = '';
      let planUpdate: ChatMessage['planUpdate'] = undefined;
      
      // Check for style change requests
      if (userInput.includes('风格') || userInput.includes('style') || userInput.includes('简约') || userInput.includes('minimal')) {
        responseContent = language === 'zh'
          ? '好的，我已将视觉风格调整为「北欧极简」，这种风格更加简洁大气，适合展现产品的质感。方案已更新，您可以查看下方预览。'
          : 'Done! I\'ve updated the visual style to "Nordic Minimal" - clean and elegant to showcase product quality. The plan has been updated.';
        planUpdate = {
          visualStyle: 'minimalist_nordic' as VisualStyleId,
        };
      } else if (userInput.includes('场景') || userInput.includes('scene') || userInput.includes('更多')) {
        responseContent = language === 'zh'
          ? '我理解您想要更多场景变化。已为您增加了"悬浮展示"和"俯视角度"场景，让产品展示更加丰富多样。'
          : 'I understand you want more scene variety. I\'ve added "Floating Display" and "Top-Down View" scenes for richer product presentation.';
        planUpdate = {
          scenes: [...recommendedScenes, 'floating', 'top_view'],
        };
      } else if (userInput.includes('模块') || userInput.includes('module') || userInput.includes('尺寸')) {
        responseContent = language === 'zh'
          ? '已根据您的需求调整了输出模块配置。如需进一步定制，您可以切换到手动模式进行精细调整。'
          : 'I\'ve adjusted the output modules based on your needs. For further customization, you can switch to manual mode.';
      } else if (userInput.includes('配色') || userInput.includes('color') || userInput.includes('颜色')) {
        responseContent = language === 'zh'
          ? `当前配色方案基于产品分析：主色 ${analysis?.colorPalette?.primary || '#7C3AED'}，辅色 ${analysis?.colorPalette?.secondary || '#A78BFA'}。如需自定义配色，建议切换到手动模式。`
          : `Current color scheme is based on product analysis: Primary ${analysis?.colorPalette?.primary || '#7C3AED'}, Secondary ${analysis?.colorPalette?.secondary || '#A78BFA'}. For custom colors, switch to manual mode.`;
      } else if (userInput.includes('排版') || userInput.includes('layout') || userInput.includes('现代')) {
        responseContent = language === 'zh'
          ? '好的，我已将排版风格调整为「毛玻璃卡片」，这种风格更加现代时尚，视觉层次感更强。'
          : 'Done! I\'ve updated the layout to "Glassmorphism Cards" - a more modern and trendy style with better visual hierarchy.';
        planUpdate = {
          layoutStyle: 'glassmorphism' as LayoutStyleId,
        };
      } else {
        responseContent = language === 'zh'
          ? '好的，我理解您的需求。让我为您优化设计方案...\n\n已根据您的反馈调整了方案，现在的配置更加贴合您的预期。如果满意，可以直接确认开始生成。'
          : 'Got it! Let me optimize the design plan for you...\n\nI\'ve adjusted the plan based on your feedback. If you\'re satisfied, you can confirm to start generating.';
      }
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        planUpdate,
      };
      
      setChatMessages(prev => [...prev, assistantMessage]);
      setIsAITyping(false);
      
      // Apply plan update if available
      if (planUpdate && onUpdatePlan) {
        onUpdatePlan(planUpdate);
      }
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleButtonClick = (buttonId: string, action: () => void) => {
    setIsButtonPressed(buttonId);
    setTimeout(() => setIsButtonPressed(null), 300);
    action();
  };

  // Pre-analysis state - show "Start Analysis" button
  if (!analysis && !isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 animate-fade-in">
        <div className="max-w-lg w-full text-center">
          {/* Hero Icon */}
          <div className="relative mb-8 inline-block">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10 border border-primary/30 animate-glow-pulse">
              <Bot className="h-16 w-16 text-primary" />
            </div>
            <div className="absolute -inset-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-[2rem] blur-2xl -z-10 animate-pulse" />
            {/* Decorative dots */}
            <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="absolute bottom-4 left-0 w-2 h-2 rounded-full bg-accent-foreground/60 animate-bounce" style={{ animationDelay: '200ms' }} />
          </div>
          
          <h2 className="text-2xl font-display font-bold text-foreground mb-3">
            {language === 'zh' ? '准备好开始 AI 智能设计了' : 'Ready for AI Smart Design'}
          </h2>
          <p className="text-foreground-muted mb-6 leading-relaxed">
            {language === 'zh' 
              ? `已上传 ${uploadedImagesCount} 张产品图片。点击下方按钮，AI 将分析您的产品并生成专属设计方案。`
              : `${uploadedImagesCount} product image(s) uploaded. Click below to let AI analyze your product and generate a custom design plan.`}
          </p>
          
          {/* Start Analysis Button - Large and Prominent */}
          <Button
            variant="generate"
            size="lg"
            onClick={() => handleButtonClick('start', onStartAnalysis)}
            className={cn(
              "relative px-8 py-6 text-lg font-semibold transition-all duration-300",
              "bg-gradient-primary hover:shadow-primary-glow hover:scale-[1.02] active:scale-[0.98]",
              isButtonPressed === 'start' && "scale-[0.98] ring-4 ring-primary/30"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg bg-white/20 transition-transform duration-300",
                isButtonPressed === 'start' && "rotate-12"
              )}>
                <Sparkles className="h-5 w-5" />
              </div>
              <span>{language === 'zh' ? '开始 AI 分析' : 'Start AI Analysis'}</span>
              <ArrowRight className={cn(
                "h-5 w-5 transition-transform duration-300",
                isButtonPressed === 'start' ? "translate-x-2" : ""
              )} />
            </div>
          </Button>
          
          {/* Feature hints */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-xs">
            <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card/50 border border-border/30">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wand2 className="h-4 w-4 text-primary" />
              </div>
              <span className="text-foreground-muted">{language === 'zh' ? '智能风格匹配' : 'Smart Matching'}</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card/50 border border-border/30">
              <div className="p-2 rounded-lg bg-accent/20">
                <Palette className="h-4 w-4 text-accent-foreground" />
              </div>
              <span className="text-foreground-muted">{language === 'zh' ? '自动配色提取' : 'Color Extraction'}</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card/50 border border-border/30">
              <div className="p-2 rounded-lg bg-success/10">
                <MessageSquare className="h-4 w-4 text-success" />
              </div>
              <span className="text-foreground-muted">{language === 'zh' ? '对话式调整' : 'Chat to Adjust'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Analyzing state - beautiful loading
  if (isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 animate-fade-in">
        <div className="max-w-md w-full text-center">
          {/* Animated AI Icon */}
          <div className="relative mb-8 inline-block">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 animate-glow-pulse">
              <Bot className="h-16 w-16 text-primary animate-pulse" />
            </div>
            <div className="absolute -inset-6 bg-primary/10 rounded-[2rem] blur-2xl -z-10 animate-pulse" />
            
            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
              <div className="absolute -top-2 left-1/2 w-3 h-3 rounded-full bg-primary shadow-primary-glow" />
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
              <div className="absolute top-1/2 -right-2 w-2 h-2 rounded-full bg-accent-foreground" />
            </div>
          </div>
          
          <h3 className="text-xl font-display font-bold text-foreground mb-3">
            {language === 'zh' ? 'AI 正在分析您的产品...' : 'AI is analyzing your product...'}
          </h3>
          
          {/* Progress Steps */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20 animate-pulse">
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
              <span className="text-sm text-foreground">
                {language === 'zh' ? '识别品牌特征...' : 'Identifying brand features...'}
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/30 opacity-60">
              <div className="w-4 h-4 rounded-full border-2 border-border/50" />
              <span className="text-sm text-foreground-muted">
                {language === 'zh' ? '分析产品卖点' : 'Analyzing selling points'}
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/30 opacity-40">
              <div className="w-4 h-4 rounded-full border-2 border-border/50" />
              <span className="text-sm text-foreground-muted">
                {language === 'zh' ? '生成设计方案' : 'Generating design plan'}
              </span>
            </div>
          </div>
          
          {/* Bouncing dots */}
          <div className="flex justify-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-background to-background-secondary">
      {/* Chat Messages Area - ChatGPT/Gemini style */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {chatMessages.map((msg, index) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-4 animate-slide-up",
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Avatar */}
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105",
                msg.role === 'assistant' 
                  ? "bg-gradient-primary shadow-primary-glow" 
                  : "bg-secondary"
              )}>
                {msg.role === 'assistant' ? (
                  <Bot className="h-5 w-5 text-primary-foreground" />
                ) : (
                  <User className="h-5 w-5 text-foreground-muted" />
                )}
              </div>
              
              {/* Message Content */}
              <div className={cn(
                "flex-1 max-w-[85%] space-y-2",
                msg.role === 'user' ? 'items-end' : 'items-start'
              )}>
                <div className={cn(
                  "px-5 py-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm",
                  msg.role === 'assistant'
                    ? "bg-card border border-border/50 text-foreground rounded-tl-md"
                    : "bg-gradient-primary text-primary-foreground rounded-tr-md shadow-primary-glow/50"
                )}>
                  {msg.content}
                </div>
                
                {/* Plan Update Indicator with animation */}
                {msg.planUpdate && (
                  <div className="flex items-center gap-2 text-xs text-primary animate-fade-in">
                    <div className="p-1 rounded-md bg-primary/10">
                      <Sparkles className="h-3 w-3" />
                    </div>
                    <span className="font-medium">{language === 'zh' ? '方案已更新' : 'Plan updated'}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* AI Typing Indicator - Enhanced */}
          {isAITyping && (
            <div className="flex gap-4 animate-fade-in">
              <div className="w-10 h-10 rounded-2xl bg-gradient-primary shadow-primary-glow flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary-foreground animate-pulse" />
              </div>
              <div className="px-5 py-4 rounded-2xl rounded-tl-md bg-card border border-border/50 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-foreground-muted ml-2">
                    {language === 'zh' ? 'AI 正在思考...' : 'AI is thinking...'}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Bottom Panel - Plan Summary + Input */}
      <div className="border-t border-border/30 bg-card/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
          {/* Plan Summary Cards - Horizontal scroll */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {/* Visual Style Card */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/20 shrink-0 hover:bg-primary/10 transition-colors cursor-pointer group">
              {currentVisualStyle?.icon && (
                <span className="text-primary group-hover:scale-110 transition-transform">{currentVisualStyle.icon}</span>
              )}
              <div className="text-sm">
                <span className="text-foreground-muted">{language === 'zh' ? '风格' : 'Style'}:</span>
                <span className="font-medium text-foreground ml-1.5">
                  {language === 'zh' ? currentVisualStyle?.nameZh : currentVisualStyle?.name}
                </span>
              </div>
            </div>
            
            {/* Layout Card */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/30 shrink-0 hover:bg-secondary transition-colors cursor-pointer group">
              {currentLayoutStyle?.icon && (
                <span className="text-foreground-muted group-hover:scale-110 transition-transform">{currentLayoutStyle.icon}</span>
              )}
              <div className="text-sm">
                <span className="text-foreground-muted">{language === 'zh' ? '排版' : 'Layout'}:</span>
                <span className="font-medium text-foreground ml-1.5">
                  {language === 'zh' ? currentLayoutStyle?.nameZh : currentLayoutStyle?.name}
                </span>
              </div>
            </div>
            
            {/* Output Count Card - only show when there are selections */}
            {totalImages > 0 && (
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-accent/10 border border-accent/20 shrink-0">
                <Layers className="h-4 w-4 text-accent-foreground" />
                <div className="text-sm">
                  <span className="font-bold text-accent-foreground">{totalImages}</span>
                  <span className="text-foreground-muted ml-1.5">{language === 'zh' ? '张输出' : 'images'}</span>
                </div>
              </div>
            )}
            
            {/* Color Palette */}
            {analysis?.colorPalette && (
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-card border border-border/30 shrink-0">
                <div className="flex -space-x-1.5">
                  <div 
                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: analysis.colorPalette.primary }}
                  />
                  <div 
                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: analysis.colorPalette.secondary }}
                  />
                </div>
                <span className="text-xs text-foreground-muted">{language === 'zh' ? '配色' : 'Colors'}</span>
              </div>
            )}
          </div>
          
          {/* Quick Suggestions */}
          {chatMessages.length <= 2 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-foreground-muted flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5" />
                {language === 'zh' ? '快捷指令:' : 'Quick:'}
              </span>
              {(language === 'zh' ? quickSuggestions.zh : quickSuggestions.en).map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(suggestion.query)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-secondary/50 border border-border/30 text-foreground-muted hover:text-foreground hover:bg-secondary hover:border-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {suggestion.icon}
                  {suggestion.text}
                </button>
              ))}
            </div>
          )}
          
          {/* Input + Actions Row */}
          <div className="flex gap-3">
            {/* Chat Input - Enhanced */}
            <div className="flex-1 relative group">
              <input
                ref={inputRef}
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={language === 'zh' ? '告诉 AI 您想要调整什么...' : 'Tell AI what you want to adjust...'}
                className={cn(
                  "w-full pl-5 pr-14 py-4 rounded-2xl text-sm transition-all duration-200",
                  "bg-background border-2 border-border/50",
                  "focus:border-primary/50 focus:shadow-md focus:outline-none",
                  "placeholder:text-foreground-muted/60",
                  isAITyping && "opacity-60 cursor-not-allowed"
                )}
                disabled={isAITyping}
              />
              <button
                onClick={() => handleButtonClick('send', () => handleSendMessage())}
                disabled={!chatInput.trim() || isAITyping}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all duration-200",
                  chatInput.trim() && !isAITyping
                    ? "bg-gradient-primary text-primary-foreground shadow-primary-glow/50 hover:shadow-primary-glow hover:scale-105 active:scale-95"
                    : "bg-secondary text-foreground-muted",
                  isButtonPressed === 'send' && "scale-90"
                )}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            
            {/* Refresh Button */}
            <Button
              variant="secondary"
              size="icon"
              onClick={() => handleButtonClick('refresh', onRefresh)}
              disabled={isRefreshing}
              className={cn(
                "shrink-0 h-14 w-14 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95",
                isButtonPressed === 'refresh' && "scale-90 ring-2 ring-primary/30",
                isRefreshing && "animate-pulse"
              )}
              title={language === 'zh' ? '刷新方案' : 'Refresh Plan'}
            >
              {isRefreshing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <RefreshCw className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  isButtonPressed === 'refresh' && "rotate-180"
                )} />
              )}
            </Button>
            
            {/* Confirm Button - Large and Prominent */}
            <Button
              variant="generate"
              onClick={() => handleButtonClick('confirm', onConfirm)}
              disabled={!isReady || isRefreshing}
              className={cn(
                "shrink-0 h-14 px-8 rounded-2xl font-semibold transition-all duration-200",
                "hover:shadow-primary-glow hover:scale-[1.02] active:scale-[0.98]",
                isButtonPressed === 'confirm' && "scale-95 ring-4 ring-primary/30"
              )}
            >
              <Check className={cn(
                "h-5 w-5 mr-2 transition-transform duration-200",
                isButtonPressed === 'confirm' && "scale-125"
              )} />
              {language === 'zh' ? '确认生成' : 'Confirm'}
            </Button>
          </div>
          
          {/* Bottom Hints */}
          <div className="flex items-center justify-center gap-6 text-xs text-foreground-muted">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" />
              {language === 'zh' ? '对话调整方案' : 'Chat to adjust'}
            </span>
            <span className="w-1 h-1 rounded-full bg-foreground-muted/50" />
            <button
              onClick={onCustomize}
              className="text-primary hover:underline flex items-center gap-1 hover:gap-2 transition-all"
            >
              {language === 'zh' ? '切换手动模式' : 'Switch to Manual'}
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
