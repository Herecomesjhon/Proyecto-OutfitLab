// src/styles/layout.ts
import { StyleSheet } from "react-native";
import { colors, spacing, borderRadius, fontSizes, fontWeights } from "./theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl * 2,
    paddingBottom: spacing.lg,
    backgroundColor: colors.white,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightGray,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  searchPlaceholder: {
    marginLeft: spacing.sm,
    color: colors.gray,
    fontSize: fontSizes.md,
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: borderRadius.sm,
  },
});
