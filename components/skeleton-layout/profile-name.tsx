import SkeletonLoader from "expo-skeleton-loader";
import { ViewStyle } from "react-native";

export const DisplayNameSkeletonLayout = ({ style }: { style?: ViewStyle }) => {
  return (
    <SkeletonLoader duration={850}>
      <SkeletonLoader.Container style={[style]}>
        <SkeletonLoader.Item
          style={{ width: 200, height: 30, marginBottom: 5 }}
        />
      </SkeletonLoader.Container>
    </SkeletonLoader>
  );
};

export const UsernameSkeletonLayout = ({ style }: { style?: ViewStyle }) => {
  return (
    <SkeletonLoader duration={850}>
      <SkeletonLoader.Container style={[style]}>
        <SkeletonLoader.Item style={{ width: 100, height: 20 }} />
      </SkeletonLoader.Container>
    </SkeletonLoader>
  );
};
