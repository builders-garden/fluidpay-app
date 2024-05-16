import { parseUnits } from "viem";

/** Returns token units, 6000000 for $6 USDC */
export function dollarsToAmount(
  dollars: number | string,
  tokenDecimals: number = 6
) {
  if (typeof dollars === "number") {
    dollars = dollars.toFixed(tokenDecimals);
  }
  return parseUnits(dollars, tokenDecimals);
}

/** Returns eg "6.00" for 6000123 USDC units. */
export function amountToDollars(
  amount: bigint | number,
  tokenDecimals: number = 6
): `${number}` {
  const dispDecimals = 2;

  const totalCents =
    BigInt(amount) / BigInt(10 ** (tokenDecimals - dispDecimals));
  const dispStr = totalCents.toString().padStart(dispDecimals + 1, "0");
  const dollars = dispStr.slice(0, -dispDecimals);
  const cents = dispStr.slice(-dispDecimals);

  return `${dollars}.${cents}` as `${number}`;
}

export function colorHash(inputString: string) {
  let sum = 0;

  for (let char of inputString) {
    sum += char.charCodeAt(0);
  }

  let r = ~~(
    parseFloat(
      "0." +
        Math.sin(sum + 1)
          .toString()
          .substr(6)
    ) * 256
  );
  let g = ~~(
    parseFloat(
      "0." +
        Math.sin(sum + 2)
          .toString()
          .substr(6)
    ) * 256
  );
  let b = ~~(
    parseFloat(
      "0." +
        Math.sin(sum + 3)
          .toString()
          .substr(6)
    ) * 256
  );

  const rgb = "rgb(" + r + ", " + g + ", " + b + ")";

  let hex = "#";

  hex += ("00" + r.toString(16)).substr(-2, 2).toUpperCase();
  hex += ("00" + g.toString(16)).substr(-2, 2).toUpperCase();
  hex += ("00" + b.toString(16)).substr(-2, 2).toUpperCase();

  return {
    r,
    g,
    b,
    rgb,
    hex,
  };
}

export const shortenAddress = (address: string) => {
  if (!address) return "undefined";
  return `${address.slice(0, 4)}...${address.slice(-2)}`;
};

export const formatBigInt = (value: bigint, decimalPlaces = 2) => {
  if (!value) return 0;
  const divisorBigInt = BigInt(10 ** 6); // Adjust for decimal places
  const quotientBigInt = value / divisorBigInt;
  const remainderBigInt = value % divisorBigInt;
  const remainderStr = remainderBigInt.toString().padStart(decimalPlaces, "0"); // Pad with leading zeros
  return `${quotientBigInt}.${remainderStr.slice(0, decimalPlaces)}`;
};

export function isTodayOrYesterday(
  date: string
): "Today" | "Yesterday" | false {
  const today = new Date();

  // Create a new Date object from the list date
  const listDate = new Date(date);

  // Set time to midnight (00:00:00) for both dates
  // This ensures we only compare the date portion
  today.setHours(0, 0, 0, 0);
  listDate.setHours(0, 0, 0, 0);

  // Get the difference in milliseconds
  const diffInMs = today.getTime() - listDate.getTime();

  // One day in milliseconds
  const oneDayInMs = 1000 * 60 * 60 * 24;

  // Check if the listDate is today
  if (diffInMs === 0) {
    return "Today";
  }

  // Check if the listDate is yesterday (difference of one day)
  if (diffInMs === oneDayInMs) {
    return "Yesterday";
  }

  // If not today or yesterday, return false
  return false;
}

export function getFormattedTime(dateTimeString: string) {
  // Parse the string into a Date object
  const dateTime = new Date(dateTimeString);

  // Extract the time components
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();

  // Format hours to 12-hour format and determine AM/PM
  let formattedHours = hours % 12;
  formattedHours = formattedHours === 0 ? 12 : formattedHours; // Handle midnight (0 hours)
  const period = hours < 12 ? "AM" : "PM";

  // Construct the formatted time string
  const formattedTime = `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${period}`;

  return formattedTime;
}

export function formatDateToMonthDay(dateStr: string) {
  const dateObj = new Date(dateStr);
  const month = dateObj.toLocaleString("en-US", { month: "long" }); // Long month name (e.g., "May")
  const day = dateObj.getDate().toString().padStart(2, "0"); // Day with leading zero
  return `${month} ${day}`;
}

type DebouncedFunction<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => void;

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): DebouncedFunction<T> {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId!);

    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
