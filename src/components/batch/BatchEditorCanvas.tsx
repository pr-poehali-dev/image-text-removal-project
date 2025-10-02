import { useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface BatchEditorCanvasProps {
  imageUrl: string;
  maskDataUrl?: string;
  brushSize: number;
  tool: 'brush' | 'eraser';
  isDrawing: boolean;
  currentIndex: number;
  totalImages: number;
  onStartDrawing: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onDraw: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onStopDrawing: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  imageRef: React.MutableRefObject<HTMLImageElement | null>;
}

export default function BatchEditorCanvas({
  imageUrl,
  maskDataUrl,
  brushSize,
  tool,
  isDrawing,
  currentIndex,
  totalImages,
  onStartDrawing,
  onDraw,
  onStopDrawing,
  canvasRef,
  imageRef
}: BatchEditorCanvasProps) {
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

      if (maskDataUrl) {
        const maskImg = new Image();
        maskImg.onload = () => {
          ctx.drawImage(maskImg, 0, 0);
        };
        maskImg.src = maskDataUrl;
      }
    };
    img.src = imageUrl;
  }, [imageUrl, maskDataUrl, canvasRef, imageRef]);

  return (
    <div className="relative bg-muted rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-auto cursor-crosshair"
        onMouseDown={onStartDrawing}
        onMouseMove={onDraw}
        onMouseUp={onStopDrawing}
        onMouseLeave={onStopDrawing}
      />
      <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
        <Icon name="Save" size={12} className="text-green-500" />
        {currentIndex + 1} / {totalImages}
      </div>
      <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
        {tool === 'brush' ? 'Выделите области для удаления' : 'Исправьте выделение'}
      </div>
    </div>
  );
}
