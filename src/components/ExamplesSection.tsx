import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

export default function ExamplesSection() {
  return (
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
  );
}
