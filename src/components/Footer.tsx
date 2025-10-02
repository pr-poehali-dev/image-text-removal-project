import Icon from '@/components/ui/icon';

export default function Footer() {
  return (
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
  );
}
