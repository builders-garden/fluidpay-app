import SegmentedControl from "@react-native-segmented-control/segmented-control";

export function SegmentSlider<T extends string>({
  tabs,
  tab,
  setTab,
}: {
  tabs: T[];
  tab: T;
  setTab: (tab: T) => void;
}) {
  return (
    <SegmentedControl
      values={tabs}
      onValueChange={setTab as (tab: string) => void}
      selectedIndex={tabs.indexOf(tab)}
      backgroundColor="#161618"
      tintColor="#343434"
      fontStyle={{ fontSize: 14, color: "#FFFFFF" }}
      activeFontStyle={{ fontSize: 14, color: "#FFFFFF", fontWeight: "600" }}
      style={{ height: 36, borderRadius: 12 }}
    />
  );
}
