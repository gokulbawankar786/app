import React, { useEffect, useCallback } from 'react';
import { View, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import * as Font from 'expo-font';
import AppNavigator from './src/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [ready, setReady] = React.useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Register for push notifications
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === 'granted') {
          const token = await Notifications.getExpoPushTokenAsync({ projectId: 'your-eas-project-id' });
          console.log('Push token:', token.data);
          // Send token to backend via authAPI.updateProfile({ fcmTokens: [token.data] })
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (ready) await SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AppNavigator />
    </View>
  );
}
