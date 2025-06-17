// fcmService.ts
import { messaging, getToken } from "./firebase";

const VAPID_KEY = "BA9PZyUMnPjjqDbrOdvffSk6HAvjrquHoUzgwGYHOf9XLSq27ztB87iHcuTZshKyY6WojX6T_3SYtvMSS52ikVA"; // From Firebase Console > Project Settings > Cloud Messaging

export async function requestNotificationPermission(): Promise<string | null> {
  try {
    if (!messaging) {
      console.warn("Firebase messaging is not supported in this browser.");
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission not granted.");
      return null;
    }

    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    console.log("FCM Token:", token);

    // Optionally: Send token to your backend to associate with the user
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
}
