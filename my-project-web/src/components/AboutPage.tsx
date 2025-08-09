import React from 'react';
import { 
  MapPin, 
  Star, 
  Users, 
  ChefHat, 
  Heart,
  Utensils,
  Award,
  Waves,
  TreePine,
  Camera,
  Sparkles,
  Clock,
  Phone,
  Fish,
  Globe,
  Wine,
  Building2
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useLanguage } from '../hooks/useLanguage';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AnimatedBlock } from './AnimatedBlock';

interface AboutPageProps {
  onNavigate?: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const { language, translations } = useLanguage();

  const getAboutContent = () => {
    switch (language) {
      case 'en':
        return {
          title: 'About Forel Restaurant',
          subtitle: 'Premium restaurant complex',
          intro: 'Where taste meets atmosphere, and every detail creates the mood.',
          
          locationTitle: 'Prime Location',
          locationText: 'In the very heart of Khujand, on the picturesque banks of the Syr Darya, there is a restaurant that people want to talk about, return to, and one that is impossible to forget.',
          
          cuisineTitle: 'World Cuisine in One Place',
          cuisineText: 'Author\'s presentation, national traditions, exquisite Eastern European classics, delicate Japanese aesthetics, soulful Georgian cuisine and the lightness of Italian flavors. Every dish is thought out to the smallest detail.',
          
          signatureTitle: 'Our Signature Dish',
          signatureText: 'Our signature dish is grilled trout. Fresh fish, cooked with soul, has become a true symbol of taste and style of the "Forel" restaurant.',
          
          whyChooseTitle: 'Why Choose Us?',
          features: [
            {
              icon: Users,
              title: 'Spacious Banquet Hall',
              description: 'For 200 guests for the most beautiful weddings and events of your life.'
            },
            {
              icon: Award,
              title: '17 Stylish Cabins',
              description: 'Capacity from 6 to 70 people - each with unique interior and comfort.'
            },
            {
              icon: Waves,
              title: 'Two Verandas and Terrace',
              description: 'With picturesque views of the Syr Darya.'
            },
            {
              icon: Sparkles,
              title: 'Elegant Waterfall',
              description: 'One of the verandas is decorated with an elegant waterfall, creating an atmosphere of coziness and tranquility.'
            },
            {
              icon: TreePine,
              title: 'Abundance of Living Plants',
              description: 'Especially on the verandas, fills the space with freshness and natural harmony.'
            },
            {
              icon: Building2,
              title: 'Private Parking',
              description: 'Convenient secured parking for guests and event organizers — right at the restaurant entrance.'
            }
          ],
          
          
          familyTitle: 'Perfect for Togetherness',
          familyText: 'Here it\'s pleasant to be together - with family, friends, loved ones. "Forel" restaurant is not just dinner. It\'s a memory you\'ll return to again and again.',
          
          closingTitle: 'Come for the atmosphere, stay for the taste.',
          closingText: 'We are here to amaze.'
        };
        
      case 'tj':
        return {
          title: 'Дар бораи ресторани Форель',
          subtitle: 'Комплекси ресторанӣ дараҷаи олӣ',
          intro: 'Ҷое, ки мазза бо фазо вохӯрда, ҳар як ҷузъият каҳф мешавад.',
          
          locationTitle: 'Ҷойгиршавии беҳтарин',
          locationText: 'Дар қалби Хуҷанд, дар соҳили зебои Сирдарё, ресторане ҷойгир аст, ки дар бораи он сухан гуфтан, ба он баргаштан ва фаромӯш кардани он ғайриимкон аст.',
          
          cuisineTitle: 'Ошпазии ҷаҳон дар як ҷой',
          cuisineText: 'Пешкаши муаллиф, анъанаҳои миллӣ, классикаи шарқиву аврупоии зебо, эстетикаи нозуки ҷопонӣ, ошпазии рӯҳонии гурҷӣ ва сабукии мазаҳои итолиё. Ҳар як таом то ҷузъиёти хурд андешида шудааст.',
          
          signatureTitle: 'Таоми фирмавии мо',
          signatureText: 'Таоми фирмавии мо - форели дар мангал. Моҳии тоза, бо ҷон тайёршуда, рамзи ҳақиқии мазза ва услуби ресторани "Форель" гардидааст.',
          
          whyChooseTitle: 'Чаро моро интихоб мекунанд?',
          features: [
            {
              icon: Users,
              title: 'Толори фароқи васеъ',
              description: 'Барои 200 меҳмон барои зебатарин арӯсиҳо ва рӯйдодҳои ҳаёти шумо.'
            },
            {
              icon: Award,
              title: '17 кабинаи услубӣ',
              description: 'Барои 6 то 70 нафар - ҳар кадом бо дизайни беназир ва роҳатӣ.'
            },
            {
              icon: Waves,
              title: 'Ду веранда ва террача',
              description: 'Бо манзараи зебо ба Сирдарё.'
            },
            {
              icon: Sparkles,
              title: 'Шарлавҳаи зебо',
              description: 'Яке аз верандаҳо бо шарлавҳаи зебо оройиш ёфта, фазои оромӣ ва осоиш мебахшад.'
            },
            {
              icon: TreePine,
              title: 'Гиёҳҳои зинда',
              description: 'Махсусан дар верандаҳо, фазоро бо тарӯзагӣ ва оҳанги табиӣ пур мекунад.'
            },
            {
  icon: Building2,
  title: 'Майдончаи истгоҳии худӣ',
  description: 'Истгоҳи бехатар ва бароҳат барои меҳмонон ва ташкилкунандагони чорабиниҳо — дар паҳлуи даромадгоҳи ресторан.'
}
          ],
          
          familyTitle: 'Барои якҷоягӣ беҳтарин',
          familyText: 'Дар ин ҷо дар якҷоягӣ хуш аст - бо оила, дӯстон, азизон. Ресторани "Форель" танҳо шом нест. Ин хотираест, ки шумо бори дигар ба он хоҳед баргашт.',
          
          closingTitle: 'Барои фазо биёед, барои мазза боқӣ мондед.',
          closingText: 'Мо барои ҳайрон кардан ин ҷоем.'
        };
        
      case 'zh':
        return {
          title: '关于鳟鱼餐厅',
          subtitle: '高端餐厅综合体',
          intro: '味觉与氛围相遇的地方，每一个细节都营造着情调。',
          
          locationTitle: '绝佳位置',
          locationText: '在苦盏的心脏地带，在风景如画的锡尔河岸边，坐落着一家令人难忘、让人想要回归的餐厅。',
          
          cuisineTitle: '世界美食汇聚一堂',
          cuisineText: '原创呈现、民族传统、精致的东欧经典、细腻的日式美学、温暖的格鲁吉亚料理和意式风味的轻盈。每道菜都经过精心设计。',
          
          signatureTitle: '我们的招牌菜',
          signatureText: '我们的招牌菜是炭烤鳟鱼。新鲜的鱼类，用心烹制，已成为"鳟鱼"餐厅味觉与风格的真正象征。',
          
          whyChooseTitle: '为什么选择我们？',
          features: [
            {
              icon: Users,
              title: '宽敞宴会厅',
              description: '可容纳200位宾客，为您人生中最美好的婚礼和活动服务。'
            },
            {
              icon: Award,
              title: '17间时尚包厢',
              description: '可容纳6到70人 - 每间都有独特的内饰和舒适感。'
            },
            {
              icon: Waves,
              title: '两个阳台和露台',
              description: '享有锡尔河的如画美景。'
            },
            {
              icon: Sparkles,
              title: '优雅瀑布',
              description: '其中一个阳台装饰着优雅的瀑布，营造出舒适宁静的氛围。'
            },
            {
              icon: TreePine,
              title: '丰富的绿植',
              description: '特别是在阳台上，为空间带来清新和自然和谐。'
            },
            {
  icon: Building2,
  title: '专属停车位',
  description: '方便安全的停车位，位于餐厅入口处，服务宾客与活动组织者。'
}

          ],
          
          familyTitle: '完美的聚会场所',
          familyText: '在这里与家人、朋友、爱人共度美好时光。"鳟鱼"餐厅不仅仅是用餐，更是您会一次次回味的美好回忆。',
          
          closingTitle: '为氛围而来，为美味而留。',
          closingText: '我们在这里为您带来惊喜。'
        };
        
      default: // ru
        return {
          title: 'О ресторане Форель',
          subtitle: 'Ресторанный комплекс премиум-класса',
          intro: 'Где вкус встречается с атмосферой, а каждая деталь создаёт настроение.',
          
          locationTitle: 'Расположение в сердце города',
          locationText: 'В самом сердце Худжанда, на живописном берегу Сырдарьи, расположен ресторан, о котором хочется говорить, к которому хочется возвращаться и который невозможно забыть.',
          
          cuisineTitle: 'Кухня мира в одном месте',
          cuisineText: 'Авторская подача, национальные традиции, изысканная восточно-европейская классика, тонкая японская эстетика, душевная грузинская кухня и лёгкость итальянских вкусов. Каждое блюдо — продумано до мелочей.',
          
          signatureTitle: 'Наше фирменное блюдо',
          signatureText: 'Наше фирменное блюдо — форель на мангале. Свежая рыба, приготовленная с душой, стала настоящим символом вкуса и стиля ресторана «Форель».',
          
          whyChooseTitle: 'Почему выбирают именно нас?',
          features: [
            {
              icon: Users,
              title: 'Просторный банкетный зал',
              description: 'На 200 гостей для самых красивых свадеб и событий вашей жизни.'
            },
            {
              icon: Award,
              title: '17 стильных кабин',
              description: 'Вместимостью от 6 до 70 человек — каждая с уникальным интерьером и комфортом.'
            },
            {
              icon: Waves,
              title: 'Две веранды и терраса',
              description: 'С живописным видом на Сырдарью.'
            },
            {
              icon: Sparkles,
              title: 'Изящный водопад',
              description: 'Одна из веранд украшена изящным водопадом, создающим атмосферу уюта и спокойствия.'
            },
            {
              icon: TreePine,
              title: 'Обилие живых растений',
              description: 'Особенно на верандах, наполняет пространство свежестью и природной гармонией.'
            },
            {
    icon: Building2,
    title: 'Собственная парковка',
    description: 'Удобная охраняемая парковка для гостей и организаторов мероприятий прямо у входа в ресторан.'
  }
          ],
          
          familyTitle: 'Здесь приятно быть вместе',
          familyText: 'С семьёй, друзьями, любимыми. Ресторан «Форель» — это не просто ужин. Это воспоминание, к которому вы будете возвращаться снова и снова.',
          
          closingTitle: 'Приходите за атмосферой, оставайтесь за вкусом.',
          closingText: 'Мы здесь, чтобы удивлять.'
        };
    }
  };

  const content = getAboutContent();

  return (
    <div className="space-y-8 sm:space-y-12 justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="text-center space-y-4 sm:space-y-6">
        <AnimatedBlock delay={200}>
          <h1 className="text-2xl sm:text-3xl lg:text-6xl font-bold text-gray-900 px-2">
            {content.subtitle}
          </h1>
        </AnimatedBlock>
        <AnimatedBlock delay={400}>
          <p className="text-base sm:text-lg lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-2">
            {content.intro}
          </p>
        </AnimatedBlock>
      </section>

      {/* Restaurant Images */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[
          'we/we-6.png',
          'we/we-3.png',
          'we/we-1.png',
        ].map((image, index) => (
          <AnimatedBlock key={index} delay={index * 200} direction="up">
            <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <ImageWithFallback
                src={image}
                alt={`Restaurant interior ${index + 1}`}
                className="w-full h-[500px] object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0s group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300" />
              </div>
            </div>
          </AnimatedBlock>
        ))}
      </section>

      {/* Location Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-8 lg:p-12 mx-2 sm:mx-0">
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
          <div className="lg:w-1/2">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 golden-gradient rounded-full flex items-center justify-center">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{content.locationTitle}</h2>
            </div>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              {content.locationText}
            </p>
          </div>
          <div className="lg:w-1/2 w-full">
            <ImageWithFallback
              src="/hero/hero-1.jpg"
              alt="Restaurant by the river"
              className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Cuisine Section */}
      <section className="text-center space-y-6 sm:space-y-8">
        <div className="flex items-center justify-center space-x-3 mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 golden-gradient rounded-full flex items-center justify-center">
            <ChefHat className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{content.cuisineTitle}</h2>
        </div>
        <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto px-2">
          {content.cuisineText}
        </p>
        
        {/* Cuisine Types */}
        
      </section>

      {/* Signature Dish */}
      <section className="text-white rounded-3xl p-6 sm:p-8 lg:p-12 relative overflow-hidden mx-2 sm:mx-0">
        <div className="absolute inset-0 "></div>
        <div className="relative z-10 text-center space-y-4 sm:space-y-6">
          <div className="flex items-center justify-center space-x-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 golden-gradient rounded-full flex items-center justify-center">
              <Utensils className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-black">{content.signatureTitle}</h2>
          </div>
          <p className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto opacity-90 px-2 text-black">
            {content.signatureText}
          </p>
          
        </div>
      </section>

      {/* Features */}
      <section className="space-y-6 sm:space-y-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">{content.whyChooseTitle}</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {content.features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 golden-gradient rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Family Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 sm:p-8 lg:p-12 mx-2 sm:mx-0">
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="flex items-center justify-center space-x-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 golden-gradient rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{content.familyTitle}</h2>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto px-2">
            {content.familyText}
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="golden-gradient text-white rounded-3xl p-6 sm:p-8 lg:p-12 text-center relative overflow-hidden mx-2 sm:mx-0">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold px-2">{content.closingTitle}</h2>
          <p className="text-base sm:text-lg lg:text-xl opacity-90 px-2">{content.closingText}</p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mt-6 sm:mt-8">
            <Button
              onClick={() => {
                // Navigate to contact page
                const event = new CustomEvent('navigate', { detail: 'contact' });
                window.dispatchEvent(event);
              }}
              className="bg-white text-gray-900 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-2xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
              size="lg"
            >
              <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {translations.contactUs}
            </Button>
            <Button
              onClick={() => onNavigate?.('reservations')}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold backdrop-blur-sm bg-white bg-opacity-10 w-full sm:w-auto"
              size="lg"
            >
              <Clock className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {translations.makeReservation}
            </Button>
        
            
          </div>
        </div>
      </section>
    </div>
  );
}