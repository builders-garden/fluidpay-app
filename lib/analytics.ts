import firebaseAnalytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";

// custom analytics helper for logging events in firebase
export const analytics = async (
  eventName: string,
  params?: Record<string, any>
) => {
  try {
    await firebaseAnalytics().logEvent(eventName, params);
  } catch (err: any) {
    console.error(`ERROR_CALLING_${eventName}`, err);
    logError(`ERROR_CALLING_${eventName}`, err);
  }
};

// custom crashlytics helper for logging errors in firebase
export const logError = (message: string, error: Error) => {
  crashlytics().recordError(error);
  crashlytics().log(message);
};
