import { Bell, BellOff } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface NotificationButtonProps {
  productName: string;
  releaseDate: Date;
}

export function NotificationButton({ productName, releaseDate }: NotificationButtonProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if notifications were previously enabled
    const checkNotificationStatus = async () => {
      if ('Notification' in window) {
        const permission = await Notification.permission;
        setNotificationsEnabled(permission === 'granted');
      }
    };
    
    checkNotificationStatus();
  }, []);

  const enableNotifications = async () => {
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
        // Schedule notification for 1 hour before release
        const notificationTime = new Date(releaseDate);
        notificationTime.setHours(notificationTime.getHours() - 1);
        
        const timeUntilNotification = notificationTime.getTime() - Date.now();
        if (timeUntilNotification > 0) {
          setTimeout(() => {
            new Notification(`${productName} sort bientôt !`, {
              body: `La sortie est prévue dans 1 heure !`,
              icon: '/favicon.ico'
            });
          }, timeUntilNotification);
        }

        toast({
          title: "Notifications activées",
          description: "Vous serez notifié 1 heure avant la sortie",
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
    <Button
      variant={notificationsEnabled ? "outline" : "default"}
      size="sm"
      onClick={enableNotifications}
      className="gap-2"
    >
      {notificationsEnabled ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
      {notificationsEnabled ? "Notifications activées" : "Activer les notifications"}
    </Button>
  );
}
