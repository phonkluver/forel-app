import * as React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useLanguage } from "../hooks/useLanguage";
import { telegramService } from "../utils/telegram";

interface ReservationComponentProps {
  onSuccess?: () => void;
}

export function ReservationComponent({ onSuccess }: ReservationComponentProps) {
  const { language, translations } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: ''
  });

  // Обработка отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      
      // Отправляем данные в Telegram бот админа
      const reservationData = {
        customerName: formData.name,
        customerPhone: formData.phone,
        date: formData.date,
        time: formData.time,
        guests: parseInt(formData.guests, 10)
      };

      const success = await telegramService.sendReservationToTelegram(reservationData);
      
      if (success) {
        onSuccess?.();
        
        // Очистка формы после успешной отправки
        setFormData({
          name: '',
          phone: '',
          date: '',
          time: '',
          guests: ''
        });
      } else {
        setError('Ошибка отправки уведомления');
      }
      
    } catch (error) {
      setError('Ошибка при бронировании');
      console.error('Error submitting reservation:', error);
    } finally {
      setLoading(false);
    }
  };

  // Обработка изменения полей формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">
            Бронирование стола
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Введите ваше имя"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+992 XX XXX XX XX"
              />
            </div>

            <div>
              <Label htmlFor="guests">Количество гостей</Label>
              <Input
                id="guests"
                name="guests"
                type="number"
                min="1"
                max="20"
                required
                value={formData.guests}
                onChange={handleInputChange}
                placeholder="Укажите количество гостей"
              />
            </div>
            
            <div>
              <Label htmlFor="date">Дата</Label>
              <Input
                id="date"
                name="date"
                type="date"
                required
                value={formData.date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <Label htmlFor="time">Время</Label>
              <Input
                id="time"
                name="time"
                type="time"
                required
                value={formData.time}
                onChange={handleInputChange}
                min="11:00"
                max="23:00"
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <Button 
              type="submit" 
              className="w-full golden-gradient" 
              disabled={loading}
            >
              {loading ? 'Отправка...' : 'Забронировать'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
