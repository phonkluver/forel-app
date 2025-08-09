import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { TableItem } from "@/utils/restoplace";
import { useLanguage } from "../hooks/useLanguage";

interface TableReservationFormProps {
  table: TableItem;
  onSubmit: (data: ReservationData) => void;
  onBack: () => void;
}

export interface ReservationData {
  name: string;
  phone: string;
  date: string;
  time: string;
  tableId: string;
}

export function TableReservationForm({ table, onSubmit, onBack }: TableReservationFormProps) {
  const [formData, setFormData] = useState<ReservationData>({
    name: "",
    phone: "",
    date: "",
    time: "",
    tableId: table.id,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Получаем минимальную дату (сегодня)
  const today = new Date().toISOString().split('T')[0];
  const { translations } = useLanguage();

  return (
    <Card className="animate-fade-in">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">
            {translations.reservationFormTitle} {table.name}
          </h2>
          <div className="flex gap-2 text-sm text-muted-foreground">
            {table.seats && <span>• {table.seats} {translations.guestsLabel}</span>}
            {table.hallName && <span>• {table.hallName}</span>}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {translations.nameLabel}
            </label>
            <Input
              required
              placeholder={translations.namePlaceholder}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {translations.phoneLabel}
            </label>
            <Input
              required
              type="tel"
              placeholder={translations.phonePlaceholder}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {translations.dateLabel}
              </label>
              <Input
                required
                type="date"
                min={today}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {translations.timeLabel}
              </label>
              <Input
                required
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="bg-white"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onBack} 
              className="flex-1"
            >
              {translations.backLabel}
            </Button>
            <Button 
              type="submit" 
              className="flex-1 golden-gradient text-white hover:opacity-90"
            >
              {translations.submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
