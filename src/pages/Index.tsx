import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface ProcessedImage {
  file: File;
  preview: string;
  processing: boolean;
  processed?: string;
  error?: string;
}

function Index() {
  const [uploadedImages, setUploadedImages] = useState<ProcessedImage[]>([]);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages: ProcessedImage[] = files.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        processing: false
      }));
      setUploadedImages(prev => [...prev, ...newImages]);
      toast({
        title: "Изображения загружены",
        description: `Добавлено файлов: ${files.length}`,
      });
    }
  };

  const processImage = async (index: number) => {
    const image = uploadedImages[index];
    
    setUploadedImages(prev => prev.map((img, i) => 
      i === index ? { ...img, processing: true, error: undefined } : img
    ));

    try {
      const response = await fetch('https://functions.poehali.dev/28b39e66-6f50-4a13-a9e7-c95f9f0067e5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: image.preview
        })
      });

      const data = await response.json();

      if (data.success && data.output_url) {
        setUploadedImages(prev => prev.map((img, i) => 
          i === index ? { ...img, processing: false, processed: data.output_url } : img
        ));
        toast({
          title: "Готово!",
          description: "Изображение обработано успешно",
        });
      } else {
        throw new Error(data.error || 'Processing failed');
      }
    } catch (error) {
      setUploadedImages(prev => prev.map((img, i) => 
        i === index ? { ...img, processing: false, error: error instanceof Error ? error.message : 'Ошибка обработки' } : img
      ));
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : 'Не удалось обработать изображение',
        variant: "destructive"
      });
    }
  };

  const processAllImages = async () => {
    for (let i = 0; i < uploadedImages.length; i++) {
      if (!uploadedImages[i].processed && !uploadedImages[i].processing) {
        await processImage(i);
      }
    }
  };

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Eraser" className="text-primary" size={28} />
              <span className="text-2xl font-bold text-foreground">AI TEXT REMOVER</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-foreground hover:text-primary transition-colors">Главная</button>
              <button onClick={() => scrollToSection('editor')} className="text-foreground hover:text-primary transition-colors">Редактор</button>
              <button onClick={() => scrollToSection('examples')} className="text-foreground hover:text-primary transition-colors">Примеры</button>
              <button onClick={() => scrollToSection('api')} className="text-foreground hover:text-primary transition-colors">API</button>
              <button onClick={() => scrollToSection('faq')} className="text-foreground hover:text-primary transition-colors">FAQ</button>
            </div>
            <Button>Начать работу</Button>
          </div>
        </div>
      </nav>

      <section id="home" className="pt-20 pb-32 bg-gradient-to-b from-muted to-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-6xl font-bold text-foreground mb-6">
              Профессиональное удаление текста с изображений
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Интеллектуальная технология восстановления фона любой сложности. 
              Обрабатывайте множество изображений одновременно.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" onClick={() => scrollToSection('editor')} className="text-lg px-8">
                <Icon name="Upload" className="mr-2" size={20} />
                Загрузить изображения
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollToSection('examples')} className="text-lg px-8">
                Посмотреть примеры
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow animate-scale-in">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Layers" className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Пакетная обработка</h3>
                <p className="text-muted-foreground">
                  Загружайте и обрабатывайте сотни изображений одновременно
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Sparkles" className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI восстановление</h3>
                <p className="text-muted-foreground">
                  Умный алгоритм восстанавливает фон с учетом контекста
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Zap" className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Быстрая работа</h3>
                <p className="text-muted-foreground">
                  Обработка изображения занимает всего несколько секунд
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

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
                    onChange={handleImageUpload}
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
                            onClick={() => processImage(index)}
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
                    onClick={processAllImages}
                    disabled={uploadedImages.every(img => img.processed || img.processing)}
                  >
                    <Icon name="Layers" className="mr-2" size={20} />
                    Обработать все ({uploadedImages.filter(img => !img.processed).length})
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => setUploadedImages([])}>
                    Очистить
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="examples" className="py-20 bg-muted">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Примеры работ</h2>
          
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="landscapes" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="landscapes">Пейзажи</TabsTrigger>
                <TabsTrigger value="products">Продукты</TabsTrigger>
                <TabsTrigger value="documents">Документы</TabsTrigger>
              </TabsList>
              
              <TabsContent value="landscapes">
                <div className="grid md:grid-cols-2 gap-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div>
                          <p className="text-sm font-medium text-center mb-2">До</p>
                          <div className="aspect-video bg-gradient-to-br from-orange-300 to-blue-500 rounded-lg"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-center mb-2">После</p>
                          <div className="aspect-video bg-gradient-to-br from-orange-300 to-blue-500 rounded-lg"></div>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Icon name="Eye" className="mr-2" size={16} />
                        Посмотреть детали
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div>
                          <p className="text-sm font-medium text-center mb-2">До</p>
                          <div className="aspect-video bg-gradient-to-br from-green-300 to-cyan-500 rounded-lg"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-center mb-2">После</p>
                          <div className="aspect-video bg-gradient-to-br from-green-300 to-cyan-500 rounded-lg"></div>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Icon name="Eye" className="mr-2" size={16} />
                        Посмотреть детали
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="products">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Примеры обработки товарных фотографий</p>
                </div>
              </TabsContent>

              <TabsContent value="documents">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Примеры очистки документов от текста</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <section id="api" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-6">API для разработчиков</h2>
            <p className="text-xl text-center text-muted-foreground mb-12">
              Интегрируйте наш сервис в свои приложения
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon name="Code" className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">REST API</h3>
                  <p className="text-muted-foreground mb-4">
                    Простой HTTP API для интеграции в любое приложение
                  </p>
                  <Button variant="outline">Документация</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon name="Package" className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">SDK библиотеки</h3>
                  <p className="text-muted-foreground mb-4">
                    Готовые библиотеки для Python, JavaScript, PHP
                  </p>
                  <Button variant="outline">Скачать SDK</Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-foreground text-background">
              <CardContent className="pt-6">
                <p className="text-sm text-background/70 mb-2">Пример использования API</p>
                <pre className="bg-background/10 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">
{`curl -X POST https://api.textremover.ai/v1/process \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "image=@photo.jpg" \\
  -F "mode=auto"`}
                  </code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 bg-muted">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Часто задаваемые вопросы</h2>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Какие форматы изображений поддерживаются?</AccordionTrigger>
                <AccordionContent>
                  Мы поддерживаем все популярные форматы: JPG, PNG, WebP, TIFF. Максимальный размер файла — 50 МБ.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Сколько изображений можно обработать одновременно?</AccordionTrigger>
                <AccordionContent>
                  В бесплатной версии — до 10 изображений одновременно. В Pro версии — без ограничений.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Как работает восстановление фона?</AccordionTrigger>
                <AccordionContent>
                  Используем нейронные сети, обученные на миллионах изображений. Алгоритм анализирует окружение и 
                  воссоздает фон с учетом текстуры, цвета и контекста.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Можно ли использовать API бесплатно?</AccordionTrigger>
                <AccordionContent>
                  Да, предоставляем 100 бесплатных запросов в месяц. Для больших объемов есть платные тарифы.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Сохраняется ли качество изображения?</AccordionTrigger>
                <AccordionContent>
                  Да, обработка происходит без потери качества. Выходное изображение имеет те же разрешение и характеристики.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="Eraser" size={24} />
                <span className="text-xl font-bold">AI TEXT REMOVER</span>
              </div>
              <p className="text-background/70 text-sm">
                Профессиональное удаление текста с изображений с помощью AI
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Продукт</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><a href="#" className="hover:text-background transition-colors">Возможности</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Тарифы</a></li>
                <li><a href="#" className="hover:text-background transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><a href="#" className="hover:text-background transition-colors">Документация</a></li>
                <li><a href="#" className="hover:text-background transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Контакты</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><a href="#" className="hover:text-background transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Блог</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Карьера</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-background/20 mt-12 pt-8 text-center text-sm text-background/50">
            © 2024 AI Text Remover. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Index;