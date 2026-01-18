import React, { useState } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  Check, 
  Send, 
  MessageCircle,
  Palette,
  Type,
  Layers,
  ChevronDown,
  ChevronUp,
  Loader2,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { VisualStyleId, LayoutStyleId, visualStyles, layoutStyles } from './VisualStylePicker';
import { ProductAnalysis } from '@/lib/aiAnalysis';

interface AgentModePanelProps {
  // Product data
  analysis: ProductAnalysis | null;
  isAnalyzing: boolean;
  
  // AI Recommended config
  recommendedVisualStyle: VisualStyleId;
  recommendedLayoutStyle: LayoutStyleId;
  recommendedScenes: string[];
  recommendedModules: { id: string; name: string; aspectRatio: string }[];
  
  // Actions
  onConfirm: () => void;
  onRefresh: () => void;
  onCustomize: () => void; // Switch to manual mode for customization
  isRefreshing: boolean;
  isReady: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AgentModePanel: React.FC<AgentModePanelProps> = ({
  analysis,
  isAnalyzing,
  recommendedVisualStyle,
  recommendedLayoutStyle,
  recommendedScenes,
  recommendedModules,
  onConfirm,
  onRefresh,
  onCustomize,
  isRefreshing,
  isReady,
}) => {
  const { language } = useLanguage();
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: language === 'zh' 
        ? '我已为您的产品分析完成并生成了推荐方案。您可以直接确认开始生成，或者告诉我您想要调整的地方。'
        : 'I have analyzed your product and generated a recommended design plan. You can confirm to start generating, or tell me what you\'d like to adjust.',
      timestamp: new Date(),
    }
  ]);
  const [isExpanded, setIsExpanded] = useState(true);

  const currentVisualStyle = visualStyles.find(s => s.id === recommendedVisualStyle);
  const currentLayoutStyle = layoutStyles.find(s => s.id === recommendedLayoutStyle);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date(),
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: language === 'zh'
          ? '好的，我理解您的需求。让我为您调整方案...'
          : 'I understand. Let me adjust the plan for you...',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, response]);
    }, 1000);
  };

  // Loading state
  if (isAnalyzing) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-3 rounded-xl bg-gradient-primary shadow-primary-glow">
              <Bot className="h-5 w-5 text-primary-foreground animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-primary/30 blur-xl animate-pulse" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">
              {language === 'zh' ? 'AI 正在分析您的产品...' : 'AI is analyzing your product...'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm text-foreground-muted">
                {language === 'zh' ? '识别品牌、卖点、配色、风格...' : 'Identifying brand, features, colors, style...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No analysis yet
  if (!analysis) {
    return (
      <div className="rounded-2xl border border-border/30 bg-card/50 p-6 text-center">
        <div className="p-4 rounded-full bg-secondary/50 inline-flex mb-3">
          <Sparkles className="h-6 w-6 text-foreground-muted" />
        </div>
        <p className="text-sm text-foreground-muted">
          {language === 'zh' 
            ? '上传产品图片并选择平台后，AI 将自动分析并推荐完整设计方案'
            : 'After uploading product images and selecting platform, AI will analyze and recommend a complete design plan'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* AI Recommendation Card */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
        {/* Header */}
        <div 
          className="flex items-start gap-3 p-4 cursor-pointer hover:bg-primary/5 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="p-2.5 rounded-xl bg-gradient-primary shadow-primary-glow shrink-0">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-foreground">
                {language === 'zh' ? 'AI 推荐方案' : 'AI Recommendation'}
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-primary font-medium px-2 py-0.5 rounded-full bg-primary/10 whitespace-nowrap">
                  {analysis.confidence}%
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-foreground-muted" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-foreground-muted" />
                )}
              </div>
            </div>
            <p className="text-xs text-foreground-muted mt-1 line-clamp-2">
              {language === 'zh' 
                ? `基于「${analysis.productName?.zh || analysis.brandName.zh}」的产品特性`
                : `Based on "${analysis.productName?.en || analysis.brandName.en}"`}
            </p>
          </div>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="px-4 pb-4 space-y-3">
            {/* Recommendation Details - Stack vertically on narrow widths */}
            <div className="space-y-2">
              {/* Visual Style */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-card/80 border border-border/30">
                <div className="flex items-center gap-2 shrink-0">
                  <Palette className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium text-foreground-muted whitespace-nowrap">
                    {language === 'zh' ? '视觉' : 'Visual'}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {currentVisualStyle?.icon && (
                    <span className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
                      {currentVisualStyle.icon}
                    </span>
                  )}
                  <span className="text-sm font-medium text-foreground truncate">
                    {language === 'zh' ? currentVisualStyle?.nameZh : currentVisualStyle?.name}
                  </span>
                </div>
              </div>

              {/* Layout Style */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-card/80 border border-border/30">
                <div className="flex items-center gap-2 shrink-0">
                  <Type className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium text-foreground-muted whitespace-nowrap">
                    {language === 'zh' ? '排版' : 'Layout'}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {currentLayoutStyle?.icon && (
                    <span className="p-1.5 rounded-lg bg-secondary text-foreground-muted shrink-0">
                      {currentLayoutStyle.icon}
                    </span>
                  )}
                  <span className="text-sm font-medium text-foreground truncate">
                    {language === 'zh' ? currentLayoutStyle?.nameZh : currentLayoutStyle?.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Modules & Scenes */}
            <div className="p-3 rounded-xl bg-card/80 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-foreground-muted">
                  {language === 'zh' ? '输出内容' : 'Output'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recommendedModules.slice(0, 3).map(module => (
                  <span 
                    key={module.id} 
                    className="px-2 py-1 text-[11px] rounded-md bg-primary/10 text-primary font-medium"
                  >
                    {module.name}
                  </span>
                ))}
                {recommendedScenes.slice(0, 3).map(scene => (
                  <span 
                    key={scene} 
                    className="px-2 py-1 text-[11px] rounded-md bg-secondary text-foreground-muted"
                  >
                    {scene}
                  </span>
                ))}
                {(recommendedModules.length + recommendedScenes.length) > 6 && (
                  <span className="px-2 py-1 text-[11px] rounded-md bg-secondary text-foreground-muted">
                    +{(recommendedModules.length + recommendedScenes.length) - 6}
                  </span>
                )}
              </div>
            </div>

            {/* Color Palette from Analysis */}
            {analysis.colorPalette && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-card/80 border border-border/30">
                <span className="text-xs font-medium text-foreground-muted whitespace-nowrap">
                  {language === 'zh' ? '配色' : 'Colors'}
                </span>
                <div className="flex items-center gap-1.5">
                  <div 
                    className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: analysis.colorPalette.primary }}
                    title={analysis.colorPalette.primary}
                  />
                  <div 
                    className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: analysis.colorPalette.secondary }}
                    title={analysis.colorPalette.secondary}
                  />
                  <div 
                    className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: analysis.colorPalette.accent }}
                    title={analysis.colorPalette.accent}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              <Button
                variant="generate"
                className="flex-1 h-9"
                onClick={onConfirm}
                disabled={!isReady || isRefreshing}
              >
                <Check className="h-4 w-4" />
                <span className="truncate">{language === 'zh' ? '确认方案' : 'Confirm'}</span>
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="shrink-0 h-9 w-9"
                title={language === 'zh' ? '刷新方案' : 'Refresh'}
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCustomize}
                className="shrink-0 text-xs h-9 px-2"
                title={language === 'zh' ? '手动调整' : 'Customize'}
              >
                {language === 'zh' ? '手动' : 'Edit'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Chat Toggle */}
      <button
        onClick={() => setShowChat(!showChat)}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all",
          showChat 
            ? "bg-primary/10 text-primary border border-primary/20"
            : "bg-secondary/50 text-foreground-muted hover:text-foreground hover:bg-secondary"
        )}
      >
        <MessageCircle className="h-4 w-4" />
        {language === 'zh' ? '与 AI 讨论方案' : 'Discuss with AI'}
        {showChat ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {/* Chat Interface */}
      {showChat && (
        <div className="rounded-xl border border-border/30 bg-card/50 overflow-hidden">
          {/* Messages */}
          <div className="max-h-48 overflow-y-auto p-3 space-y-3">
            {chatMessages.map(msg => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2",
                  msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                  msg.role === 'assistant' 
                    ? "bg-gradient-primary" 
                    : "bg-secondary"
                )}>
                  {msg.role === 'assistant' ? (
                    <Bot className="h-3 w-3 text-primary-foreground" />
                  ) : (
                    <span className="text-xs text-foreground-muted">U</span>
                  )}
                </div>
                <div className={cn(
                  "max-w-[80%] px-3 py-2 rounded-xl text-sm",
                  msg.role === 'assistant'
                    ? "bg-secondary text-foreground"
                    : "bg-primary text-primary-foreground"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-2 border-t border-border/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={language === 'zh' ? '告诉 AI 您想调整什么...' : 'Tell AI what you want to adjust...'}
                className="flex-1 px-3 py-2 rounded-lg bg-background border border-border/50 text-sm focus:border-primary/50 focus:outline-none"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
