import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface NavigationProps {
  onNavigate: (section: string) => void;
}

export default function Navigation({ onNavigate }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Eraser" className="text-primary" size={28} />
            <span className="text-2xl font-bold text-foreground">AI TEXT REMOVER</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => onNavigate('home')} className="text-foreground hover:text-primary transition-colors">Главная</button>
            <button onClick={() => onNavigate('editor')} className="text-foreground hover:text-primary transition-colors">Редактор</button>
            <button onClick={() => onNavigate('examples')} className="text-foreground hover:text-primary transition-colors">Примеры</button>
            <button onClick={() => onNavigate('api')} className="text-foreground hover:text-primary transition-colors">API</button>
            <button onClick={() => onNavigate('faq')} className="text-foreground hover:text-primary transition-colors">FAQ</button>
          </div>
          <Button>Начать работу</Button>
        </div>
      </div>
    </nav>
  );
}
