import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export interface ProcessedImage {
  file: File;
  preview: string;
  processing: boolean;
  processed?: string;
  error?: string;
}

interface EditorSectionProps {
  uploadedImages: ProcessedImage[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProcessImage: (index: number) => void;
  onProcessAllImages: () => void;
  onClearImages: () => void;
}

export default function EditorSection({
  uploadedImages,
  onImageUpload,
  onProcessImage,
  onProcessAllImages,
  onClearImages,
}: EditorSectionProps) {
  return (
    <section id="editor" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Редактор изображений</h2>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={onImageUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Icon name="Upload" className="mx-auto text-muted-foreground mb-4" size={48} />
                  <p className="text-lg font-medium mb-2">Перетащите изображения или нажмите для выбора</p>
                  <p className="text-sm text-muted-foreground">Поддерживаются форматы: JPG, PNG, WebP</p>
                </label>
              </div>
            </CardContent>
          </Card>

          {uploadedImages.length > 0 && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-semibold mb-4">Загруженные изображения ({uploadedImages.length})</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {uploadedImages.map((image, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div>
                          <p className="text-xs font-medium text-center mb-2">Оригинал</p>
                          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                            <img
                              src={image.preview}
                              alt={image.file.name}
                              className="max-h-full max-w-full rounded-lg object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-center mb-2">Результат</p>
                          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                            {image.processing ? (
                              <Icon name="Loader2" className="animate-spin text-primary" size={32} />
                            ) : image.processed ? (
                              <img
                                src={image.processed}
                                alt="Обработано"
                                className="max-h-full max-w-full rounded-lg object-cover"
                              />
                            ) : (
                              <Icon name="ImageOff" className="text-muted-foreground" size={32} />
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-medium truncate mb-3">{image.file.name}</p>
                      {image.error && (
                        <p className="text-xs text-destructive mb-2">{image.error}</p>
                      )}
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1" 
                          onClick={() => onProcessImage(index)}
                          disabled={image.processing || !!image.processed}
                        >
                          {image.processing ? (
                            <>
                              <Icon name="Loader2" className="mr-2 animate-spin" size={16} />
                              Обработка...
                            </>
                          ) : image.processed ? (
                            <>
                              <Icon name="Check" className="mr-2" size={16} />
                              Готово
                            </>
                          ) : (
                            <>
                              <Icon name="Play" className="mr-2" size={16} />
                              Обработать
                            </>
                          )}
                        </Button>
                        {image.processed && (
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => window.open(image.processed, '_blank')}
                          >
                            <Icon name="Download" size={16} />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-6 flex gap-4">
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={onProcessAllImages}
                  disabled={uploadedImages.every(img => img.processed || img.processing)}
                >
                  <Icon name="Layers" className="mr-2" size={20} />
                  Обработать все ({uploadedImages.filter(img => !img.processed).length})
                </Button>
                <Button size="lg" variant="outline" onClick={onClearImages}>
                  Очистить
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
