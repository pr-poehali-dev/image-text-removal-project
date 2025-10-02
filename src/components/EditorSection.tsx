import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import ImageEditor from './ImageEditor';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export interface ProcessedImage {
  file: File;
  preview: string;
  processing: boolean;
  processed?: string;
  error?: string;
  maskDataUrl?: string;
}

interface EditorSectionProps {
  uploadedImages: ProcessedImage[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProcessImage: (index: number, maskDataUrl?: string) => void;
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
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleManualProcess = (index: number, maskDataUrl: string) => {
    onProcessImage(index, maskDataUrl);
    setSelectedImageIndex(null);
  };

  return (
    <section id="editor" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Редактор изображений</h2>
          
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'auto' | 'manual')} className="mb-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="auto">
                <Icon name="Zap" size={16} className="mr-2" />
                Автоудаление текста
              </TabsTrigger>
              <TabsTrigger value="manual">
                <Icon name="Paintbrush" size={16} className="mr-2" />
                Ручное выделение
              </TabsTrigger>
            </TabsList>

            <TabsContent value="auto" className="mt-6">
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={onImageUpload}
                      className="hidden"
                      id="file-upload-auto"
                    />
                    <label htmlFor="file-upload-auto" className="cursor-pointer">
                      <Icon name="Upload" className="mx-auto text-muted-foreground mb-4" size={48} />
                      <p className="text-lg font-medium mb-2">Перетащите изображения или нажмите для выбора</p>
                      <p className="text-sm text-muted-foreground">ИИ автоматически удалит весь текст</p>
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
            </TabsContent>

            <TabsContent value="manual" className="mt-6">
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        onImageUpload(e);
                        if (e.target.files && e.target.files.length > 0) {
                          setSelectedImageIndex(uploadedImages.length);
                        }
                      }}
                      className="hidden"
                      id="file-upload-manual"
                    />
                    <label htmlFor="file-upload-manual" className="cursor-pointer">
                      <Icon name="Upload" className="mx-auto text-muted-foreground mb-4" size={48} />
                      <p className="text-lg font-medium mb-2">Загрузите изображение</p>
                      <p className="text-sm text-muted-foreground">Вручную выделите области для удаления кистью</p>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {selectedImageIndex !== null && uploadedImages[selectedImageIndex] && (
                <ImageEditor
                  imageUrl={uploadedImages[selectedImageIndex].preview}
                  processedUrl={uploadedImages[selectedImageIndex].processed}
                  onProcess={(maskDataUrl) => handleManualProcess(selectedImageIndex, maskDataUrl)}
                  processing={uploadedImages[selectedImageIndex].processing}
                />
              )}

              {uploadedImages.length > 0 && selectedImageIndex === null && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((image, index) => (
                    <Card 
                      key={index} 
                      className="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <CardContent className="p-3">
                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden mb-2">
                          <img
                            src={image.preview}
                            alt={image.file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-xs truncate text-center">{image.file.name}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}