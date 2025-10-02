import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { BatchImage } from './batch/types';
import { useBatchEditorLogic } from './batch/useBatchEditorLogic';
import BatchEditorToolbar from './batch/BatchEditorToolbar';
import BatchEditorCanvas from './batch/BatchEditorCanvas';
import BatchNavigationBar from './batch/BatchNavigationBar';
import BatchImageGrid from './batch/BatchImageGrid';
import BatchKeyboardShortcuts from './batch/BatchKeyboardShortcuts';

interface BatchImageEditorProps {
  images: BatchImage[];
  onImagesUpdate: (images: BatchImage[]) => void;
  onProcessAll: () => void;
}

export default function BatchImageEditor({ images, onImagesUpdate, onProcessAll }: BatchImageEditorProps) {
  const {
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
  } = useBatchEditorLogic({ images, onImagesUpdate, onProcessAll });

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <BatchEditorToolbar
            tool={tool}
            brushSize={brushSize}
            onToolChange={setTool}
            onBrushSizeChange={setBrushSize}
            onClearMask={clearMask}
            onApplyMaskToAll={applyMaskToAll}
            onClearAllMasks={clearAllMasks}
          />

          <BatchEditorCanvas
            imageUrl={currentImage.preview}
            maskDataUrl={currentImage.maskDataUrl}
            brushSize={brushSize}
            tool={tool}
            isDrawing={isDrawing}
            currentIndex={currentImageIndex}
            totalImages={images.length}
            onStartDrawing={startDrawing}
            onDraw={draw}
            onStopDrawing={stopDrawing}
            canvasRef={canvasRef}
            imageRef={imageRef}
          />

          <BatchNavigationBar
            currentIndex={currentImageIndex}
            totalImages={images.length}
            maskedCount={maskedCount}
            onPrevImage={prevImage}
            onNextImage={nextImage}
            onExportProject={exportProject}
            onImportProject={importProject}
          />

          <BatchImageGrid
            images={images}
            currentImageIndex={currentImageIndex}
            onImageSelect={setCurrentImageIndex}
          />

          <Button 
            className="w-full" 
            size="lg"
            onClick={onProcessAll}
            disabled={maskedCount === 0 || images.some(img => img.processing)}
          >
            <Icon name="Sparkles" className="mr-2" size={20} />
            Обработать все ({maskedCount})
          </Button>

          <BatchKeyboardShortcuts
            maskedCount={maskedCount}
            onExportProject={exportProject}
            onImportProject={importProject}
          />
        </div>
      </CardContent>
    </Card>
  );
}
