import Icon from '@/components/ui/icon';
import { BatchImage } from './types';

interface BatchImageGridProps {
  images: BatchImage[];
  currentImageIndex: number;
  onImageSelect: (index: number) => void;
}

export default function BatchImageGrid({ images, currentImageIndex, onImageSelect }: BatchImageGridProps) {
  return (
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
          onClick={() => onImageSelect(index)}
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
  );
}
