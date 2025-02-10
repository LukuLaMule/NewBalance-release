import { Bell, BellOff } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface NotificationButtonProps {
  productName: string;
  releaseDate: Date;
  productUrl: string;
}

const SIZES = ["44", "44.5", "45", "45.5", "46", "46.5", "47"];

export function NotificationButton({ productName, releaseDate, productUrl }: NotificationButtonProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const checkNotificationStatus = async () => {
      if ('Notification' in window) {
        const permission = await Notification.permission;
        setNotificationsEnabled(permission === 'granted');
      }
    };

    checkNotificationStatus();
  }, []);

  const openProductPage = (size: string) => {
    const sizeParam = `?size=${size}`;
    window.open(`${productUrl}${sizeParam}`, '_blank');
  };

  const enableNotifications = async () => {
    if (!selectedSize) {
      toast({
        title: "Sélectionnez une taille",
        description: "Veuillez d'abord sélectionner votre taille",
        variant: "destructive",
      });
      return;
    }

    if (!('Notification' in window)) {
      toast({
        title: "Erreur",
        description: "Votre navigateur ne supporte pas les notifications",
        variant: "destructive",
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        setNotificationsEnabled(true);

        // Notification 1 heure avant
        const notificationTime = new Date(releaseDate);
        notificationTime.setHours(notificationTime.getHours() - 1);
        const timeUntilNotification = notificationTime.getTime() - Date.now();
        if (timeUntilNotification > 0) {
          setTimeout(() => {
            new Notification(`${productName} en ${selectedSize} disponible bientôt !`, {
              body: `Préparez-vous ! La sortie en taille ${selectedSize} est dans 1 heure.`,
              icon: '/favicon.ico',
              tag: 'release-notification',
              requireInteraction: true,
            }).onclick = () => openProductPage(selectedSize);
          }, timeUntilNotification);
        }

        // Notification 5 minutes avant
        const lastNotificationTime = new Date(releaseDate);
        lastNotificationTime.setMinutes(lastNotificationTime.getMinutes() - 5);
        const timeUntilLastNotification = lastNotificationTime.getTime() - Date.now();
        if (timeUntilLastNotification > 0) {
          setTimeout(() => {
            new Notification(`${productName} en ${selectedSize} : 5 minutes !`, {
              body: `La sortie est dans 5 minutes ! Cliquez pour ouvrir la page.`,
              icon: '/favicon.ico',
              tag: 'release-notification',
              requireInteraction: true,
            }).onclick = () => openProductPage(selectedSize);
          }, timeUntilLastNotification);
        }

        // Notification au moment de la sortie
        const releaseNotificationTime = new Date(releaseDate).getTime() - Date.now();
        if (releaseNotificationTime > 0) {
          setTimeout(() => {
            new Notification(`${productName} en ${selectedSize} : DISPONIBLE !`, {
              body: `🚨 La paire est sortie ! Cliquez pour l'ajouter au panier !`,
              icon: '/favicon.ico',
              tag: 'release-notification',
              requireInteraction: true,
            }).onclick = () => openProductPage(selectedSize);
            openProductPage(selectedSize);
          }, releaseNotificationTime);
        }

        toast({
          title: "Notifications activées",
          description: `Vous serez notifié pour la taille ${selectedSize}`,
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'activer les notifications",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
      <Select value={selectedSize} onValueChange={setSelectedSize}>
        <SelectTrigger className="w-24 flex-shrink-0">
          <SelectValue placeholder="Taille" />
        </SelectTrigger>
        <SelectContent>
          {SIZES.map((size) => (
            <SelectItem key={size} value={size}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant={notificationsEnabled ? "outline" : "default"}
        size="sm"
        onClick={enableNotifications}
        className="gap-2 flex-1"
      >
        {notificationsEnabled ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
        {notificationsEnabled ? "Notifications activées" : "M'alerter"}
      </Button>
    </div>
  );
}