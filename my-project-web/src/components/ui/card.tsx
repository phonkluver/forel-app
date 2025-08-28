import * as React from "react";
import { cn } from "./utils";

// Компоненты-обёртки карточки
export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-2 rounded-xl border",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      className={cn("leading-none text-lg font-semibold", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm line-clamp-2", className)}
      {...props}
    />
  );
}

export function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 py-4 [&:last-child]:pb-6", className)}
      {...props}
    />
  );
}

export function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

// Пропсы карточки товара
export interface ProductCardProps {
  image: string;
  name: string;
  price: string;
  description: string;
  onAddToCart?: () => void;
}

// Основной компонент карточки товара
export function ProductCardDesktop({
  image,
  name,
  price,
  description,
  onAddToCart,
}: ProductCardProps) {
  return (
    <Card className="flex-row overflow-hidden max-w-xl w-full">
      {/* Блок изображения */}
      <div className="shrink-0 h-40 w-40 md:h-48 md:w-48 relative">
        <img
          src={image}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Блок контента */}
      <div className="flex flex-col flex-1">
        <CardHeader className="border-b">
          <div>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <CardAction>
            <span className="inline-flex rounded-lg bg-muted px-3 py-1 text-sm font-medium">
              {price}
            </span>
          </CardAction>
        </CardHeader>

        <CardContent />

        <CardFooter>
          <button
            type="button"
            onClick={onAddToCart}
            className="ml-auto inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
          >
            В корзину
          </button>
        </CardFooter>
      </div>
    </Card>
  );
}
