// src/styles/categoryBar.ts
import { StyleSheet } from "react-native";
import { colors, spacing, borderRadius, fontSizes, fontWeights } from "./theme";

export default StyleSheet.create({
  categoriesContainer: {
    backgroundColor: colors.white,
    paddingVertical: spacing.lg,
    paddingLeft: spacing.lg,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.lightGray,
    marginRight: spacing.md,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    marginLeft: spacing.sm,
    fontSize: fontSizes.sm,
    color: colors.gray,
  },
  categoryTextActive: {
    color: colors.white,
  },
});
