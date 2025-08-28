import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Phone, 
  ChefHat, 
  Utensils,
  Heart,
  Award,
  Users,
  Camera,
  CheckCircle,
  Play,
  Calendar,
  Fish,
  Sparkles,
  Building2
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useLanguage } from '../hooks/useLanguage';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AnimatedBlock } from './AnimatedBlock';

interface HomePageProps {
  onNavigate: (page: string) => void;
}



export function HomePage({ onNavigate }: HomePageProps) {
  const { language, translations } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Hero gallery images
  const heroImages = [
    '/hero/hero-1.jpg',
    '/hero/hero-2.jpg',
    '/hero/hero-3.jpg',
    '/hero/hero.jpg',
  ];

  // Gallery images
  const galleryImages = [
    '/we/we-1.png',
    '/we/we-2.png',
    '/we/we-3.png',
    '/we/we-4.png',
    '/we/we-5.png',
    '/we/we-6.png',
  ];

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Animation on scroll
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const specialties = [
    {
      icon: Building2,
      title: translations.eleganAtmosphere,
      description: translations.eleganAtmosphereDesc
    },
    
    {
      icon: Star,
      title: translations.premiumService,
      description: translations.premiumServiceDesc
    },
    {
      icon: ChefHat,
      title: translations.expertChefs,
      description: translations.expertChefsDesc
    },
    {
      icon: Sparkles,
      title: translations.uniqueExperience,
      description: translations.uniqueExperienceDesc
    }
  ];

  const getStatsLabels = () => {
    switch (language) {
      case 'en':
        return [
          { number: '4+', label: 'Years Experience', icon: Award },
          { number: '20 000+', label: 'Happy Guests', icon: Users },
          { number: '150+', label: 'Menu Items', icon: Utensils },
          { number: '5+', label: 'Rating', icon: Star }
        ];
      case 'tj':
        return [
                  { number: '4+', label: translations.yearsExperience, icon: Award },
        { number: '20 000+', label: translations.happyGuests, icon: Users },
        { number: '150+', label: translations.dishesInMenu, icon: Utensils },
        { number: '5', label: translations.rating, icon: Star }
        ];
      case 'zh':
        return [
          { number: '4+', label: '???', icon: Award },
          { number: '20 000+', label: '????', icon: Users },
          { number: '150+', label: '????', icon: Utensils },
          { number: '5', label: '??', icon: Star }
        ];
      default: // ru
        return [
    { number: '4+', label: translations.yearsExperience, icon: Award },
    { number: '20 000+', label: translations.happyGuests, icon: Users },
    { number: '150+', label: translations.dishesInMenu, icon: Utensils },
    { number: '5', label: translations.rating, icon: Star }
        ];
    }
  };

  const stats = getStatsLabels();

  const getGalleryTitle = () => {
    switch (language) {
      case 'en':
        return 'Restaurant Atmosphere';
      default:
        return translations.restaurantSpace;
    }
  };

  const getGallerySubtitle = () => {
    switch (language) {
      case 'en':
        return 'Immerse yourself in the elegant atmosphere of our restaurant';
      default:
        return translations.enterRestaurantSpace;
    }
  };

  const getSpecialTitle = () => {
    switch (language) {
      case 'en':
        return 'What makes us special';
      default:
        return translations.whatMakesUsSpecial;
    }
  };

  const getSpecialSubtitle = () => {
    switch (language) {
      case 'en':
        return 'Every detail of our restaurant is created to give you an unforgettable experience';
      case 'tj':
        return '?�� �� ?������ ��������� �� ����� ��?����� �����?���������� ������� �������';
      case 'zh':
        return '????????????????????';
      default:
        return translations.everyDetailCreated;
    }
  };

  const getCtaTitle = () => {
    switch (language) {
      case 'en':
        return 'Visit Us Today';
      case 'tj':
        return '���?� �� �� ?�� ��?� �����';
      case 'zh':
        return '????????';
      default:
        return translations.visitUsToday;
    }
  };

  const getCtaSubtitle = () => {
    switch (language) {
      case 'en':
        return 'Discover an unforgettable culinary experience in the heart of Khujand';
      case 'tj':
        return '��?����� ������� �����?������������ ��� ?���� ��?��� ���� �����';
      case 'zh':
        return '??????????????';
      default:
        return translations.discoverCulinaryExperience;
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
        {/* Background Image Carousel */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <ImageWithFallback
                src={image}
                alt={`Restaurant ambiance ${index + 1}`}
                className="w-full h-full object-cover transform scale-105 motion-safe:animate-ken-burns"
              />
              {/* ����������� ������� */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
              {/* ������ �������� */}
              <div className="absolute inset-0 bg-radial-gradient" style={{
                background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
              }} />
              {/* ����� */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-amber-500/10" />
                <div className="absolute inset-0 bg-gradient-to-bl from-amber-500/5 via-transparent to-amber-500/5" />
              </div>
            </div>
          ))}
        </div>
        
        {/* ������������ �������� */}
        <div className="absolute inset-0">
          {/* ������� �������� */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />
          {/* ������ �������� */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Hero Content */}
       <div
  className={`relative z-10 text-center text-white px-4 sm:px-6 transform transition-all duration-1000 ${
    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
  }`}
>
  <div className="max-w-5xl mx-auto">
    {/* ��������� � ������������ */}
    <div className="flex flex-col items-center text-center mb-8 px-2">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white drop-shadow-2xl">
        {translations.restaurantForel}
      </h1>
      <p className="mt-4 text-xl sm:text-2xl md:text-3xl font-medium text-[#FDCB6F] max-w-3xl">
        {translations.exquisiteCuisineInHeart}
      </p>
    </div>

    {/* ������ */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-2">
      <Button
        onClick={() => onNavigate('menu')}
        size="lg"
        className="golden-gradient text-black hover:golden-gradient-hover px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
      >
        <Utensils className="mr-2 h-5 w-5" />
        {translations.discoverMenu}
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>

      <Button
        onClick={() => onNavigate('reservations')}
        variant="outline"
        size="lg"
        className="border-white text-white hover:bg-white hover:text-gray-900 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold backdrop-blur-sm bg-white/10 transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
      >
        <Calendar className="mr-2 h-5 w-5" />
        {translations.makeReservation}
      </Button>
    </div>
  </div>
</div>



        {/* Scroll Indicator */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-2 sm:h-3 bg-white rounded-full mt-1 sm:mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 golden-gradient rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                  <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-sm sm:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <AnimatedBlock delay={200}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
                {getSpecialTitle()}
              </h2>
            </AnimatedBlock>
            <AnimatedBlock delay={400}>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                {getSpecialSubtitle()}
              </p>
            </AnimatedBlock>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {specialties.map((specialty, index) => (
              <AnimatedBlock key={index} delay={index * 200} direction="up">
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 h-full">
                  <CardContent className="p-6 sm:p-8 text-center h-full flex flex-col">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 golden-gradient rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg transform hover:rotate-12 transition-transform duration-300">
                      <specialty.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">{specialty.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed flex-grow">{specialty.description}</p>
                  </CardContent>
                </Card>
              </AnimatedBlock>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
              {getGalleryTitle()}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              {getGallerySubtitle()}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
  {galleryImages.map((image, index) => (
    <div
      key={index}
      className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300"
    ><ImageWithFallback
  src={image}
  alt={`Restaurant gallery ${index + 1}`}
  className="w-full h-[500px] object-cover transform group-hover:scale-110 transition-transform duration-500"
/>

    </div>
  ))}
</div>

        </div>
      </section>
      {/* Instagram Section � Restaurant */}
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 sm:py-16 lg:py-20">
    <AnimatedBlock delay={200} direction="up" duration={1000}>
      <Badge className="mb-4 golden-gradient text-white px-4 py-2 text-black">
        Instagram
      </Badge>
      <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
  {translations.instagramRestaurantTitle}
</h2>
<p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
  {translations.instagramRestaurantDescription}
</p>
<a
  href="https://www.instagram.com/restaurant_forel_khujand/"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block golden-gradient text-black text-lg px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
>
  {translations.instagramRestaurantButton}
</a>
    </AnimatedBlock>
  </div>

    </div>
  );
}