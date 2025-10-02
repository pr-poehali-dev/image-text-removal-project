import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import EditorSection, { ProcessedImage } from '@/components/EditorSection';
import ExamplesSection from '@/components/ExamplesSection';
import ApiSection from '@/components/ApiSection';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';

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

  const processImage = async (index: number, maskDataUrl?: string) => {
    const image = uploadedImages[index];
    
    setUploadedImages(prev => prev.map((img, i) => 
      i === index ? { ...img, processing: true, error: undefined } : img
    ));

    try {
      const requestBody: any = {
        image_url: image.preview
      };

      if (maskDataUrl) {
        requestBody.mask_url = maskDataUrl;
      }

      const response = await fetch('https://functions.poehali.dev/28b39e66-6f50-4a13-a9e7-c95f9f0067e5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
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
      <Navigation onNavigate={scrollToSection} />
      <HeroSection onNavigate={scrollToSection} />
      <EditorSection 
        uploadedImages={uploadedImages}
        onImageUpload={handleImageUpload}
        onProcessImage={processImage}
        onProcessAllImages={processAllImages}
        onClearImages={() => setUploadedImages([])}
      />
      <ExamplesSection />
      <ApiSection />
      <FaqSection />
      <Footer />
    </div>
  );
}

export default Index;