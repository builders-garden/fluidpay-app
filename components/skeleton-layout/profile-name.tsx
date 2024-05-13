import SkeletonLoader from "expo-skeleton-loader";
import { SkeletonType } from "./types";

export const DisplayNameSkeletonLayout = ({ style, isDark }: SkeletonType) => {
  return (
    <SkeletonLoader duration={850} boneColor={!isDark ? "#f2f2f2" : "#161618"}>
      <SkeletonLoader.Container style={[style]}>
        <SkeletonLoader.Item
          style={{ width: 200, height: 30, marginBottom: 5 }}
        />
      </SkeletonLoader.Container>
    </SkeletonLoader>
  );
};

export const UsernameSkeletonLayout = ({ style, isDark }: SkeletonType) => {
  return (
    <SkeletonLoader duration={850} boneColor={!isDark ? "#f2f2f2" : "#161618"}>
      <SkeletonLoader.Container style={[style]}>
        <SkeletonLoader.Item style={{ width: 100, height: 20 }} />
      </SkeletonLoader.Container>
    </SkeletonLoader>
  );
};
