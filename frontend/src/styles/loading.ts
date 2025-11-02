// src/styles/loading.ts
import { StyleSheet } from "react-native";
import { colors, fontSizes, spacing } from "./theme";

export default StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xl * 2,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSizes.md,
    color: colors.gray,
  },
  uploadOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadModal: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    borderRadius: 15,
    alignItems: "center",
  },
  uploadText: {
    marginTop: spacing.md,
    fontSize: fontSizes.md,
    color: colors.black,
  },
});
