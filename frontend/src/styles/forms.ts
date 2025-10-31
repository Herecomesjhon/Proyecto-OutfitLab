// src/styles/forms.ts
import { StyleSheet } from "react-native";
import { colors, fontSizes, borderRadius, spacing, fontWeights } from "./theme";

export default StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: "#f9f9f9",
  },
  inputIcon: { marginRight: spacing.sm },
  input: { flex: 1, paddingVertical: spacing.md, fontSize: fontSizes.md, color: colors.black },
  eyeIcon: { padding: spacing.xs },
  forgotPassword: { alignSelf: "flex-end", marginBottom: spacing.lg },
  forgotPasswordText: { color: colors.primary, fontSize: fontSizes.sm },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  buttonText: { color: colors.white, fontSize: fontSizes.md, fontWeight: "600" },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm + 4,
  },
  googleButton: { backgroundColor: "#F5E5E5" },
  facebookButton: { backgroundColor: "#E6ECF7" },
  socialButtonText: { marginLeft: spacing.sm, fontSize: fontSizes.md, fontWeight: "500", color: colors.black },
});
