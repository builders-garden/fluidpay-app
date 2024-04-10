import { router } from "expo-router";

const DEEP_LINK_PREFIX = "https://fluidpay.xyz";

export const handleDeepLinks = (url: string) => {
  if (!url) return;

  const requestUrlRegex = /\/u\/(\w+)\/request\/(\d+)/;
  const sendUrlRegex = /\/u\/(\w+)/;

  if (url.match(requestUrlRegex)) {
    const username = url.replace(DEEP_LINK_PREFIX, "").split("/")[2];
    const amount = url.replace(DEEP_LINK_PREFIX, "").split("/")[4];
    router.push({
      pathname: "/app/send-modal",
      params: {
        user: JSON.stringify({
          username,
        }),
        amount,
      },
    });
  } else if (url.match(sendUrlRegex)) {
    const username = url.replace(DEEP_LINK_PREFIX, "").split("/")[2];
    router.push({
      pathname: "/app/send-modal",
      params: {
        user: JSON.stringify({
          username,
        }),
      },
    });
  }
};
