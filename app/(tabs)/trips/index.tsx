import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LightScreen } from "@/components/ui/LightScreen";
import { SplitTitle } from "@/components/ui/SplitTitle";
import { BodyText, CaptionText } from "@/components/ui/ThemedText";
import { AuthContext } from "@/context/authContext";
import { Button } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { ExploreTab } from "@/app/trips/ExploreTab";
import { MyTripsTab } from "@/app/trips/MyTripsTab";

export default function TripsScreen() {
  const { t } = useTranslation();
  const { user, loading } = React.useContext(AuthContext);
  const [activeTab, setActiveTab] = React.useState<'explore' | 'my trips'>('explore');
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);

  React.useEffect(() => {
    if (!loading && !user) router.replace("/");
  }, [loading, user]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "explore": 
        return (
          <ExploreTab/>
        )
      case "my trips": 
        return (
          <MyTripsTab/>
        )
    }
  }
    

  return (
    <LightScreen>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <CaptionText style={styles.welcomeText}>{t("trips.welcomeBack")}</CaptionText>
            <BodyText style={styles.userName}>{user?.name || "Guest"}</BodyText>
          </View>

          <TouchableOpacity 
            style={[
              styles.notificationButton,
              notificationsEnabled && styles.notificationButtonActive
            ]}
            onPress={() => setNotificationsEnabled(!notificationsEnabled)}
          >
            <Ionicons 
              name={notificationsEnabled ? "notifications" : "notifications-outline"} 
              size={22} 
              color={notificationsEnabled ? "#2DD4BF" : "#0F172A"} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.titleRow}>
          <SplitTitle first={t("trips.my")} second={t("trips.saved")} textStyle={styles.titleText} />
        </View>
        <View style={styles.tabRow}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'explore' && styles.activeTab]}
            onPress={() => setActiveTab('explore')}
          >
            <Text style={[styles.tabText, activeTab === 'explore' && styles.activeTabText]}>
              {t("trips.explore")}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'my trips' && styles.activeTab]}
            onPress={() => setActiveTab('my trips')}
          >
            <Text style={[styles.tabText, activeTab === 'my trips' && styles.activeTabText]}>
              {t("trips.myTrips")}
            </Text>
          </TouchableOpacity>
        </View>
        {renderTabContent()}
      </ScrollView>

      {!user && (
        <View style={styles.guestContainer}>
          <View style={styles.guestContent}>
            <CaptionText style={styles.guestText}>{t("trips.guestMessage")}</CaptionText>
            <Button style={styles.guestButton} labelStyle={styles.guestButtonText} onPress={() => router.push("/")}>
              {t("trips.logIn")}
            </Button>
          </View>
        </View>
      )}
    </LightScreen>
  );
}


const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    justifyContent: "space-between",
    marginBottom: 4,
  },
  welcomeText: {
    color: "#64748B",
    marginBottom: 2,
  },
  userName: {
    fontWeight: "700",
    fontSize: 18,
    color: "#0F172A",
  },
  notificationButton: {
    marginLeft: "auto",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationButtonActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2DD4BF',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 20,
  },
  titleText: {
    fontSize: 28,
  },
  tabRow: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  tabText: {
    color: "#64748B",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  activeTab: {
    backgroundColor: "#0F172A",
  },
  activeTabText: {
    color: "#FFF",
  },
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
  nextAdventureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  nextAdventureText: {
    color: "#64748B",
  },
  nextAdventureDate: {
    color: "#2DD4BF",
    fontWeight: "700",
    fontSize: 13,
  },
  cardWrapper: {
    marginBottom: 20,
  },
  tripCard: {
    borderRadius: 24,
    overflow: "hidden",
    padding: 0,
  },
  tripCardContent: {
    height: 180,
    position: "relative",
  },
  tripImage: {
    width: "100%",
    height: "100%",
  },
  bookedBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bookedIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2DD4BF",
    marginRight: 6,
  },
  bookedText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 12,
  },
  tripOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  tripDateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  calendarIcon: {
    marginRight: 4,
  },
  tripDateText: {
    color: "rgba(255,255,255,0.95)",
  },
  tripTitle: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 20,
  },
  tripCity: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
  },
  forwardButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  guestContainer: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 20,
    marginTop: 16,
  },
  guestContent: {
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    gap: 10,
  },
  guestText: {
    color: "#0F172A",
    fontWeight: "600",
  },
  guestButton: {
    width: "100%",
    backgroundColor: "#2DD4BF",
  },
  guestButtonText: {
    color: "#0F172A",
    fontWeight: "600",
  },
});
