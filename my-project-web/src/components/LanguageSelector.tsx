import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useLanguage, Language } from '../hooks/useLanguage';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { value: 'ru', label: 'RU Русский', flag: '🇷🇺' },
    { value: 'en', label: 'EN English', flag: '🇺🇸' },
    { value: 'tj', label: 'TJ Тоҷикӣ', flag: '🇹🇯' },
    { value: 'zh', label: 'ZH 中文', flag: '🇨🇳' }
  ];

  const currentLanguage = languages.find(lang => lang.value === language);

  return (
    <Select value={language} onValueChange={(value: string) => setLanguage(value as Language)}>
      <SelectTrigger className="w-36 border-amber-200 hover:bg-amber-50 transition-colors">
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-amber-700" />
          <SelectValue>
            <div className="flex items-center space-x-1">
              <span className="text-lg">{currentLanguage?.flag}</span>
              <span className="text-sm font-medium text-gray-700">
                {currentLanguage?.value.toUpperCase()}
              </span>
            </div>
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent className="border-amber-200">
        {languages.map((lang) => (
          <SelectItem 
            key={lang.value} 
            value={lang.value}
            className="hover:bg-amber-50 cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.label.split(' ')[1]}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}