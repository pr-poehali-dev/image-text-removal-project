import { useEffect } from 'react';

interface AutoSaveItem {
  fileName: string;
  fileSize: number;
  maskDataUrl: string;
  timestamp: number;
}

export function useAutoSave() {
  const saveMasks = (images: Array<{ file: File; maskDataUrl?: string }>) => {
    const masksToSave: AutoSaveItem[] = images
      .filter(img => img.maskDataUrl)
      .map(img => ({
        fileName: img.file.name,
        fileSize: img.file.size,
        maskDataUrl: img.maskDataUrl!,
        timestamp: Date.now()
      }));
    
    if (masksToSave.length > 0) {
      localStorage.setItem('batchImageMasks', JSON.stringify(masksToSave));
      localStorage.setItem('autoSaveTimestamp', Date.now().toString());
      window.dispatchEvent(new Event('storage'));
    }
  };

  const loadMasks = (images: Array<{ file: File }>): Array<{ fileName: string; maskDataUrl: string }> => {
    const savedMasks = localStorage.getItem('batchImageMasks');
    if (!savedMasks) return [];

    try {
      const masks: AutoSaveItem[] = JSON.parse(savedMasks);
      const now = Date.now();
      const validMasks = masks.filter(m => {
        const hoursSinceCreation = (now - m.timestamp) / (1000 * 60 * 60);
        return hoursSinceCreation < 24;
      });

      if (validMasks.length !== masks.length) {
        localStorage.setItem('batchImageMasks', JSON.stringify(validMasks));
      }

      return validMasks.map(m => ({
        fileName: m.fileName,
        maskDataUrl: m.maskDataUrl
      }));
    } catch (e) {
      console.error('Failed to load masks:', e);
      return [];
    }
  };

  const clearMasks = () => {
    localStorage.removeItem('batchImageMasks');
    localStorage.removeItem('autoSaveTimestamp');
    window.dispatchEvent(new Event('storage'));
  };

  return { saveMasks, loadMasks, clearMasks };
}
