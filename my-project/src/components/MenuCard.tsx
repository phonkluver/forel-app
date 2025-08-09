import * as React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MenuCardProps {
  title: string;
  ingredients: string;
  imageUrl: string;
  images?: string[]; // Массив дополнительных изображений для карусели
  price?: number;
  onAddToCart?: () => void;
}

export function MenuCard({ 
  title, 
  ingredients, 
  imageUrl,
  images,
  price,
  onAddToCart 
}: MenuCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const allImages = images && images.length > 0 ? images : [imageUrl];
  const hasMultipleImages = allImages.length > 1;

  // Автоматическое переключение изображений при наведении
  useEffect(() => {
    if (!isHovered || !hasMultipleImages) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }, 2000); // Переключение каждые 2 секунды

    return () => clearInterval(interval);
  }, [isHovered, hasMultipleImages, allImages.length]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImageIndex(0); // Сбрасываем к первому изображению
  };

  const handleCarouselClick = (direction: 'prev' | 'next') => {
    if (!hasMultipleImages) return;
    
    setCurrentImageIndex(prev => {
      if (direction === 'next') {
        return (prev + 1) % allImages.length;
      } else {
        return (prev - 1 + allImages.length) % allImages.length;
      }
    });
  };

  return (
    <Card 
      className="w-[300px] overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="h-[200px] overflow-hidden relative">
        {/* Карусель изображений */}
        <div className="relative w-full h-full">
          {allImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <ImageWithFallback
                src={image}
                alt={`${title} - фото ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
            </div>
          ))}
          
          {/* Навигационные стрелки (показываются при наведении) */}
          {hasMultipleImages && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCarouselClick('prev');
                }}
                className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCarouselClick('next');
                }}
                className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
          
          {/* Индикаторы слайдов */}
          {hasMultipleImages && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {allImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-white' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <CardHeader className="pt-4">
        <CardTitle className="text-lg font-medium leading-tight">{title}</CardTitle>
        <CardDescription className="text-sm mt-2 text-muted-foreground">
          {ingredients}
        </CardDescription>
      </CardHeader>
      {price && (
        <CardFooter className="flex justify-between items-center">
          <div className="text-lg font-semibold">
            {price.toLocaleString('ru-RU')} TJS
          </div>
          {onAddToCart && (
            <button
              onClick={onAddToCart}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              В корзину
            </button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
