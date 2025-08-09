import { TableItem } from "@/utils/restoplace";
import { Card } from "./ui/card";
import { cn } from "./ui/utils";

interface TableGridProps {
  tables: TableItem[];
  onTableSelect: (table: TableItem) => void;
}

export function TableGrid({ tables, onTableSelect }: TableGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {tables.map((table) => (
        <Card
          key={table.id}
          className={cn(
            "p-4 cursor-pointer transition-all hover:shadow-lg relative group overflow-hidden",
            table.status === "free" ? "bg-white" : "bg-gray-100"
          )}
          onClick={() => table.status === "free" && onTableSelect(table)}
        >
          <div className="relative">
            {table.imageUrl && (
              <img
                src={table.imageUrl}
                alt={table.name}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
            )}
            <div className={cn(
              "absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium",
              table.status === "free" 
                ? "golden-gradient text-white" 
                : "bg-red-100 text-red-700"
            )}>
              {table.status === "free" ? "Свободно" : "Занято"}
            </div>
          </div>
          
          <h3 className="font-medium text-lg">{table.name}</h3>
          <div className="space-y-1">
            {table.seats && (
              <p className="text-muted-foreground text-sm flex items-center gap-1">
                <span className="gold-text">•</span>
                {table.seats} мест
              </p>
            )}
            {table.hallName && (
              <p className="text-muted-foreground text-sm flex items-center gap-1">
                <span className="gold-text">•</span>
                {table.hallName}
              </p>
            )}
          </div>

          {table.status === "free" && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white font-medium">Выбрать стол</span>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
