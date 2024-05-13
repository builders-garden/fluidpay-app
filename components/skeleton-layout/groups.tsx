import SkeletonLoader from "expo-skeleton-loader";
import { SkeletonType } from "./types";

export const GroupsLayout = ({ isDark, size = 48, style }: SkeletonType) => (
  <SkeletonLoader duration={850} boneColor={!isDark ? "#f2f2f2" : "#161618"}>
    <SkeletonLoader.Container style={[{ flex: 1 }, style]}>
      <SkeletonLoader.Item style={{ width: 110, height: 30 }} />

      <SkeletonLoader.Container
        style={{ paddingVertical: 10, flexDirection: "row" }}
      >
        <SkeletonLoader.Item
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
        />
        <SkeletonLoader.Item
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            marginLeft: -24,
          }}
        />
      </SkeletonLoader.Container>
    </SkeletonLoader.Container>
  </SkeletonLoader>
);
