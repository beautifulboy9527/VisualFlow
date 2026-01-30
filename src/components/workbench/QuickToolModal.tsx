import React, { useState, useCallback } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Loader2, 
  Download, 
  RefreshCw,
  Paintbrush,
  ZoomIn,
  Eraser,
  ImagePlus,
  Wand2,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { InpaintingCanvas } from './InpaintingCanvas';

type ToolType = 'inpainting' | 'upscale' | 'remove_bg' | 'scene_replace' | 'product_swap';

interface QuickToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolId: ToolType;
  initialImage?: string;
}

const toolConfig: Record<ToolType, {
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  icon: React.ElementType;
  promptLabel: string;
  promptLabelZh: string;
  promptPlaceholder: string;
  promptPlaceholderZh: string;
  showPrompt: boolean;
  isFullWidth?: boolean;
}> = {
  inpainting: {
    name: 'Inpainting',
    nameZh: '局部重绘',
    description: 'Paint on the image to mark areas you want to edit',
    descriptionZh: '在图片上涂抹标记需要修改的区域',
    icon: Paintbrush,
    promptLabel: 'Describe the edit',
    promptLabelZh: '描述修改内容',
    promptPlaceholder: 'e.g., Replace with blue color, add reflection effect, change to wood texture...',
    promptPlaceholderZh: '例如：替换为蓝色、添加倒影效果、改为木纹材质...',
    showPrompt: true,
    isFullWidth: true,
  },
  upscale: {
    name: 'AI Upscale',
    nameZh: 'AI 超清',
    description: 'Enhance image resolution and quality',
    descriptionZh: '提升图片分辨率和质量',
    icon: ZoomIn,
    promptLabel: '',
    promptLabelZh: '',
    promptPlaceholder: '',
    promptPlaceholderZh: '',
    showPrompt: false,
  },
  remove_bg: {
    name: 'Remove Background',
    nameZh: '智能抠图',
    description: 'Remove background and keep the subject',
    descriptionZh: '去除背景，保留主体',
    icon: Eraser,
    promptLabel: '',
    promptLabelZh: '',
    promptPlaceholder: '',
    promptPlaceholderZh: '',
    showPrompt: false,
  },
  scene_replace: {
    name: 'Scene Replace',
    nameZh: '场景替换',
    description: 'Replace the background with a new scene',
    descriptionZh: '将背景替换为新场景',
    icon: ImagePlus,
    promptLabel: 'Describe new scene',
    promptLabelZh: '描述新场景',
    promptPlaceholder: 'e.g., Modern kitchen, outdoor garden, luxury showroom...',
    promptPlaceholderZh: '例如：现代厨房、户外花园、豪华展厅...',
    showPrompt: true,
  },
  product_swap: {
    name: 'Product Swap',
    nameZh: '商品替换',
    description: 'Replace products while keeping the scene',
    descriptionZh: '保留场景替换商品',
    icon: Wand2,
    promptLabel: 'Describe the change',
    promptLabelZh: '描述修改内容',
    promptPlaceholder: 'e.g., Change product color to red, add a logo...',
    promptPlaceholderZh: '例如：将产品颜色改为红色，添加品牌logo...',
    showPrompt: true,
  },
};

// Quick prompts for inpainting
const quickPrompts = [
  { zh: '替换颜色', en: 'Change color' },
  { zh: '模糊处理', en: 'Blur effect' },
  { zh: '移除对象', en: 'Remove object' },
  { zh: '添加倒影', en: 'Add reflection' },
  { zh: '改变材质', en: 'Change texture' },
  { zh: '调整光影', en: 'Adjust lighting' },
];

export const QuickToolModal: React.FC<QuickToolModalProps> = ({
  isOpen,
  onClose,
  toolId,
  initialImage,
}) => {
  const { language } = useLanguage();
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialImage || null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [maskData, setMaskData] = useState<string | null>(null);

  const config = toolConfig[toolId];
  const Icon = config.icon;
  const isInpainting = toolId === 'inpainting';

  // Handle initial image when modal opens
  React.useEffect(() => {
    if (initialImage && isOpen) {
      setUploadedImage(initialImage);
    }
  }, [initialImage, isOpen]);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: language === 'zh' ? '文件类型错误' : 'Invalid file type',
        description: language === 'zh' ? '请上传图片文件' : 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setResultImage(null);
      setMaskData(null);
    };
    reader.readAsDataURL(file);
  }, [language]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMaskComplete = useCallback((mask: string, combined: string) => {
    setMaskData(mask);
  }, []);

  const handleQuickPromptClick = (promptText: string) => {
    setPrompt(prev => {
      if (prev.trim()) {
        return `${prev}, ${promptText}`;
      }
      return promptText;
    });
  };

  const handleProcess = async () => {
    if (!uploadedImage) {
      toast({
        title: language === 'zh' ? '请先上传图片' : 'Please upload an image first',
        variant: 'destructive',
      });
      return;
    }

    if (isInpainting && !maskData) {
      toast({
        title: language === 'zh' ? '请先涂抹需要修改的区域' : 'Please paint the area to edit first',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Build the prompt for inpainting with mask info
      let finalPrompt = prompt;
      if (isInpainting && maskData) {
        finalPrompt = `Edit the marked/highlighted areas in this image. ${prompt || 'Make the changes look natural and seamless.'}`;
      }

      const { data, error } = await supabase.functions.invoke('image-tools', {
        body: {
          tool: toolId,
          imageUrl: uploadedImage,
          prompt: finalPrompt || undefined,
          newScene: toolId === 'scene_replace' ? prompt : undefined,
          maskArea: toolId === 'inpainting' ? (prompt || 'the marked area') : undefined,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Processing failed');
      }

      setResultImage(data.imageUrl);
      toast({
        title: language === 'zh' ? '处理完成' : 'Processing Complete',
        description: data.message,
      });

    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: language === 'zh' ? '处理失败' : 'Processing Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `${toolId}-result.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: language === 'zh' ? '下载成功' : 'Download Started',
    });
  };

  const handleReset = () => {
    setUploadedImage(null);
    setResultImage(null);
    setPrompt('');
    setMaskData(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  // Inpainting has a special full-width layout
  if (isInpainting) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-primary" />
              {language === 'zh' ? config.nameZh : config.name}
            </DialogTitle>
            <DialogDescription>
              {language === 'zh' ? config.descriptionZh : config.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {!uploadedImage ? (
              /* Upload Zone */
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                  "relative border-2 border-dashed rounded-xl transition-all duration-300",
                  "min-h-[300px] flex items-center justify-center",
                  isDragging 
                    ? "border-primary bg-primary/5" 
                    : "border-border/50 hover:border-primary/50"
                )}
              >
                <label className="flex flex-col items-center gap-3 p-8 cursor-pointer">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      {language === 'zh' ? '拖拽图片到此处' : 'Drop image here'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {language === 'zh' ? '或点击选择文件' : 'or click to select'}
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                  />
                </label>
              </div>
            ) : !resultImage ? (
              /* Inpainting Canvas */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUploadedImage(null)}
                    className="text-muted-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    {language === 'zh' ? '重新选择图片' : 'Choose different image'}
                  </Button>
                </div>

                <InpaintingCanvas
                  imageUrl={uploadedImage}
                  onMaskComplete={handleMaskComplete}
                />

                {/* Enhanced Prompt Section with Quick Tags */}
                <div className="space-y-3 p-4 bg-muted/20 rounded-xl border border-border/30">
                  <Label className="text-sm font-medium">
                    {language === 'zh' ? config.promptLabelZh : config.promptLabel}
                  </Label>
                  
                  {/* Quick Prompt Tags */}
                  <div className="flex flex-wrap gap-2">
                    {quickPrompts.map((qp, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => handleQuickPromptClick(language === 'zh' ? qp.zh : qp.en)}
                      >
                        {language === 'zh' ? qp.zh : qp.en}
                      </Badge>
                    ))}
                  </div>

                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={language === 'zh' ? config.promptPlaceholderZh : config.promptPlaceholder}
                    className="min-h-[80px] resize-none bg-background"
                  />
                </div>

                {/* Process Button */}
                <Button
                  onClick={handleProcess}
                  disabled={!uploadedImage || !maskData || isProcessing}
                  className="w-full"
                  variant="generate"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {language === 'zh' ? '处理中...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <Icon className="h-4 w-4 mr-2" />
                      {language === 'zh' ? '开始处理' : 'Start Processing'}
                    </>
                  )}
                </Button>
              </div>
            ) : (
              /* Result Display */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>{language === 'zh' ? '处理结果' : 'Result'}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-muted-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    {language === 'zh' ? '处理新图片' : 'Process new image'}
                  </Button>
                </div>
                
                <div className="flex justify-center rounded-xl border border-border/30 overflow-hidden bg-muted/20 p-4">
                  <img 
                    src={resultImage} 
                    alt="Result" 
                    className="max-w-full max-h-[500px] object-contain rounded-lg"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setResultImage(null);
                      setMaskData(null);
                    }}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {language === 'zh' ? '继续编辑' : 'Continue Editing'}
                  </Button>
                  <Button
                    onClick={handleDownload}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {language === 'zh' ? '下载图片' : 'Download'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Standard layout for other tools
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            {language === 'zh' ? config.nameZh : config.name}
          </DialogTitle>
          <DialogDescription>
            {language === 'zh' ? config.descriptionZh : config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Input Section */}
          <div className="space-y-4">
            <Label>{language === 'zh' ? '上传图片' : 'Upload Image'}</Label>
            
            {/* Upload Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                "relative border-2 border-dashed rounded-xl transition-all duration-300 overflow-hidden",
                "min-h-[250px] flex items-center justify-center",
                isDragging 
                  ? "border-primary bg-primary/5" 
                  : "border-border/50 hover:border-primary/50",
                uploadedImage && "border-solid border-primary/30"
              )}
            >
              {uploadedImage ? (
                <div className="relative w-full h-full">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded" 
                    className="w-full h-auto max-h-[350px] object-contain"
                  />
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-3 p-8 cursor-pointer">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      {language === 'zh' ? '拖拽图片到此处' : 'Drop image here'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {language === 'zh' ? '或点击选择文件' : 'or click to select'}
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                  />
                </label>
              )}
            </div>

            {/* Prompt Input */}
            {config.showPrompt && (
              <div className="space-y-2">
                <Label>
                  {language === 'zh' ? config.promptLabelZh : config.promptLabel}
                </Label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={language === 'zh' ? config.promptPlaceholderZh : config.promptPlaceholder}
                  className="min-h-[100px] resize-none"
                />
              </div>
            )}

            {/* Process Button */}
            <Button
              onClick={handleProcess}
              disabled={!uploadedImage || isProcessing}
              className="w-full"
              variant="generate"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {language === 'zh' ? '处理中...' : 'Processing...'}
                </>
              ) : (
                <>
                  <Icon className="h-4 w-4 mr-2" />
                  {language === 'zh' ? '开始处理' : 'Start Processing'}
                </>
              )}
            </Button>
          </div>

          {/* Result Section */}
          <div className="space-y-4">
            <Label>{language === 'zh' ? '处理结果' : 'Result'}</Label>
            
            <div className={cn(
              "border-2 border-dashed rounded-xl min-h-[250px] flex items-center justify-center overflow-hidden",
              resultImage ? "border-solid border-primary/30" : "border-border/50"
            )}>
              {resultImage ? (
                <div className="relative w-full">
                  <img 
                    src={resultImage} 
                    alt="Result" 
                    className="w-full h-auto max-h-[350px] object-contain"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={handleDownload}
                      className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                      title={language === 'zh' ? '下载' : 'Download'}
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8">
                  <div className="p-4 rounded-full bg-muted/50 mx-auto w-fit mb-3">
                    <Icon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'zh' ? '处理后的图片将显示在这里' : 'Processed image will appear here'}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {resultImage && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {language === 'zh' ? '重新生成' : 'Regenerate'}
                </Button>
                <Button
                  onClick={handleDownload}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {language === 'zh' ? '下载图片' : 'Download'}
                </Button>
              </div>
            )}

            {/* Tips */}
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs text-muted-foreground">
                {toolId === 'upscale' && (language === 'zh' 
                  ? 'AI 将自动提升图片清晰度和细节' 
                  : 'AI will automatically enhance image clarity and details')}
                {toolId === 'remove_bg' && (language === 'zh' 
                  ? 'AI 将自动识别主体并移除背景' 
                  : 'AI will automatically detect subject and remove background')}
                {toolId === 'scene_replace' && (language === 'zh' 
                  ? '描述您想要的新场景或背景' 
                  : 'Describe the new scene or background you want')}
                {toolId === 'product_swap' && (language === 'zh' 
                  ? '描述您想要对产品做的修改' 
                  : 'Describe the changes you want to make to the product')}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickToolModal;
