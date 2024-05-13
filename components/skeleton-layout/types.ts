import SkeletonLoader from "expo-skeleton-loader";

export type SkeletonType = Partial<
  Parameters<typeof SkeletonLoader>[number]
> & {
  isDark: boolean;
  size?: number;
};
