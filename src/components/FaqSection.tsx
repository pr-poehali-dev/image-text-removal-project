import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FaqSection() {
  return (
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
  );
}
