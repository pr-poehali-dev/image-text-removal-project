import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function ProgressIndicator() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkAutoSave = () => {
      const savedMasks = localStorage.getItem('batchImageMasks');
      setShow(!!savedMasks);
    };

    checkAutoSave();
    window.addEventListener('storage', checkAutoSave);
    const interval = setInterval(checkAutoSave, 1000);

    return () => {
      window.removeEventListener('storage', checkAutoSave);
      clearInterval(interval);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <Card className="bg-green-500 text-white border-green-600">
        <CardContent className="p-3 flex items-center gap-2">
          <Icon name="Save" size={16} className="animate-pulse" />
          <span className="text-sm font-medium">Прогресс сохранён</span>
        </CardContent>
      </Card>
    </div>
  );
}
