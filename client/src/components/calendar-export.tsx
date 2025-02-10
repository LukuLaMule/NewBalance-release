import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import type { Product } from "@shared/schema";

interface CalendarExportProps {
  product: Product;
}

export function CalendarExport({ product }: CalendarExportProps) {
  const exportToCalendar = () => {
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, "");
    };

    const startDate = new Date(product.releaseDate);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

    const event = {
      title: `Sortie ${product.name}`,
      description: `${product.name} - Prix: ${product.price}\nLien: ${product.url}`,
      start: formatDate(startDate),
      end: formatDate(endDate),
      location: product.url,
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${event.start}/${event.end}&details=${encodeURIComponent(
      event.description
    )}&location=${encodeURIComponent(event.location)}`;

    window.open(googleCalendarUrl, "_blank");
  };

  return (
    <Button variant="outline" size="sm" onClick={exportToCalendar} className="gap-2">
      <Calendar className="h-4 w-4" />
      Ajouter au calendrier
    </Button>
  );
}
