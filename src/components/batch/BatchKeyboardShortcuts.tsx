import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface BatchKeyboardShortcutsProps {
  maskedCount: number;
  onExportProject: () => void;
  onImportProject: () => void;
}

export default function BatchKeyboardShortcuts({
  maskedCount,
  onExportProject,
  onImportProject
}: BatchKeyboardShortcutsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="bg-muted/30">
        <CardContent className="pt-4 pb-4">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Icon name="Keyboard" size={16} />
            Горячие клавиши
          </h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-background rounded border">←</kbd>
              <span className="text-muted-foreground">Предыдущее</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-background rounded border">→</kbd>
              <span className="text-muted-foreground">Следующее</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-background rounded border">Space</kbd>
              <span className="text-muted-foreground">Обработать</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-background rounded border">B</kbd>
              <span className="text-muted-foreground">Кисть</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-background rounded border">E</kbd>
              <span className="text-muted-foreground">Ластик</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-background rounded border">R</kbd>
              <span className="text-muted-foreground">Сбросить</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-background rounded border">C</kbd>
              <span className="text-muted-foreground">На все</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-background rounded border">[ ]</kbd>
              <span className="text-muted-foreground">Размер</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="pt-4 pb-4">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Icon name="FileJson" size={16} className="text-blue-500" />
            Экспорт/Импорт проекта
          </h4>
          <p className="text-xs text-muted-foreground mb-3">
            Сохраните маски в JSON файл и продолжите работу на другом устройстве
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={onExportProject}>
              <Icon name="Download" size={14} className="mr-1" />
              Экспорт ({maskedCount})
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={onImportProject}>
              <Icon name="Upload" size={14} className="mr-1" />
              Импорт
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
