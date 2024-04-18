
import analytics from '@react-native-firebase/analytics';
import "./index.ts"

export const trackEvent = async (eventName: string, params: Record<string, any>) => {
    await analytics().logEvent(eventName, params);
}