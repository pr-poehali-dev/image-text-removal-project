import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAutoSave } from '@/hooks/useAutoSave';
import { BatchImage } from './types';

interface UseBatchEditorLogicProps {
  images: BatchImage[];
  onImagesUpdate: (images: BatchImage[]) => void;
  onProcessAll: () => void;
}

export function useBatchEditorLogic({ images, onImagesUpdate, onProcessAll }: UseBatchEditorLogicProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [brushSize, setBrushSize] = useState(30);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { toast } = useToast();
  const { saveMasks, loadMasks, clearMasks } = useAutoSave();

  const currentImage = images[currentImageIndex];

  useEffect(() => {
    const savedMasks = loadMasks(images);
    if (savedMasks.length > 0) {
      const updatedImages = images.map(img => {
        const savedMask = savedMasks.find(m => m.fileName === img.file.name);
        if (savedMask) {
          return { ...img, maskDataUrl: savedMask.maskDataUrl };
        }
        return img;
      });
      onImagesUpdate(updatedImages);
      toast({
        title: "Прогресс восстановлен",
        description: `Загружено масок: ${savedMasks.length}`,
      });
    }
  }, []);

  useEffect(() => {
    saveMasks(images);
  }, [images]);

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

  const clearAllMasks = () => {
    const updatedImages = images.map(img => ({
      ...img,
      maskDataUrl: undefined
    }));
    onImagesUpdate(updatedImages);
    clearMasks();
    toast({
      title: "Маски очищены",
      description: "Все маски удалены, автосохранение сброшено",
    });
  };

  const exportProject = () => {
    const projectData = {
      version: '1.0',
      timestamp: Date.now(),
      masks: images
        .filter(img => img.maskDataUrl)
        .map(img => ({
          fileName: img.file.name,
          fileSize: img.file.size,
          fileType: img.file.type,
          maskDataUrl: img.maskDataUrl
        }))
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `image-eraser-project-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Проект экспортирован",
      description: `Сохранено масок: ${projectData.masks.length}`,
    });
  };

  const importProject = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const projectData = JSON.parse(event.target?.result as string);
          
          if (!projectData.version || !projectData.masks) {
            throw new Error('Invalid project file');
          }

          const updatedImages = images.map(img => {
            const savedMask = projectData.masks.find(
              (m: any) => m.fileName === img.file.name && m.fileSize === img.file.size
            );
            if (savedMask) {
              return { ...img, maskDataUrl: savedMask.maskDataUrl };
            }
            return img;
          });

          onImagesUpdate(updatedImages);
          
          const importedCount = updatedImages.filter(img => img.maskDataUrl).length;
          toast({
            title: "Проект импортирован",
            description: `Загружено масок: ${importedCount} из ${projectData.masks.length}`,
          });
        } catch (error) {
          toast({
            title: "Ошибка импорта",
            description: "Неверный формат файла проекта",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch(e.key) {
        case 'ArrowRight':
          e.preventDefault();
          nextImage();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevImage();
          break;
        case ' ':
          e.preventDefault();
          if (!currentImage.maskDataUrl) {
            toast({
              title: "Нет маски",
              description: "Сначала выделите области для удаления",
              variant: "destructive"
            });
          } else {
            onProcessAll();
          }
          break;
        case 'b':
          e.preventDefault();
          setTool('brush');
          toast({
            title: "Кисть",
            description: "Инструмент: Кисть"
          });
          break;
        case 'e':
          e.preventDefault();
          setTool('eraser');
          toast({
            title: "Ластик",
            description: "Инструмент: Ластик"
          });
          break;
        case 'r':
          e.preventDefault();
          clearMask();
          break;
        case 'c':
          e.preventDefault();
          applyMaskToAll();
          break;
        case '[':
          e.preventDefault();
          setBrushSize(prev => Math.max(5, prev - 5));
          break;
        case ']':
          e.preventDefault();
          setBrushSize(prev => Math.min(100, prev + 5));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentImageIndex, images, currentImage]);

  const maskedCount = images.filter(img => img.maskDataUrl).length;

  return {
    canvasRef,
    imageRef,
    currentImageIndex,
    brushSize,
    isDrawing,
    tool,
    currentImage,
    maskedCount,
    setCurrentImageIndex,
    setBrushSize,
    setTool,
    startDrawing,
    draw,
    stopDrawing,
    clearMask,
    applyMaskToAll,
    clearAllMasks,
    exportProject,
    importProject,
    nextImage,
    prevImage
  };
}
