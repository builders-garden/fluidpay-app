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
      backgroundColor="#292836"
      tintColor="#201F2D"
      fontStyle={{ fontSize: 14, color: "#FFFFFF" }}
      activeFontStyle={{ fontSize: 14, color: "#FFFFFF", fontWeight: "600" }}
      style={{ height: 48 }}
    />
  );
}
