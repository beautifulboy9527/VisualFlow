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
  User
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
  
  // Actions
  onConfirm: () => void;
  onRefresh: () => void;
  onCustomize: () => void;
  onUpdatePlan?: (update: {
    visualStyle?: VisualStyleId;
    layoutStyle?: LayoutStyleId;
    modules?: { id: string; name: string; aspectRatio: string }[];
    scenes?: string[];
  }) => void;
  isRefreshing: boolean;
  isReady: boolean;
}

export const AgentChatCanvas: React.FC<AgentChatCanvasProps> = ({
  analysis,
  isAnalyzing,
  recommendedVisualStyle,
  recommendedLayoutStyle,
  recommendedScenes,
  recommendedModules,
  totalImages,
  aiRecommendedCount,
  onConfirm,
  onRefresh,
  onCustomize,
  onUpdatePlan,
  isRefreshing,
  isReady,
}) => {
  const { language } = useLanguage();
  const [chatInput, setChatInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isAITyping) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date(),
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsAITyping(true);
    
    // Simulate AI response with plan update
    setTimeout(() => {
      // Analyze user intent and generate response
      const userInput = chatInput.toLowerCase();
      let responseContent = '';
      let planUpdate: ChatMessage['planUpdate'] = undefined;
      
      // Check for style change requests
      if (userInput.includes('风格') || userInput.includes('style') || userInput.includes('简约') || userInput.includes('minimal')) {
        responseContent = language === 'zh'
          ? '好的，我已将视觉风格调整为「北欧极简」，这种风格更加简洁大气，适合展现产品的质感。方案已更新，您可以查看右侧预览。'
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

  // Loading state
  if (isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 animate-fade-in">
        <div className="relative mb-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
            <Bot className="h-12 w-12 text-primary animate-pulse" />
          </div>
          <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-xl -z-10 animate-pulse" />
        </div>
        <h3 className="text-xl font-display font-bold text-foreground mb-2">
          {language === 'zh' ? 'AI 正在分析您的产品...' : 'AI is analyzing your product...'}
        </h3>
        <p className="text-foreground-muted text-center max-w-md">
          {language === 'zh' 
            ? '识别品牌特征、产品卖点、配色方案和推荐风格' 
            : 'Identifying brand features, product highlights, color scheme and recommended style'}
        </p>
        <div className="flex gap-1 mt-4">
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  // No analysis yet - waiting state
  if (!analysis) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 animate-fade-in">
        <div className="relative mb-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <Package className="h-12 w-12 text-primary" />
          </div>
          <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-xl -z-10" />
        </div>
        <h3 className="text-xl font-display font-bold text-foreground mb-2">
          {language === 'zh' ? '准备开始智能设计' : 'Ready for AI Design'}
        </h3>
        <p className="text-foreground-muted text-center max-w-md mb-6">
          {language === 'zh' 
            ? '上传产品图片并选择平台后，AI 将自动分析并为您推荐完整设计方案' 
            : 'After uploading product images and selecting platform, AI will analyze and recommend a complete design plan'}
        </p>
        <div className="flex items-center gap-4 text-sm text-foreground-secondary">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs text-primary font-medium">1</span>
            </div>
            <span>{language === 'zh' ? '上传产品' : 'Upload'}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-foreground-muted" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs text-primary font-medium">2</span>
            </div>
            <span>{language === 'zh' ? '选平台' : 'Platform'}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-foreground-muted" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-xs text-foreground-muted font-medium">3</span>
            </div>
            <span className="text-foreground-muted">{language === 'zh' ? 'AI 对话' : 'AI Chat'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {chatMessages.map(msg => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3",
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              {/* Avatar */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === 'assistant' 
                  ? "bg-gradient-primary shadow-primary-glow" 
                  : "bg-secondary"
              )}>
                {msg.role === 'assistant' ? (
                  <Bot className="h-4 w-4 text-primary-foreground" />
                ) : (
                  <User className="h-4 w-4 text-foreground-muted" />
                )}
              </div>
              
              {/* Message Content */}
              <div className={cn(
                "max-w-[80%] space-y-2",
                msg.role === 'user' ? 'items-end' : 'items-start'
              )}>
                <div className={cn(
                  "px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap",
                  msg.role === 'assistant'
                    ? "bg-card border border-border/50 text-foreground rounded-tl-md"
                    : "bg-primary text-primary-foreground rounded-tr-md"
                )}>
                  {msg.content}
                </div>
                
                {/* Plan Update Indicator */}
                {msg.planUpdate && (
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <Sparkles className="h-3 w-3" />
                    <span>{language === 'zh' ? '方案已更新' : 'Plan updated'}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* AI Typing Indicator */}
          {isAITyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-primary shadow-primary-glow flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-card border border-border/50">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-foreground-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-foreground-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-foreground-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Current Plan Summary */}
      <div className="border-t border-border/30 bg-card/50 p-4">
        <div className="max-w-3xl mx-auto">
          {/* Plan Cards */}
          <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-2">
            {/* Visual Style Card */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 shrink-0">
              {currentVisualStyle?.icon && (
                <span className="text-primary">{currentVisualStyle.icon}</span>
              )}
              <div className="text-sm">
                <span className="text-foreground-muted">{language === 'zh' ? '风格' : 'Style'}:</span>
                <span className="font-medium text-foreground ml-1">
                  {language === 'zh' ? currentVisualStyle?.nameZh : currentVisualStyle?.name}
                </span>
              </div>
            </div>
            
            {/* Layout Card */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50 border border-border/30 shrink-0">
              {currentLayoutStyle?.icon && (
                <span className="text-foreground-muted">{currentLayoutStyle.icon}</span>
              )}
              <div className="text-sm">
                <span className="text-foreground-muted">{language === 'zh' ? '排版' : 'Layout'}:</span>
                <span className="font-medium text-foreground ml-1">
                  {language === 'zh' ? currentLayoutStyle?.nameZh : currentLayoutStyle?.name}
                </span>
              </div>
            </div>
            
            {/* Output Count Card */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/10 border border-accent/20 shrink-0">
              <Layers className="h-4 w-4 text-accent" />
              <div className="text-sm">
                <span className="font-bold text-accent">{totalImages}</span>
                <span className="text-foreground-muted ml-1">{language === 'zh' ? '张输出' : 'images'}</span>
              </div>
            </div>
            
            {/* Color Palette */}
            {analysis?.colorPalette && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border/30 shrink-0">
                <div className="flex -space-x-1">
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: analysis.colorPalette.primary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: analysis.colorPalette.secondary }}
                  />
                </div>
                <span className="text-xs text-foreground-muted">{language === 'zh' ? '配色' : 'Colors'}</span>
              </div>
            )}
          </div>
          
          {/* Input + Actions */}
          <div className="flex gap-3">
            {/* Chat Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={language === 'zh' ? '告诉 AI 您想要调整什么...' : 'Tell AI what you want to adjust...'}
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-background border border-border/50 text-sm focus:border-primary/50 focus:outline-none transition-colors"
                disabled={isAITyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isAITyping}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors",
                  chatInput.trim() && !isAITyping
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-foreground-muted"
                )}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            
            {/* Action Buttons */}
            <Button
              variant="secondary"
              size="icon"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="shrink-0 h-12 w-12"
              title={language === 'zh' ? '刷新方案' : 'Refresh Plan'}
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="generate"
              onClick={onConfirm}
              disabled={!isReady || isRefreshing}
              className="shrink-0 h-12 px-6"
            >
              <Check className="h-4 w-4 mr-2" />
              {language === 'zh' ? '确认生成' : 'Confirm'}
            </Button>
          </div>
          
          {/* Hint */}
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-foreground-muted">
            <span>{language === 'zh' ? '💡 可以对话调整方案' : '💡 Chat to adjust the plan'}</span>
            <button
              onClick={onCustomize}
              className="text-primary hover:underline"
            >
              {language === 'zh' ? '切换手动模式' : 'Switch to Manual'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
