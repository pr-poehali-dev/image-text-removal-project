import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BatchEditorToolbarProps {
  tool: 'brush' | 'eraser';
  brushSize: number;
  onToolChange: (tool: 'brush' | 'eraser') => void;
  onBrushSizeChange: (size: number) => void;
  onClearMask: () => void;
  onApplyMaskToAll: () => void;
  onClearAllMasks: () => void;
}

export default function BatchEditorToolbar({
  tool,
  brushSize,
  onToolChange,
  onBrushSizeChange,
  onClearMask,
  onApplyMaskToAll,
  onClearAllMasks
}: BatchEditorToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Инструмент:</span>
        <Tabs value={tool} onValueChange={(v) => onToolChange(v as 'brush' | 'eraser')}>
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
          onValueChange={(v) => onBrushSizeChange(v[0])}
          min={5}
          max={100}
          step={5}
          className="flex-1"
        />
        <span className="text-sm w-12 text-right">{brushSize}px</span>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={onClearMask}>
          <Icon name="RotateCcw" size={16} className="mr-1" />
          Сбросить
        </Button>
        <Button variant="outline" size="sm" onClick={onApplyMaskToAll}>
          <Icon name="Copy" size={16} className="mr-1" />
          На все
        </Button>
        <Button variant="outline" size="sm" onClick={onClearAllMasks}>
          <Icon name="Trash2" size={16} className="mr-1" />
          Очистить все
        </Button>
      </div>
    </div>
  );
}
