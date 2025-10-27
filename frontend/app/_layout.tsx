import { Slot, useRouter, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const inTabs = pathname.startsWith("/(tabs)");

        if (!token && inTabs) {
          router.replace("/login");
        } else if (token && !inTabs) {
          router.replace("../(tabs)"); // o "/(tabs)/principal"
        }
      } finally {
        setChecking(false);
      }
    };
    check();
  }, [pathname]);

  if (checking) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  return <Slot />;
}
