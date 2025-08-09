import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface LanguageOption {
  code: 'ru' | 'en' | 'tj' | 'zh';
  name: string;
  flag: string;
  description: string;
}

const languages: LanguageOption[] = [
  { 
    code: 'ru', 
    name: 'Русский', 
    flag: '🇷🇺',
    description: 'Русский язык'
  },
  { 
    code: 'en', 
    name: 'English', 
    flag: '🇺🇸',
    description: 'English language'
  },
  { 
    code: 'tj', 
    name: 'Тоҷикӣ', 
    flag: '🇹🇯',
    description: 'Забони тоҷикӣ'
  },
  { 
    code: 'zh', 
    name: '中文', 
    flag: '🇨🇳',
    description: '中文语言'
  },
];

interface LanguageSelectionPageProps {
  onLanguageSelect: (language: 'ru' | 'en' | 'tj' | 'zh') => void;
}

export function LanguageSelectionPage({ onLanguageSelect }: LanguageSelectionPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-amber-200">
        <CardHeader className="text-center pb-6">
        <div className="mx-auto rounded-full flex items-center justify-center mb-4">
          <img src="/favicon.png" alt="Логотип" className="w-60 h-30 object-contain" />
        </div>

          <CardTitle className="text-2xl font-bold text-gray-800">
            Добро пожаловать в <br /> Ресторан "Форель"
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Выберите предпочитаемый язык
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant="outline"
              size="lg"
              onClick={() => onLanguageSelect(lang.code)}
              className="w-full h-16 border-amber-200 hover:bg-amber-50 hover:border-amber-300 transition-all duration-200"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">{lang.name}</div>
                    <div className="text-sm text-gray-500">{lang.description}</div>
                  </div>
                </div>
                <span className="text-amber-600">→</span>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
} 