import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function ApiSection() {
  return (
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
  );
}
