import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
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
            <Button size="lg" onClick={() => onNavigate('editor')} className="text-lg px-8">
              <Icon name="Upload" className="mr-2" size={20} />
              Загрузить изображения
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNavigate('examples')} className="text-lg px-8">
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
  );
}
