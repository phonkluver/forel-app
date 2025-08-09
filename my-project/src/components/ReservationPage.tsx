"use client";

import * as React from "react";
import { useState } from "react";
import { Calendar, Clock, Users, User, Phone, Send, CheckCircle, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useLanguage } from "../hooks/useLanguage";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AnimatedBlock } from "./AnimatedBlock";
import { telegramService } from '../utils/telegram';

interface ReservationForm {
  date: string;
  time: string;
  guests: number;
  name: string;
  phone: string;
  comment: string;
}

export function ReservationPage() {
  const { language, translations } = useLanguage();
  const [formData, setFormData] = useState<ReservationForm>({
    date: new Date().toISOString().split('T')[0], // Сегодняшняя дата
    time: '18:00',
    guests: 2,
    name: '',
    phone: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Генерация времени с 8:00 до 22:00
  const timeSlots = [];
  for (let hour = 8; hour <= 22; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 22) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }

  // Генерация количества гостей
  const guestOptions = Array.from({ length: 20 }, (_, i) => i + 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Отправляем бронирование в Telegram
      const reservationData = {
        customerName: formData.name,
        customerPhone: formData.phone,
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        comment: formData.comment || undefined
      };

      const telegramSuccess = await telegramService.sendReservationToTelegram(reservationData);
      
      if (telegramSuccess) {
        setIsSubmitted(true);
        setFormData({
          date: new Date().toISOString().split('T')[0],
          time: '18:00',
          guests: 2,
          name: '',
          phone: '',
          comment: ''
        });
      } else {
        console.error('Ошибка отправки в Telegram');
      }
    } catch (error) {
      console.error('Ошибка отправки:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ReservationForm, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto p-4 pb-[calc(env(safe-area-inset-bottom,0)+80px)]">
        <Card className="max-w-md mx-auto shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Reservation Confirmed!' : 
               language === 'tj' ? 'Фармоиш тасдиқ шуд!' : 
               language === 'zh' ? '预订确认！' : 'Бронирование подтверждено!'}
            </h2>
            <p className="text-gray-600 mb-6">
              {language === 'en' ? 'We will contact you shortly to confirm your reservation.' : 
               language === 'tj' ? 'Мо ба зудӣ бо шумо тамос мегирем то фармоиши шуморо тасдиқ кунем.' : 
               language === 'zh' ? '我们会尽快联系您确认预订。' : 'Мы свяжемся с вами в ближайшее время для подтверждения бронирования.'}
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              className="w-full"
              style={{
                background:
                  "linear-gradient(90deg,#FDCB6F 0%,#FDCE78 3%,#FDD891 9%,#FEE9BA 16%,#FFECC1 18%,#FEE5B1 20%,#FEDB99 25%,#FDD486 31%,#FDCF78 37%,#FDCB71 46%,#FDCB6F 62%,#FBC96E 77%,#F4C36C 82%,#E8B868 86%,#D7A962 89%,#C1955B 92%,#A67C52 94%,#AB8153 95%,#BC9059 97%,#D7A962 98%,#FDCB6F 100%)",
                color: "#1B1B1B",
              }}
            >
              {language === 'en' ? 'Make Another Reservation' : 
               language === 'tj' ? 'Боз як фармоиш диҳед' : 
               language === 'zh' ? '再次预订' : 'Забронировать еще раз'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pb-[calc(env(safe-area-inset-bottom,0)+80px)]">
      {/* HERO */}
      <AnimatedBlock>
        <section className="relative h-[30vh] min-h-[180px] flex items-center justify-center overflow-hidden rounded-3xl shadow-xl mb-6">
        <ImageWithFallback
          src="/bron.jpg"
          alt="Restaurant interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

        <div className="relative z-10 text-center text-white px-6 max-w-3xl flex flex-col items-center justify-center w-full h-full">
          <h1 className="text-2xl md:text-4xl font-extrabold leading-tight drop-shadow-xl">
            {language === 'en' ? 'Reserve Your Table' : 
             language === 'tj' ? 'Ҷадвали худро фармоиш диҳед' : 
             language === 'zh' ? '预订您的餐桌' : 'Забронируйте свой столик'}
          </h1>
          <p className="mt-3 text-white/90 text-sm md:text-base leading-relaxed">
            {language === 'en' ? 'Book a table and enjoy delicious dishes' : 
             language === 'tj' ? 'Ҷадвале фармоиш диҳед ва аз таомҳои хуштаъм баҳраманд шавед' : 
             language === 'zh' ? '预订餐桌，享用美味佳肴' : 'Забронируйте столик и насладитесь вкусными блюдами'}
          </p>
        </div>
      </section>
      </AnimatedBlock>

      {/* Reservation Form */}
      <AnimatedBlock className="max-w-md mx-auto" animationType="scale" delay={200}>
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                 style={{
                   background:
                     "linear-gradient(90deg,#FDCB6F 0%,#FDCE78 3%,#FDD891 9%,#FEE9BA 16%,#FFECC1 18%,#FEE5B1 20%,#FEDB99 25%,#FDD486 31%,#FDCF78 37%,#FDCB71 46%,#FDCB6F 62%,#FBC96E 77%,#F4C36C 82%,#E8B868 86%,#D7A962 89%,#C1955B 92%,#A67C52 94%,#AB8153 95%,#BC9059 97%,#D7A962 98%,#FDCB6F 100%)"
                 }}>
              <Calendar className="h-8 w-8 text-gray-900" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {language === 'en' ? 'Book Your Table' : 
               language === 'tj' ? 'Ҷадвали худро фармоиш диҳед' : 
               language === 'zh' ? '预订餐桌' : 'Забронировать столик'}
            </CardTitle>
            <p className="text-gray-600 mt-2 text-sm">
              {language === 'en' ? 'Fill out the form below' : 
               language === 'tj' ? 'Формро пур кунед' : 
               language === 'zh' ? '填写下面的表格' : 'Заполните форму ниже'}
            </p>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="date" className="flex items-center gap-1 mb-2 text-sm">
                    <Calendar className="h-3 w-3" />
                    {language === 'en' ? 'Date' : 
                     language === 'tj' ? 'Сана' : 
                     language === 'zh' ? '日期' : 'Дата'}
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="text-sm w-4/5"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="time" className="flex items-center gap-1 mb-2 text-sm">
                    <Clock className="h-3 w-3" />
                    {language === 'en' ? 'Time' : 
                     language === 'tj' ? 'Вақт' : 
                     language === 'zh' ? '时间' : 'Время'}
                  </Label>
                                  <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-48 overflow-y-auto">
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                </div>
              </div>

              {/* Number of Guests */}
              <div>
                <Label htmlFor="guests" className="flex items-center gap-1 mb-2 text-sm">
                  <Users className="h-3 w-3" />
                  {language === 'en' ? 'Guests' : 
                   language === 'tj' ? 'Меҳмонон' : 
                   language === 'zh' ? '客人' : 'Гости'}
                </Label>
                <Select value={formData.guests.toString()} onValueChange={(value) => handleInputChange('guests', parseInt(value))}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-48 overflow-y-auto">
                    {guestOptions.map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {language === 'en' ? 'person' : 
                               language === 'tj' ? 'нафар' : 
                               language === 'zh' ? '人' : 'человек'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="name" className="flex items-center gap-1 mb-2 text-sm">
                  <User className="h-3 w-3" />
                  {language === 'en' ? 'Name' : 
                   language === 'tj' ? 'Ном' : 
                   language === 'zh' ? '姓名' : 'Имя'}
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={language === 'en' ? 'Your name' : 
                              language === 'tj' ? 'Номи шумо' : 
                              language === 'zh' ? '您的姓名' : 'Ваше имя'}
                  className="text-sm"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="flex items-center gap-1 mb-2 text-sm">
                  <Phone className="h-3 w-3" />
                  {language === 'en' ? 'Phone' : 
                   language === 'tj' ? 'Телефон' : 
                   language === 'zh' ? '电话' : 'Телефон'}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+992 XX XXX XX XX"
                  className="text-sm"
                  required
                />
              </div>

              {/* Comment */}
              <div>
                <Label htmlFor="comment" className="flex items-center gap-1 mb-2 text-sm">
                  <MessageSquare className="h-3 w-3" />
                  {language === 'en' ? 'Comment (Optional)' : 
                   language === 'tj' ? 'Шарҳ (Ихтиёрӣ)' : 
                   language === 'zh' ? '备注（可选）' : 'Ваши пожелания и особые требования'}
                </Label>
                <textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => handleInputChange('comment', e.target.value)}
                  placeholder={language === 'en' ? 'Any special requests...' : 
                              language === 'tj' ? 'Ҳар гуна дархостҳои махсус...' : 
                              language === 'zh' ? '任何特殊要求...' : 'Любые особые пожелания...'}
                  className="w-full p-2 border border-gray-200 rounded text-sm resize-none"
                  rows={2}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 text-base font-semibold shadow-xl"
                style={{
                  background:
                    "linear-gradient(90deg,#FDCB6F 0%,#FDCE78 3%,#FDD891 9%,#FEE9BA 16%,#FFECC1 18%,#FEE5B1 20%,#FEDB99 25%,#FDD486 31%,#FDCF78 37%,#FDCB71 46%,#FDCB6F 62%,#FBC96E 77%,#F4C36C 82%,#E8B868 86%,#D7A962 89%,#C1955B 92%,#A67C52 94%,#AB8153 95%,#BC9059 97%,#D7A962 98%,#FDCB6F 100%)",
                  color: "#1B1B1B",
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                    {language === 'en' ? 'Sending...' : 
                     language === 'tj' ? 'Фиристода истодааст...' : 
                     language === 'zh' ? '发送中...' : 'Отправляется...'}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {language === 'en' ? 'Send Reservation' : 
                     language === 'tj' ? 'Фармоишро фиристед' : 
                     language === 'zh' ? '发送预订' : 'Отправить бронирование'}
                  </>
                )}
              </Button>
            </form>

            {/* Quick Call Button */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-center mb-3">
                <p className="text-gray-600 text-xs">
                  {language === 'en' ? 'Or call us directly:' : 
                   language === 'tj' ? 'Ё ба мо занг занед:' : 
                   language === 'zh' ? '或直接致电：' : 'Или позвоните нам напрямую:'}
                </p>
              </div>
              <Button
                onClick={() => window.open('tel:+992882027777')}
                className="w-full py-3 text-base font-semibold shadow-xl transform hover:scale-105 transition-all duration-200"
                style={{
                  background:
                    "linear-gradient(90deg,#FDCB6F 0%,#FDCE78 3%,#FDD891 9%,#FEE9BA 16%,#FFECC1 18%,#FEE5B1 20%,#FEDB99 25%,#FDD486 31%,#FDCF78 37%,#FDCB71 46%,#FDCB6F 62%,#FBC96E 77%,#F4C36C 82%,#E8B868 86%,#D7A962 89%,#C1955B 92%,#A67C52 94%,#AB8153 95%,#BC9059 97%,#D7A962 98%,#FDCB6F 100%)",
                  color: "#1B1B1B",
                }}
              >
                <Phone className="mr-2 h-4 w-4" />
                +992 88 202 7777
              </Button>
            </div>
          </CardContent>
        </Card>
      </AnimatedBlock>
    </div>
  );
}
