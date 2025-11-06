import { Slot } from "expo-router";
import { AuthProvider } from "../src/contexts/auth";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
