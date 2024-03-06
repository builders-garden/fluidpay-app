import { StyleSheet, Text } from "react-native";

import Spacer from "./spacer";
import { amountToDollars } from "../lib/utils";

export const amountSeparator = ".";

/** Returns eg "$1.00" or "$1,23" or "$1.2345" */
export function getAmountText({
  dollars,
  amount,
  symbol,
  fullPrecision,
}: {
  dollars?: `${number}` | number;
  amount?: bigint;
  symbol?: string;
  fullPrecision?: boolean;
}) {
  if (dollars == null) {
    if (amount == null) throw new Error("Missing amount");
    // Amount specified, calculate dollars string
    dollars = amountToDollars(amount);
  } else if (amount == null) {
    // Dollars specified, normalize to string
    if (typeof dollars === "number") {
      dollars = dollars.toFixed(2) as `${number}`;
    }
  } else {
    throw new Error("Specify amount or dollars, not both");
  }

  if (symbol == null) {
    symbol = "$";
  }
  const [wholeDollars, cents] = dollars.split(".");
  const dispCents = fullPrecision ? cents : cents.slice(0, 2);
  return `${symbol}${wholeDollars}${amountSeparator}${dispCents}`;
}

/** Displays eg "$1.23" or "$1,23" as H1 or H2. */
export function TitleAmount({ amount }: { amount: bigint }) {
  if (!(amount >= 0)) throw new Error("Invalid amount");

  const symbol = "$";
  const [dollars, cents] = amountToDollars(amount).split(".");

  return (
    <Text style={styles.title}>
      <Text style={styles.titleSmall}>{symbol}</Text>
      <Spacer w={4} />
      {dollars}
      {amountSeparator}
      {cents}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 48,
    fontVariant: ["tabular-nums"],
    color: "#262626",
    fontWeight: "600",
    textAlign: "center",
  },
  titleSmall: {
    fontSize: 42,
  },
  subtitle: {
    fontSize: 40,
    fontVariant: ["tabular-nums"],
    color: "#262626",
    fontWeight: "600",
    textAlign: "center",
  },
  subtitleSmall: {
    fontSize: 36,
  },
});
