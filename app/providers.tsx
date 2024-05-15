import React, { createContext, useEffect } from "react";
import { useColorScheme } from "nativewind";
import * as SecureStore from "expo-secure-store";
import { Appearance } from "react-native";

interface ThemeProviderProps {
  children: React.ReactNode;
}
export const ThemeContext = createContext<{
  theme: "light" | "dark";
  toggleTheme: () => void;
}>({
  theme: "dark",
  toggleTheme: () => {},
});
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { colorScheme, toggleColorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    const getDatas = async () => {
      try {
        let mode = SecureStore.getItem("colorScheme");
        if (!mode) {
          mode = "dark";
        }
        await SecureStore.setItemAsync("colorScheme", mode);

        const scheme = mode === "light" ? "light" : "dark";
        Appearance.setColorScheme(scheme);

        setColorScheme(scheme);
      } catch (error) {
        console.error("Error reading mode:", error);
      }
    };

    getDatas();
  }, []);
  return (
    <ThemeContext.Provider
      value={{ theme: colorScheme, toggleTheme: toggleColorScheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
