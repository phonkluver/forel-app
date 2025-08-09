import React from 'react';
import { Languages } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useLanguage } from '../hooks/useLanguage';

const languages = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'tj', name: 'Тоҷикӣ', flag: '🇹🇯' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="border-amber-200 hover:bg-amber-50"
        >
          <span className="mr-1">{currentLanguage?.flag}</span>
          <Languages className="h-4 w-4 text-amber-800" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as 'ru' | 'en' | 'tj' | 'zh')}
            className={`cursor-pointer ${
              language === lang.code ? 'bg-amber-50 text-amber-800' : ''
            }`}
          >
            <span className="mr-2">{lang.flag}</span>
            <span>{lang.name}</span>
            {language === lang.code && (
              <span className="ml-auto text-amber-600">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}