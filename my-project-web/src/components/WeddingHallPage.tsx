import React, { useState } from 'react';
import { AnimatedBlock } from './AnimatedBlock';
import { useParallax } from '../hooks/useParallax';
import { 
  Heart, 
  Users, 
  Star, 
  Check, 
  Music, 
  Utensils, 
  Sparkles,
  Phone,
  Calendar,
  ChefHat,
  Wine,
  Flower,
  Play,
  Key
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useLanguage } from '../hooks/useLanguage';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { telegramService } from '../utils/telegramService';

interface ContactForm {
  name: string;
  phone: string;
  weddingDate: string;
  guests: number;
  budget: string;
  message: string;
}



export function WeddingHallPage() {
  const { translations } = useLanguage();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const parallaxRef = useParallax(0.3);
  const [contactForm, setContactForm] = useState<ContactForm>({
    
    name: '',
    phone: '',
    weddingDate: '',
    guests: 150,
    budget: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const services = [
    {
      icon: <Key className="h-8 w-8" />,
      title: translations.keyEntertainment,
      description: translations.keyEntertainmentDesc
    },
    {
      icon: <ChefHat className="h-8 w-8" />,
      title: translations.exclusiveMenu,
      description: translations.exclusiveMenuDesc
    },
    {
      icon: <Wine className="h-8 w-8" />,
      title: translations.banquetService,
      description: translations.banquetServiceDesc
    }
  ];

  const handleInputChange = (field: keyof ContactForm, value: string | number) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitForm = async () => {
    setIsSubmitting(true);
    
    try {
      // Отправляем заявку на свадебный зал в Telegram
      const weddingData = {
        customerName: contactForm.name,
        customerPhone: contactForm.phone,
        eventDate: contactForm.weddingDate || '',
        eventTime: '18:00', // По умолчанию
        guestCount: contactForm.guests,
        eventType: 'Свадьба',
        budget: contactForm.budget || undefined,
        comment: contactForm.message || undefined
      };

      const telegramSuccess = await telegramService.sendWeddingHallRequestToTelegram(weddingData);
      
      if (telegramSuccess) {
        setSubmitted(true);
      } else {
        console.error(translations.sendingError);
      }
    } catch (error) {
      console.error(translations.sendingError, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center px-4">
          <div className="w-20 h-20 lg:w-24 lg:h-24 golden-gradient rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Heart className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            {translations.thankYouForRequest}
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            {translations.thankYouForRequestDesc}
          </p>
          
          <div className="space-y-4">
            <Button
              onClick={() => window.location.reload()}
              className="golden-gradient text-white hover:golden-gradient-hover px-8 py-3"
              size="lg"
            >
              {translations.sendNewRequest}
            </Button>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                className="border-amber-200 text-amber-800 hover:bg-amber-50"
                onClick={() => window.open('tel:+992123456789')}
              >
                <Phone className="h-4 w-4 mr-2" />
                {translations.callUsNow}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 lg:space-y-16">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden rounded-3xl lg:mx-0">
        <div className="absolute inset-0" ref={parallaxRef as any}>
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=1080&fit=crop&q=80"
            alt="Wedding Hall"
            className="w-full h-full object-cover parallax-element"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <AnimatedBlock delay={300} direction="down" duration={1200}>
            <Badge className="mb-6 animated-gradient text-white border-0 px-6 py-2">
              💖 {translations.weddingTitle}
            </Badge>
          </AnimatedBlock>
          
          <AnimatedBlock delay={500} direction="up" duration={1200}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
              {translations.weddingTitle}
            </h1>
          </AnimatedBlock>
          
          <AnimatedBlock delay={700} direction="up" duration={1200}>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {translations.weddingSubtitle}
            </p>
          </AnimatedBlock>
          
          <AnimatedBlock delay={900} direction="up" duration={1200}>
            <div className="flex items-center justify-center space-x-4 text-lg">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>{translations.weddingCapacity}</span>
              </div>
              <div className="w-1 h-6 bg-white opacity-30" />
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-amber-400" />
                <span>{translations.premiumService}</span>
              </div>
            </div>
          </AnimatedBlock>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <AnimatedBlock delay={200} direction="up" duration={1000}>
          <div className="text-center mb-16">
            <Badge className="mb-4 golden-gradient text-white px-4 py-2">
              ✨ {translations.weddingServices}
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {translations.ourServices}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {translations.weddingServicesDesc}
            </p>
          </div>
        </AnimatedBlock>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <AnimatedBlock key={index} delay={400 + (index * 150)} direction="up" duration={1000}>
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-8 text-center">
                                  <div className="w-20 h-20 golden-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg text-white transform hover:rotate-12 transition-transform duration-300 floating-icon">
                  {service.icon}
                </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            </AnimatedBlock>
          ))}
        </div>
      </section>

      {/* Gallery & Video Section */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl mx-4 lg:mx-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedBlock delay={200} direction="up" duration={1000}>
            <div className="text-center mb-16">
              <Badge className="mb-4 golden-gradient text-white px-4 py-2">
                🎥 {translations.galleryAndVideo}
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {translations.ourWeddingHall}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {translations.luxuryAtmosphereDesc}
              </p>
            </div>
          </AnimatedBlock>

          {/* Video Section */}
          <AnimatedBlock delay={400} direction="up" duration={1000}>
        <div className="mb-12">
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl relative group">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=675&fit=crop&q=80"
                alt="Wedding Hall Video Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all duration-300">
                <div
                  className="w-20 h-20 golden-gradient rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                  onClick={() => setIsVideoOpen(true)}
                >
                  <div
              className="w-20 h-20 golden-gradient rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-300 cursor-pointer"
              onClick={() => setIsVideoOpen(true)}
            >
              <Play className="h-10 w-10 text-white ml-1" />
            </div>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-semibold mb-1">{translations.videoTour}</h3>
                <p className="text-gray-200">{translations.videoTourDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedBlock>

      {isVideoOpen && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center px-4">
    <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
      <div className="absolute top-4 left-4 z-50 text-white">
        <h3 className="text-lg font-semibold">{translations.videoTour}</h3>
        <p className="text-sm text-gray-300">{translations.videoTourDesc}</p>
      </div>
      <button
        className="absolute top-4 right-4 z-50 text-white bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-80"
        onClick={() => setIsVideoOpen(false)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
             viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <video controls autoPlay className="w-full h-full object-cover">
        <source src="wedding/wedding.MP4" type="video/mp4" />
        Ваш браузер не поддерживает воспроизведение видео.
      </video>
    </div>
  </div>
)}
          {/* Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'wedding/wedding-1.png',
              'wedding/wedding-2.png',
              'wedding/wedding-3.png',
              'wedding/wedding-4.png',
              'wedding/wedding-5.png',
              'wedding/wedding-6.png'
            ].map((image, index) => (
              <AnimatedBlock 
                key={index} 
                delay={600 + (index * 100)} 
                direction={index % 2 === 0 ? 'left' : 'right'} 
                duration={800}
              >
                <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <ImageWithFallback
                    src={image}
                    alt={`Wedding gallery ${index + 1}`}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
              </AnimatedBlock>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gradient-to-br from-white to-amber-50 rounded-3xl mx-4 lg:mx-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedBlock delay={200} direction="up" duration={1000}>
            <div className="text-center mb-12">
              <Badge className="mb-4 golden-gradient text-white px-4 py-2">
                📞 {translations.getQuote}
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {translations.getQuote}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {translations.contactForDetails}
              </p>
            </div>
          </AnimatedBlock>

          <AnimatedBlock delay={400} direction="up" duration={1000}>
            <Card className="border-amber-100 shadow-2xl">
              <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="font-semibold mb-2 block">
                      {translations.fullName} *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder={translations.coupleNamesPlaceholder}
                      className="border-amber-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="font-semibold mb-2 block">
                      {translations.phoneNumber} *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+992 XX XXX XXXX"
                      className="border-amber-200"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="weddingDate" className="font-semibold mb-2 block">
                      {translations.weddingDate}
                    </Label>
                    <Input
                      id="weddingDate"
                      type="date"
                      value={contactForm.weddingDate}
                      onChange={(e) => handleInputChange('weddingDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="border-amber-200"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="guests" className="font-semibold mb-2 block">
                      {translations.numberOfGuests}
                    </Label>
                    <Input
                      id="guests"
                      type="number"
                      value={contactForm.guests}
                      onChange={(e) => handleInputChange('guests', Number(e.target.value))}
                      min={10}
                      max={150}
                      className="border-amber-200"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-6">
                <div>
                  <Label htmlFor="budget" className="font-semibold mb-2 block">
                    {translations.approximateBudget}
                  </Label>
                  <Input
                    id="budget"
                    type="text"
                    value={contactForm.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    placeholder={translations.budgetPlaceholder}
                    className="border-amber-200"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message" className="font-semibold mb-2 block">
                    {translations.additionalInfoWedding}
                  </Label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder={translations.weddingMessagePlaceholder}
                    rows={4}
                    className="border-amber-200"
                  />
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={handleSubmitForm}
                  disabled={!contactForm.name || !contactForm.phone || isSubmitting}
                  className="golden-gradient text-white hover:golden-gradient-hover px-12 py-4 text-lg transform hover:scale-105 active:scale-95 transition-all duration-300"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="pulse-ring mr-2" />
                      {translations.sending}
                    </>
                  ) : (
                    <>
                      <Heart className="h-5 w-5 mr-2 heartbeat" />
                      {translations.getQuote}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          </AnimatedBlock>
        </div>
      </section>

      {/* Instagram Section */}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 sm:py-16 lg:py-20">
    <AnimatedBlock delay={200} direction="up" duration={1000}>
      <Badge className="mb-4 golden-gradient text-white px-4 py-2 text-black">
        🍽️ Instagram
      </Badge>
      <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
  {translations.instagramRestaurantTitle}
</h2>
<p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
{translations.instagramDesc}
</p>
<a
  href="https://www.instagram.com/wedding_hall_forel/?igsh=ZzMza28xc2hmeW8w "
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