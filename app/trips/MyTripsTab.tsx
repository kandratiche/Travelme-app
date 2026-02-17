import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GlassCardOnLight } from "@/components/ui/GlassCard";
import { BodyText, CaptionText } from "@/components/ui/ThemedText";
import { AuthContext } from "@/context/authContext";
import { useTranslation } from "react-i18next";
import { Menu } from "react-native-paper";

export const MyTripsTab = () => {
    const { t } = useTranslation();
    const { user, loading } = React.useContext(AuthContext);
    const [period, setPeriod] = React.useState<'past' | 'future'>("past")
    const [menuVisible, setMenuVisible] = React.useState(false);

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    return (
      <View>
        <View style={{ width: "100%", marginBottom: 16 }}>
          <View style={styles.dropdownWrapper}>
            <Menu
              visible={menuVisible}
              onDismiss={closeMenu}
              anchorPosition="bottom"
              contentStyle={styles.menuContent}
              anchor={
                <TouchableOpacity
                  style={styles.dropdownTrigger}
                  onPress={openMenu}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dropdownText}>
                    {period === "past" ? "Past Trips" : "Future Trips"}
                  </Text>

                  <Ionicons
                    name={menuVisible ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#0F172A"
                  />
                </TouchableOpacity>
              }
            >
              <Menu.Item
                onPress={() => {
                  setPeriod("future");
                  closeMenu();
                }}
                title="Future Trips"
                titleStyle={styles.menuItemText}
              />

              <Menu.Item
                onPress={() => {
                  setPeriod("past");
                  closeMenu();
                }}
                title="Past Trips"
                titleStyle={styles.menuItemText}
              />
            </Menu>
          </View>




        </View>
        {period === "past" ? (
          user.trips_completed === 0 ? (
              <GlassCardOnLight style={styles.emptyCard}>
                  <Ionicons name="calendar-outline" size={48} color="#94A3B8" style={styles.emptyIcon} />
                  <BodyText style={styles.emptyTitle}>{t("trips.noPastTrips")}</BodyText>
                  <CaptionText style={styles.emptySubtitle}>{t("trips.createFromHome")}</CaptionText>
                  <TouchableOpacity onPress={() => router.push("/(tabs)")} style={styles.goHomeButton}>
                  <Text style={styles.goHomeText}>{t("trips.goHome")}</Text>
                  </TouchableOpacity>
              </GlassCardOnLight>
          ) : (
              <GlassCardOnLight style={styles.emptyCard}>
                  <Ionicons name="calendar-outline" size={48} color="#94A3B8" style={styles.emptyIcon} />
                  <BodyText style={styles.emptyTitle}>{t("trips.noPastTrips")}</BodyText>
                  <CaptionText style={styles.emptySubtitle}>{t("trips.createFromHome")}</CaptionText>
                  <TouchableOpacity onPress={() => router.push("/(tabs)")} style={styles.goHomeButton}>
                  <Text style={styles.goHomeText}>{t("trips.goHome")}</Text>
                  </TouchableOpacity>
              </GlassCardOnLight>
          )
        ) : (
          <Text>No future trips</Text>
        )}
      </View>
    )
}

const styles = StyleSheet.create({
  emptyCard: {
    borderRadius: 24,
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyIcon: {
    alignSelf: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: "center",
    color: "#0F172A",
  },
  emptySubtitle: {
    marginBottom: 20,
    textAlign: "center",
    color: "#64748B",
  },
  goHomeButton: {
    backgroundColor: "#2DD4BF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  goHomeText: {
    color: "#FFF",
    fontWeight: "700",
    textAlign: "center",
  },
  dropdownWrapper: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    minWidth: 160,
  },
  dropdownText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#0F172A",
  },
  menuContent: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    marginTop: 4,
    width: 160,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },

  activeMenuItemText: {
    color: "#0F172A",
    fontWeight: "700",
  },
});
