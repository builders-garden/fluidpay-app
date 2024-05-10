import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useColorScheme } from "nativewind";

export function SegmentSlider<T extends string>({
  tabs,
  tab,
  setTab,
}: {
  tabs: T[];
  tab: T;
  setTab: (tab: T) => void;
}) {
  const { colorScheme } = useColorScheme();
  return (
    <SegmentedControl
      values={tabs}
      onValueChange={setTab as (tab: string) => void}
      selectedIndex={tabs.indexOf(tab)}
      backgroundColor={colorScheme === "dark" ? "#161618" : "#f2f2f2"}
      tintColor="#343434"
      fontStyle={{
        fontSize: 14,
        color: colorScheme === "dark" ? "#FFF" : "#161618",
      }}
      activeFontStyle={{ fontSize: 14, color: "#FFFFFF", fontWeight: "600" }}
      style={{ height: 36, borderRadius: 12 }}
    />
  );
}
