import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  Phone,
  User,
  Send,
  CheckCircle,
  Sparkles,
  FileText,
  Utensils,
  MessageSquare
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLanguage } from '../hooks/useLanguage';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AnimatedBlock } from './AnimatedBlock';
import { telegramService } from '../utils/telegramService';

interface ReservationForm {
  date: string;
  time: string;
  guests: number;
  name: string;
  phone: string;
  comment: string;
}

export function ReservationsPage() {
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 shadow-2xl">
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
              className="w-full golden-gradient text-white"
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">

    
      {/* Reservation Form */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4">
          <AnimatedBlock delay={200}>
            <Card className="shadow-2xl border-0">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 golden-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900">
                  {language === 'en' ? 'Book Your Table' : 
                   language === 'tj' ? 'Ҷадвали худро фармоиш диҳед' : 
                   language === 'zh' ? '预订餐桌' : 'Забронировать столик'}
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  {language === 'en' ? 'Fill out the form below and we will contact you to confirm your reservation' : 
                   language === 'tj' ? 'Формро пур кунед ва мо бо шумо тамос мегирем то фармоиши шуморо тасдиқ кунем' : 
                   language === 'zh' ? '填写下面的表格，我们会联系您确认预订' : 'Заполните форму ниже, и мы свяжемся с вами для подтверждения бронирования'}
                </p>
              </CardHeader>
            
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-amber-600" />
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
                      className="border-amber-200 focus:border-amber-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="time" className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      {language === 'en' ? 'Time' : 
                       language === 'tj' ? 'Вақт' : 
                       language === 'zh' ? '时间' : 'Время'}
                    </Label>
                    <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)}>
                      <SelectTrigger className="border-amber-200 focus:border-amber-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Number of Guests */}
                <div>
                  <Label htmlFor="guests" className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-amber-600" />
                    {language === 'en' ? 'Number of Guests' : 
                     language === 'tj' ? 'Шумораи меҳмонон' : 
                     language === 'zh' ? '客人数量' : 'Количество гостей'}
                  </Label>
                  <Select value={formData.guests.toString()} onValueChange={(value) => handleInputChange('guests', parseInt(value))}>
                    <SelectTrigger className="border-amber-200 focus:border-amber-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
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
                  <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-amber-600" />
                    {language === 'en' ? 'Full Name' : 
                     language === 'tj' ? 'Номи пурра' : 
                     language === 'zh' ? '全名' : 'ФИО'}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={language === 'en' ? 'Enter your full name' : 
                                language === 'tj' ? 'Номи пурраи худро ворид кунед' : 
                                language === 'zh' ? '输入您的全名' : 'Введите Ваше имя'}
                    className="border-amber-200 focus:border-amber-500"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-amber-600" />
                    {language === 'en' ? 'Phone Number' : 
                     language === 'tj' ? 'Рақами телефон' : 
                     language === 'zh' ? '电话号码' : 'Номер телефона'}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder={language === 'en' ? '+992 XX XXX XX XX' : 
                                language === 'tj' ? '+992 XX XXX XX XX' : 
                                language === 'zh' ? '+992 XX XXX XX XX' : '+992 XX XXX XX XX'}
                    className="border-amber-200 focus:border-amber-500"
                    required
                  />
                </div>

                {/* Comment */}
                <div>
                  <Label htmlFor="comment" className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-amber-600" />
                    {language === 'en' ? 'Comment (Optional)' : 
                     language === 'tj' ? 'Шарҳ (Ихтиёрӣ)' : 
                     language === 'zh' ? '备注（可选）' : 'Ваши пожелания и особые требования'}
                  </Label>
                  <textarea
                    id="comment"
                    value={formData.comment}
                    onChange={(e) => handleInputChange('comment', e.target.value)}
                    placeholder={language === 'en' ? 'Any special requests or comments...' : 
                                language === 'tj' ? 'Ҳар гуна дархостҳои махсус ё шарҳҳо...' : 
                                language === 'zh' ? '任何特殊要求或备注...' : 'Любые особые пожелания или комментарии...'}
                    className="w-full p-3 border border-amber-200 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full golden-gradient text-white py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 text-black"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {language === 'en' ? 'Sending...' : 
                       language === 'tj' ? 'Фиристода истодааст...' : 
                       language === 'zh' ? '发送中...' : 'Отправляется...'}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      {language === 'en' ? 'Send Reservation' : 
                       language === 'tj' ? 'Фармоишро фиристед' : 
                       language === 'zh' ? '发送预订' : 'Отправить бронирование'}
                    </>
                  )}
                </Button>
              </form>

              {/* Quick Call Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center mb-4">
                  <p className="text-gray-600 text-sm">
                    {language === 'en' ? 'Or call us directly for quick booking:' : 
                     language === 'tj' ? 'Ё барои фармоиши зуд ба мо занг занед:' : 
                     language === 'zh' ? '或直接致电我们快速预订：' : 'Или позвоните нам напрямую для быстрого бронирования:'}
                  </p>
                </div>
                <Button
                  onClick={() => window.open('tel:+992882027777')}
                  className="w-full golden-gradient text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-black"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  +992 88 202 7777
                </Button>
              </div>
                          </CardContent>
            </Card>
          </AnimatedBlock>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <AnimatedBlock delay={200}>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {language === 'en' ? 'Benefits of Booking' : 
                 language === 'tj' ? 'Фойдаҳои фармоиш' : 
                 language === 'zh' ? '预订的好处' : 'Преимущества бронирования'}
              </h2>
            </AnimatedBlock>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedBlock delay={400} direction="up">
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 golden-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {language === 'en' ? 'Guaranteed Seat' : 
                     language === 'tj' ? 'Ҷадвали кафолатшуда' : 
                     language === 'zh' ? '保证座位' : 'Гарантированное место'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'en' ? 'Your table will be reserved and waiting for you' : 
                     language === 'tj' ? 'Ҷадвали шумо фармоиш ва интизори шумо хоҳад буд' : 
                     language === 'zh' ? '您的餐桌将被预订并等待您的到来' : 'Ваш столик будет забронирован и ждать вас'}
                  </p>
                </CardContent>
              </Card>
            </AnimatedBlock>

            <AnimatedBlock delay={600} direction="up">
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 golden-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {language === 'en' ? 'Time Saving' : 
                     language === 'tj' ? 'Вақти сарфашуда' : 
                     language === 'zh' ? '节省时间' : 'Экономия времени'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'en' ? 'No need to wait in line, come at your appointed time' : 
                     language === 'tj' ? 'Низоъ кардан лозим нест, дар вақти муайяншуда биёед' : 
                     language === 'zh' ? '无需排队等待，在指定时间到达即可' : 'Не нужно стоять в очереди, приходите в назначенное время'}
                  </p>
                </CardContent>
              </Card>
            </AnimatedBlock>

            <AnimatedBlock delay={800} direction="up">
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 golden-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {language === 'en' ? 'Quick Confirmation' : 
                     language === 'tj' ? 'Тасдиқи зуд' : 
                     language === 'zh' ? '快速确认' : 'Быстрое подтверждение'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'en' ? 'We will contact you within 15 minutes to confirm' : 
                     language === 'tj' ? 'Мо дар давоми 15 дақиқа бо шумо тамос мегирем' : 
                     language === 'zh' ? '我们将在15分钟内联系您确认' : 'Мы свяжемся с вами в течение 15 минут для подтверждения'}
                  </p>
                </CardContent>
              </Card>
            </AnimatedBlock>
          </div>
        </div>
      </section>
    </div>
  );
}