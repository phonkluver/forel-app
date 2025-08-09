import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { apiService } from '../../services/api';

interface AdminAuthProps {
  onAuthSuccess: () => void;
}

export function AdminAuth({ onAuthSuccess }: AdminAuthProps) {
  const [adminCode, setAdminCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminCode.trim()) {
      setError('Введите код доступа');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await apiService.authenticateAdmin(adminCode);
      onAuthSuccess();
    } catch (err) {
      setError('Неверный код доступа');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Админ панель</h1>
            <p className="text-gray-600 mt-2">Введите код доступа для входа</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="adminCode" className="block text-sm font-medium text-gray-700 mb-2">
                Код доступа
              </Label>
              <Input
                id="adminCode"
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Введите код доступа"
                className="w-full"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Проверка...' : 'Войти'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Для доступа к админ панели требуется код доступа
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
