import * as React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { telegramService } from '@/utils/telegram';
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AnimatedBlock } from "./AnimatedBlock";
import { apiService } from '../services/api';

interface HomePageProps {
  onNavigate: (page: 'home' | 'menu' | 'cart' | 'checkout' | 'profile' | 'reservation' | 'about-us') => void;
}

const GOLD_GRADIENT =
  "linear-gradient(90deg,#FDCB6F 0%,#FDCE78 3%,#FDD891 9%,#FEE9BA 16%,#FFECC1 18%,#FEE5B1 20%,#FEDB99 25%,#FDD486 31%,#FDCF78 37%,#FDCB71 46%,#FDCB6F 62%,#FBC96E 77%,#F4C36C 82%,#E8B868 86%,#D7A962 89%,#C1955B 92%,#A67C52 94%,#AB8153 95%,#BC9059 97%,#D7A962 98%,#FDCB6F 100%)";

export function HomePage({ onNavigate }: HomePageProps) {
  const { translations } = useLanguage();
  const [heroImage, setHeroImage] = React.useState('/hero-white.jpg');

  // Загрузка баннеров из API
  React.useEffect(() => {
    const loadBanners = async () => {
      try {
        const apiBanners = await apiService.getActiveBanners();
        if (apiBanners.length > 0) {
          // Используем первый баннер как hero изображение
          setHeroImage(apiBanners[0].image);
        }
      } catch (error) {
        console.error('Ошибка загрузки баннеров:', error);
        // Оставляем дефолтное изображение в случае ошибки
      }
    };

    loadBanners();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Screen */}
      <div className="relative h-[60vh]">
        {/* Фоновое изображение */}
        <ImageWithFallback
          src={heroImage}
          alt="Restaurant interior"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        
        {/* Затемнение поверх изображения */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* Логотип + заголовок */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6">
          <img
            src="/favicon.png"
            alt="Forel logo"
            className="w-50 h-40 drop-shadow-xl animate-bounce-in"
          />
          <p className="text-white/90 text-l text-center animate-fade-in-up animate-delay-300">
            {translations.heroSubtitle}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto max-w-md px-4 pb-[calc(env(safe-area-inset-bottom,0)+80px)]">
        {/* CTA */}
        <div className="space-y-4 mt-8">
          <AnimatedBlock animationType="fade-up" delay={100}>
            <GoldButton onClick={() => onNavigate('about-us')}>
              <span className="text-xl font-semibold">{translations.aboutUs}</span>
            </GoldButton>
          </AnimatedBlock>
          
          <AnimatedBlock animationType="fade-up" delay={200}>
            <GoldButton onClick={() => onNavigate('menu')}>
              <span className="text-xl font-semibold">{translations.menu}</span>
              <span className="text-sm opacity-75 mt-0.5">{translations.menuCtaSub}</span>
            </GoldButton>
          </AnimatedBlock>

          <AnimatedBlock animationType="fade-up" delay={300}>
            <GoldButton onClick={() => onNavigate('reservation')}>
              <span className="text-xl font-semibold">{translations.bookTable}</span>
              <span className="text-sm opacity-85 mt-0.5">{translations.reserveCtaSub}</span>
            </GoldButton>
          </AnimatedBlock>
        </div>

        {/* INFO */}
        <AnimatedBlock className="mt-10" animationType="scale" delay={400}>
          <Card className="p-6 rounded-2xl shadow-md">
            <InfoItem
              icon={<MapPin className="h-5 w-5" style={{ color: "#D7A962" }} />}
              text={
                <button 
                  onClick={() => window.open('https://maps.google.com/?q=40.2833,69.6333', '_blank')}
                  className="text-left hover:underline cursor-pointer transition-colors"
                >
                  {translations.address}
                </button>
              }
            />
            <InfoItem
              icon={<Phone className="h-5 w-5" style={{ color: "#D7A962" }} />}
              text={
                <>
                  <p>
                    {translations.deliveryLabel}: 
                    <button 
                      onClick={() => telegramService.callPhone()}
                      className="ml-1 hover:underline cursor-pointer transition-colors"
                    >
                      {translations.deliveryPhone}
                    </button>
                  </p>
                  <p>
                    {translations.bookingLabel}: 
                    <button 
                      onClick={() => telegramService.callPhone()}
                      className="ml-1 hover:underline cursor-pointer transition-colors"
                    >
                      {translations.bookingPhone}
                    </button>
                  </p>
                </>
              }
            />
            <InfoItem
              icon={<Clock className="h-5 w-5" style={{ color: "#D7A962" }} />}
              text={
                <div>
                  <p className="font-semibold">{translations.workingHours}</p>
                  <p className="text-sm text-gray-600">{translations.workHours}</p>
                </div>
              }
            />
          </Card>
        </AnimatedBlock>

        {/* Локальная анимация и стили для видео */}
        <style>{`
          @keyframes float {
            0% { transform: translateY(0) }
            50% { transform: translateY(-6px) }
            100% { transform: translateY(0) }
          }
          
          /* Оптимизация видео для мобильных устройств */
          @media (max-width: 768px) {
            video {
              object-position: center;
            }
          }
          
          /* Улучшение производительности видео */
          video {
            will-change: transform;
            transform: translateZ(0);
          }
        `}</style>
      </div>
    </div>
  );
}

function InfoItem({ icon, text }: { icon: React.ReactNode; text: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1.5 flex-shrink-0">{icon}</div>
      <div className="text-sm text-muted-foreground leading-snug">{text}</div>
    </div>
  );
}

/** Универсальная «золотая» кнопка с фирменным градиентом */
function GoldButton({
  children,
  onClick,
}: React.PropsWithChildren<{ onClick: () => void }>) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl py-5 px-6 text-center shadow-lg transition-all active:scale-95"
      style={{ background: GOLD_GRADIENT, color: "#1B1B1B" }}
    >
      <div className="flex flex-col items-center justify-center">{children}</div>
    </button>
  );
}