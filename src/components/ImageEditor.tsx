import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ImageEditorProps {
  imageUrl: string;
  processedUrl?: string;
  onProcess: (maskDataUrl: string) => void;
  processing: boolean;
}

export default function ImageEditor({ imageUrl, processedUrl, onProcess, processing }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brushSize, setBrushSize] = useState(30);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [showMask, setShowMask] = useState(true);
  const [comparePosition, setComparePosition] = useState(50);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
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
    };
    img.src = imageUrl;
  }, [imageUrl]);

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
  };

  const clearMask = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx || !imageRef.current) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageRef.current, 0, 0);
  };

  const handleProcess = () => {
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
    onProcess(maskCanvas.toDataURL('image/png'));
  };

  const downloadImage = (format: 'png' | 'jpg' | 'webp') => {
    if (!processedUrl) return;

    const link = document.createElement('a');
    link.href = processedUrl;
    link.download = `processed.${format}`;
    link.click();
  };

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

            <Button variant="outline" size="sm" onClick={clearMask}>
              <Icon name="RotateCcw" size={16} className="mr-1" />
              Сбросить
            </Button>
          </div>

          <div className="relative bg-muted rounded-lg overflow-hidden">
            {!processedUrl ? (
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                  {tool === 'brush' ? 'Выделите области для удаления' : 'Исправьте выделение'}
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="flex items-center justify-center">
                  <div className="relative w-full overflow-hidden">
                    <img src={imageUrl} alt="Оригинал" className="w-full h-auto" />
                    <div 
                      className="absolute top-0 left-0 h-full overflow-hidden"
                      style={{ width: `${comparePosition}%` }}
                    >
                      <img src={processedUrl} alt="Обработано" className="w-full h-auto" />
                    </div>
                    <div 
                      className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
                      style={{ left: `${comparePosition}%` }}
                      onMouseDown={(e) => {
                        const onMouseMove = (moveEvent: MouseEvent) => {
                          const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                          if (!rect) return;
                          const pos = ((moveEvent.clientX - rect.left) / rect.width) * 100;
                          setComparePosition(Math.max(0, Math.min(100, pos)));
                        };
                        const onMouseUp = () => {
                          document.removeEventListener('mousemove', onMouseMove);
                          document.removeEventListener('mouseup', onMouseUp);
                        };
                        document.addEventListener('mousemove', onMouseMove);
                        document.addEventListener('mouseup', onMouseUp);
                      }}
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Icon name="ChevronsLeftRight" size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {!processedUrl ? (
              <Button 
                className="flex-1" 
                onClick={handleProcess}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Icon name="Loader2" className="mr-2 animate-spin" size={16} />
                    Обработка...
                  </>
                ) : (
                  <>
                    <Icon name="Sparkles" className="mr-2" size={16} />
                    Удалить выделенное
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => downloadImage('png')}>
                  <Icon name="Download" className="mr-2" size={16} />
                  PNG
                </Button>
                <Button variant="outline" onClick={() => downloadImage('jpg')}>
                  <Icon name="Download" className="mr-2" size={16} />
                  JPG
                </Button>
                <Button variant="outline" onClick={() => downloadImage('webp')}>
                  <Icon name="Download" className="mr-2" size={16} />
                  WebP
                </Button>
                <Button className="flex-1" onClick={clearMask}>
                  <Icon name="ImagePlus" className="mr-2" size={16} />
                  Новое изображение
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
