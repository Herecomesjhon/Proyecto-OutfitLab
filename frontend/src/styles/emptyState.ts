// src/styles/emptyState.ts
import { StyleSheet } from "react-native";
import { colors, fontSizes, spacing, borderRadius, fontWeights } from "./theme";

export default StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xl * 2,
  },
  emptyStateTitle: {
    fontSize: fontSizes.lg,
  fontWeight: "bold",
    color: colors.black,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  emptyStateText: {
    fontSize: fontSizes.md,
    color: colors.gray,
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    minWidth: 150,
    alignItems: "center",
  },
  addButtonText: {
    color: colors.white,
    fontSize: fontSizes.md,
  fontWeight: "600",
  },
});
