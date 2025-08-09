import React, { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PromoBanner {
  id: string;
  image: string;
  link: string;
  active: boolean;
  sort_order: number;
}

export function PromoBanners() {
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        // Mock данные для промо баннеров
        await new Promise(resolve => setTimeout(resolve, 500)); // Симуляция задержки
        
        const mockBanners: PromoBanner[] = [
          {
            id: '1',
            image: '/promo/banner1.jpg',
            link: '#',
            active: true,
            sort_order: 1
          },
          {
            id: '2',
            image: '/promo/banner2.jpg',
            link: '#',
            active: true,
            sort_order: 2
          }
        ];
        
        setBanners(mockBanners.filter(banner => banner.active));
      } catch (error) {
        console.error('Ошибка загрузки баннеров:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBanners();
  }, []);

  if (isLoading || banners.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col space-y-4">
        {banners.map((banner) => (
          <a
            key={banner.id}
            href={banner.link}
            className="block w-full relative aspect-[4/1] rounded-lg overflow-hidden"
          >
            <ImageWithFallback
              src={banner.image}
              alt="Промо баннер"
              className="w-full h-full object-cover"
            />
          </a>
        ))}
      </div>
    </div>
  );
}