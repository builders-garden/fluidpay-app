import firebaseAnalytics from "@react-native-firebase/analytics";

// custom analytics helper for logging events in firebase
export const analytics = async (
  eventName: string,
  params?: Record<string, any>
) => {
  try {
    await firebaseAnalytics().logEvent(eventName, params);
  } catch (err: any) {
    console.error(`ERROR_CALLING_${eventName}`, err);
  }
};
