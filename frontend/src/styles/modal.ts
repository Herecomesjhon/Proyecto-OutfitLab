// src/styles/modal.ts
import { StyleSheet } from "react-native";
import { colors, fontSizes, spacing, borderRadius, fontWeights } from "./theme";

export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: fontSizes.lg,
    fontWeight: "bold",
    color: colors.black,
  },
  sectionTitle: {
    fontSize: fontSizes.md,
    fontWeight: "600",
    color: colors.black,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  typeButton: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  typeButtonSelected: {
    backgroundColor: colors.primary,
  },
  typeText: {
    marginLeft: spacing.sm,
    fontSize: fontSizes.sm,
    color: colors.gray,
  },
  typeTextSelected: {
    color: colors.white,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  colorButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  colorButtonSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontWeight: "600",
  },
});
