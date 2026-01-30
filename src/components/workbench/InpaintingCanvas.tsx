import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Brush, 
  Eraser, 
  RotateCcw, 
  Move,
  Minus,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface InpaintingCanvasProps {
  imageUrl: string;
  onMaskComplete: (maskDataUrl: string, combinedDataUrl: string) => void;
  className?: string;
}

type Tool = 'brush' | 'eraser' | 'pan';

export const InpaintingCanvas: React.FC<InpaintingCanvasProps> = ({
  imageUrl,
  onMaskComplete,
  className,
}) => {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('brush');
  const [brushSize, setBrushSize] = useState(30);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [hasMask, setHasMask] = useState(false);

  // Load image and set up canvases
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      const maskCanvas = maskCanvasRef.current;
      if (!canvas || !maskCanvas) return;

      // Calculate display size (max 800px width/height while maintaining aspect ratio)
      const maxSize = 800;
      let width = img.width;
      let height = img.height;
      
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = (height / width) * maxSize;
          width = maxSize;
        } else {
          width = (width / height) * maxSize;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      maskCanvas.width = width;
      maskCanvas.height = height;

      setImageSize({ width, height });

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
      }

      // Clear mask canvas
      const maskCtx = maskCanvas.getContext('2d');
      if (maskCtx) {
        maskCtx.clearRect(0, 0, width, height);
      }

      setImageLoaded(true);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Get canvas coordinates from mouse event
  const getCanvasCoords = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left - pan.x) / zoom;
    const y = (clientY - rect.top - pan.y) / zoom;

    return { x, y };
  }, [zoom, pan]);

  // Drawing handlers
  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (tool === 'pan') {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      setLastPanPoint({ x: clientX, y: clientY });
      setIsDrawing(true);
      return;
    }

    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCanvasCoords(e);

    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 0, 100, 0.5)';
    ctx.fill();
    setHasMask(true);
  }, [tool, brushSize, getCanvasCoords]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    if (tool === 'pan') {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - lastPanPoint.x;
      const deltaY = clientY - lastPanPoint.y;
      setPan(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      setLastPanPoint({ x: clientX, y: clientY });
      return;
    }

    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);

    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 0, 100, 0.5)';
    ctx.fill();
  }, [isDrawing, tool, brushSize, getCanvasCoords, lastPanPoint]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Clear mask
  const clearMask = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    setHasMask(false);
  }, []);

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Export mask and combined image
  const exportMask = useCallback(() => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas) return;

    // Create mask data URL (black and white)
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = maskCanvas.width;
    tempCanvas.height = maskCanvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // Draw white background
    tempCtx.fillStyle = 'black';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Get mask data and convert to white on black
    const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    const tempData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    
    for (let i = 0; i < maskData.data.length; i += 4) {
      if (maskData.data[i + 3] > 0) {
        tempData.data[i] = 255;     // R
        tempData.data[i + 1] = 255; // G
        tempData.data[i + 2] = 255; // B
        tempData.data[i + 3] = 255; // A
      }
    }
    tempCtx.putImageData(tempData, 0, 0);

    const maskDataUrl = tempCanvas.toDataURL('image/png');

    // Create combined visualization
    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = canvas.width;
    combinedCanvas.height = canvas.height;
    const combinedCtx = combinedCanvas.getContext('2d');
    if (!combinedCtx) return;

    combinedCtx.drawImage(canvas, 0, 0);
    combinedCtx.drawImage(maskCanvas, 0, 0);

    const combinedDataUrl = combinedCanvas.toDataURL('image/png');

    onMaskComplete(maskDataUrl, combinedDataUrl);
  }, [onMaskComplete]);

  // Auto-export when mask changes
  useEffect(() => {
    if (hasMask) {
      exportMask();
    }
  }, [hasMask, exportMask]);

  // Tool button component with tooltip
  const ToolButton = ({ 
    toolType, 
    icon: Icon, 
    labelZh, 
    labelEn 
  }: { 
    toolType: Tool; 
    icon: React.ElementType; 
    labelZh: string; 
    labelEn: string;
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={tool === toolType ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTool(toolType)}
          className="h-9 w-9 p-0"
        >
          <Icon className="h-4.5 w-4.5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {language === 'zh' ? labelZh : labelEn}
      </TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <div className={cn("flex flex-col gap-4", className)}>
        {/* Optimized Toolbar - Following professional editor layout */}
        <div className="flex flex-wrap items-center gap-4 p-3 bg-muted/30 rounded-xl border border-border/30">
          {/* Left: Tool Selection Group */}
          <div className="flex items-center gap-1 p-1 bg-background rounded-lg border border-border/50">
            <ToolButton toolType="brush" icon={Brush} labelZh="画笔" labelEn="Brush" />
            <ToolButton toolType="eraser" icon={Eraser} labelZh="橡皮擦" labelEn="Eraser" />
            <ToolButton toolType="pan" icon={Move} labelZh="平移" labelEn="Pan" />
          </div>

          {/* Separator */}
          <div className="h-6 w-px bg-border/50" />

          {/* Brush Size - Clear slider style */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {language === 'zh' ? '笔刷' : 'Size'}
            </span>
            <Slider
              value={[brushSize]}
              onValueChange={([v]) => setBrushSize(v)}
              min={5}
              max={100}
              step={5}
              className="w-28"
            />
            <span className="text-sm font-medium w-8 text-center">{brushSize}</span>
          </div>

          {/* Separator */}
          <div className="h-6 w-px bg-border/50" />

          {/* Zoom Controls - Centered percentage */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  className="h-9 w-9 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{language === 'zh' ? '缩小' : 'Zoom Out'}</TooltipContent>
            </Tooltip>
            <span className="text-sm font-medium w-14 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  className="h-9 w-9 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{language === 'zh' ? '放大' : 'Zoom In'}</TooltipContent>
            </Tooltip>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={resetView}
              className="h-9"
            >
              <RotateCcw className="h-4 w-4 mr-1.5" />
              {language === 'zh' ? '重置视图' : 'Reset View'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearMask}
              disabled={!hasMask}
              className="h-9"
            >
              <Eraser className="h-4 w-4 mr-1.5" />
              {language === 'zh' ? '清除涂抹' : 'Clear Mask'}
            </Button>
          </div>
        </div>

        {/* Canvas Container */}
        <div 
          ref={containerRef}
          className="relative overflow-hidden rounded-xl border-2 border-dashed border-border/50 bg-muted/20"
          style={{ 
            minHeight: '500px',
            cursor: tool === 'pan' ? 'grab' : 'crosshair'
          }}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">
                {language === 'zh' ? '加载图片中...' : 'Loading image...'}
              </div>
            </div>
          )}

          <div
            className="relative inline-block"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'top left',
              transition: isDrawing ? 'none' : 'transform 0.1s ease-out',
            }}
          >
            {/* Base Image Canvas */}
            <canvas
              ref={canvasRef}
              className="block"
              style={{ display: imageLoaded ? 'block' : 'none' }}
            />

            {/* Mask Canvas (Overlay) */}
            <canvas
              ref={maskCanvasRef}
              className="absolute top-0 left-0"
              style={{ 
                display: imageLoaded ? 'block' : 'none',
                pointerEvents: 'auto'
              }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[rgba(255,0,100,0.5)]" />
            <span>{language === 'zh' ? '涂抹区域将被AI修改' : 'Painted areas will be edited by AI'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Move className="h-3 w-3" />
            <span>{language === 'zh' ? '使用平移工具或滚轮缩放查看细节' : 'Use pan tool or scroll to zoom'}</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default InpaintingCanvas;
