import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, MapPin, Clock, Phone, Mail } from 'lucide-react';
import { telegramService } from '@/utils/telegram';

interface AboutUsPageProps {
  onBack: () => void;
}

export function AboutUsPage({ onBack }: AboutUsPageProps) {
  const { translations } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-amber-200">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mr-3 text-amber-800 hover:bg-amber-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">
            {translations.aboutUs}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <Card className="border-amber-200 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {translations.aboutUsTitle}
            </h2>
            <div className="text-gray-600 leading-relaxed font-normal">
              {translations.aboutUsWelcome}
            </div>
          </CardContent>
        </Card>

        {/* Location Section */}
        <Card className="border-amber-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <MapPin className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {translations.khujand}
                </h3>
                <div className="text-gray-600 leading-relaxed font-normal">
                  {translations.aboutUsLocation}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cuisine Section */}
        <Card className="border-amber-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              🌍 Кухня мира в одном месте
            </h3>
            <div className="text-gray-600 leading-relaxed font-normal">
              {translations.aboutUsCuisine}
            </div>
          </CardContent>
        </Card>

        {/* Signature Dish */}
        <Card className="border-amber-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              🐟 Наше фирменное блюдо
            </h3>
            <div className="text-gray-600 leading-relaxed font-normal">
              {translations.aboutUsSignature}
            </div>
          </CardContent>
        </Card>

        {/* Why Choose Us */}
        <Card className="border-amber-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              💫 Почему выбирают именно нас?
            </h3>
            <div className="text-gray-600 leading-relaxed font-normal">
              {translations.aboutUsFeatures}
            </div>
          </CardContent>
        </Card>

        {/* Together Section */}
        <Card className="border-amber-200 shadow-sm">
          <CardContent className="p-6">
            <div className="text-gray-600 leading-relaxed font-normal">
              {translations.aboutUsTogether}
            </div>
          </CardContent>
        </Card>

        {/* Come Visit */}
        <Card className="border-amber-200 shadow-sm">
          <CardContent className="p-6">
            <div className="text-gray-600 leading-relaxed font-normal">
              {translations.aboutUsCome}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-amber-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Контактная информация
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-amber-600" />
                <button 
                  onClick={() => window.open('https://maps.google.com/?q=40.2833,69.6333', '_blank')}
                  className="text-left hover:underline cursor-pointer transition-colors text-gray-600"
                >
                  {translations.address}
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-amber-600" />
                <span className="text-gray-600">
                  {translations.daily}: {translations.workHours}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-amber-600" />
                <button 
                  onClick={() => telegramService.callPhone()}
                  className="text-left hover:underline cursor-pointer transition-colors text-gray-600"
                >
                  +992 {translations.deliveryPhone}
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-amber-600" />
                <span className="text-gray-600">{translations.emailAddress}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 