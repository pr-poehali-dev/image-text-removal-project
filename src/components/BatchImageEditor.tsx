import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface BatchImage {
  file: File;
  preview: string;
  maskDataUrl?: string;
  processing?: boolean;
  processed?: string;
  error?: string;
}

interface BatchImageEditorProps {
  images: BatchImage[];
  onImagesUpdate: (images: BatchImage[]) => void;
  onProcessAll: () => void;
}

export default function BatchImageEditor({ images, onImagesUpdate, onProcessAll }: BatchImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [brushSize, setBrushSize] = useState(30);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { toast } = useToast();

  const currentImage = images[currentImageIndex];

  useEffect(() => {
    if (!currentImage) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      if (currentImage.maskDataUrl) {
        const maskImg = new Image();
        maskImg.onload = () => {
          ctx.drawImage(maskImg, 0, 0);
        };
        maskImg.src = currentImage.maskDataUrl;
      }
    };
    img.src = currentImage.preview;
  }, [currentImage, currentImageIndex]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.globalCompositeOperation = tool === 'brush' ? 'source-over' : 'destination-out';
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    saveMask();
  };

  const saveMask = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    const imageData = canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height);
    if (!imageData) return;

    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const isRed = data[i] > 200 && data[i + 1] < 100 && data[i + 2] < 100;
      if (isRed) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
        data[i + 3] = 255;
      } else {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 255;
      }
    }

    maskCtx.putImageData(imageData, 0, 0);
    const maskDataUrl = maskCanvas.toDataURL('image/png');

    const updatedImages = [...images];
    updatedImages[currentImageIndex] = {
      ...currentImage,
      maskDataUrl
    };
    onImagesUpdate(updatedImages);
  };

  const clearMask = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx || !imageRef.current) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageRef.current, 0, 0);

    const updatedImages = [...images];
    updatedImages[currentImageIndex] = {
      ...currentImage,
      maskDataUrl: undefined
    };
    onImagesUpdate(updatedImages);
  };

  const applyMaskToAll = () => {
    if (!currentImage.maskDataUrl) {
      toast({
        title: "Нет маски",
        description: "Сначала выделите области на текущем изображении",
        variant: "destructive"
      });
      return;
    }

    const updatedImages = images.map(img => ({
      ...img,
      maskDataUrl: currentImage.maskDataUrl
    }));
    onImagesUpdate(updatedImages);
    
    toast({
      title: "Маска применена",
      description: `Маска скопирована на ${images.length} изображений`,
    });
  };

  const nextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const maskedCount = images.filter(img => img.maskDataUrl).length;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Инструмент:</span>
              <Tabs value={tool} onValueChange={(v) => setTool(v as 'brush' | 'eraser')}>
                <TabsList>
                  <TabsTrigger value="brush">
                    <Icon name="Paintbrush" size={16} className="mr-1" />
                    Кисть
                  </TabsTrigger>
                  <TabsTrigger value="eraser">
                    <Icon name="Eraser" size={16} className="mr-1" />
                    Ластик
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center gap-2 flex-1 max-w-xs">
              <Icon name="Circle" size={16} />
              <Slider
                value={[brushSize]}
                onValueChange={(v) => setBrushSize(v[0])}
                min={5}
                max={100}
                step={5}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">{brushSize}px</span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={clearMask}>
                <Icon name="RotateCcw" size={16} className="mr-1" />
                Сбросить
              </Button>
              <Button variant="outline" size="sm" onClick={applyMaskToAll}>
                <Icon name="Copy" size={16} className="mr-1" />
                На все
              </Button>
            </div>
          </div>

          <div className="relative bg-muted rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full h-auto cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
            <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
              {currentImageIndex + 1} / {images.length}
            </div>
            <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
              {tool === 'brush' ? 'Выделите области для удаления' : 'Исправьте выделение'}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Button 
              variant="outline" 
              onClick={prevImage}
              disabled={currentImageIndex === 0}
            >
              <Icon name="ChevronLeft" size={16} className="mr-1" />
              Назад
            </Button>

            <div className="text-sm text-muted-foreground">
              Готовы к обработке: {maskedCount} / {images.length}
            </div>

            <Button 
              variant="outline" 
              onClick={nextImage}
              disabled={currentImageIndex === images.length - 1}
            >
              Далее
              <Icon name="ChevronRight" size={16} className="ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {images.map((img, index) => (
              <div
                key={index}
                className={`relative aspect-square bg-muted rounded-lg cursor-pointer overflow-hidden border-2 transition-all ${
                  currentImageIndex === index 
                    ? 'border-primary ring-2 ring-primary' 
                    : img.maskDataUrl 
                      ? 'border-green-500' 
                      : 'border-transparent'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img
                  src={img.preview}
                  alt=""
                  className="w-full h-full object-cover"
                />
                {img.maskDataUrl && (
                  <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
                    <Icon name="Check" size={12} className="text-white" />
                  </div>
                )}
                {img.processing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Icon name="Loader2" className="animate-spin text-white" size={20} />
                  </div>
                )}
                {img.processed && (
                  <div className="absolute top-1 left-1 bg-blue-500 rounded-full p-1">
                    <Icon name="Check" size={12} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button 
            className="w-full" 
            size="lg"
            onClick={onProcessAll}
            disabled={maskedCount === 0 || images.some(img => img.processing)}
          >
            <Icon name="Sparkles" className="mr-2" size={20} />
            Обработать все ({maskedCount})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
