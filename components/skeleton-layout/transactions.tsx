import SkeletonLoader from "expo-skeleton-loader";
import { ViewStyle } from "react-native";

const TransactionSkeletonLayout = ({
  size = 48,
  style,
}: {
  size?: number;
  style?: ViewStyle;
}) => (
  <SkeletonLoader duration={850}>
    <SkeletonLoader.Container
      style={[{ flex: 1, flexDirection: "row", alignItems: "center" }, style]}
    >
      <SkeletonLoader.Container
        style={[{ flex: 1, flexDirection: "row", alignItems: "center" }, style]}
      >
        <SkeletonLoader.Item
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            marginRight: 16,
          }}
        />
        <SkeletonLoader.Container style={{ paddingVertical: 10 }}>
          <SkeletonLoader.Item
            style={{ width: 100, height: 20, marginBottom: 5 }}
          />
          <SkeletonLoader.Item style={{ width: 110, height: 20 }} />
        </SkeletonLoader.Container>
      </SkeletonLoader.Container>

      <SkeletonLoader.Item style={{ width: 70, height: 20 }} />
    </SkeletonLoader.Container>
  </SkeletonLoader>
);

export default TransactionSkeletonLayout;
