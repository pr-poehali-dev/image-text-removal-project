import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface BatchNavigationBarProps {
  currentIndex: number;
  totalImages: number;
  maskedCount: number;
  onPrevImage: () => void;
  onNextImage: () => void;
  onExportProject: () => void;
  onImportProject: () => void;
}

export default function BatchNavigationBar({
  currentIndex,
  totalImages,
  maskedCount,
  onPrevImage,
  onNextImage,
  onExportProject,
  onImportProject
}: BatchNavigationBarProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <Button 
        variant="outline" 
        onClick={onPrevImage}
        disabled={currentIndex === 0}
      >
        <Icon name="ChevronLeft" size={16} className="mr-1" />
        Назад
      </Button>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">
          Готовы: {maskedCount} / {totalImages}
        </span>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={onExportProject}>
            <Icon name="Download" size={14} className="mr-1" />
            Экспорт
          </Button>
          <Button variant="outline" size="sm" onClick={onImportProject}>
            <Icon name="Upload" size={14} className="mr-1" />
            Импорт
          </Button>
        </div>
      </div>

      <Button 
        variant="outline" 
        onClick={onNextImage}
        disabled={currentIndex === totalImages - 1}
      >
        Далее
        <Icon name="ChevronRight" size={16} className="ml-1" />
      </Button>
    </div>
  );
}
