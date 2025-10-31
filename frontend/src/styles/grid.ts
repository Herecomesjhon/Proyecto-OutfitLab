// src/styles/grid.ts
import { StyleSheet } from "react-native";
import { colors, spacing, borderRadius, fontSizes } from "./theme";

export default StyleSheet.create({
  clothesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  clothingItem: {
    width: "48%",
    aspectRatio: 1,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  clothingImage: {
    width: "100%",
    height: "100%",
  },
});
