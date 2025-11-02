// src/styles/profile.ts
import { StyleSheet } from "react-native";
import { colors, fontSizes, spacing, borderRadius, fontWeights } from "./theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: spacing.md,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e9ecef",
    justifyContent: "center",
    alignItems: "center",
  },
  editImageButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.white,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statBorder: {
    borderLeftWidth: 1,
    borderLeftColor: "#eee",
  },
  statNumber: {
    fontSize: fontSizes.lg,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  statLabel: {
    fontSize: fontSizes.sm,
    color: colors.gray,
  },
  menuContainer: {
    backgroundColor: colors.white,
    marginTop: spacing.lg,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    marginLeft: spacing.md,
    fontSize: fontSizes.md,
    color: colors.black,
  },
});
