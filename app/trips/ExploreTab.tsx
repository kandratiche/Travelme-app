import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LightScreen } from "@/components/ui/LightScreen";
import { GlassCardOnLight } from "@/components/ui/GlassCard";
import { SplitTitle } from "@/components/ui/SplitTitle";
import { BodyText, CaptionText } from "@/components/ui/ThemedText";
import { SAVED_TRIPS } from "../../constants/mockData"
import { AuthContext } from "@/context/authContext";
import { Button } from "react-native-paper";
import { useTranslation } from "react-i18next";

export const ExploreTab = () => {

    const { t } = useTranslation();
    const { user, loading } = React.useContext(AuthContext);

    return (
        SAVED_TRIPS.length === 0 ? (
            <GlassCardOnLight style={styles.emptyCard}>
              <Ionicons name="calendar-outline" size={48} color="#94A3B8" style={styles.emptyIcon} />
              <BodyText style={styles.emptyTitle}>{t("trips.noSavedTrips")}</BodyText>
              <CaptionText style={styles.emptySubtitle}>{t("trips.createFromHome")}</CaptionText>
              <TouchableOpacity onPress={() => router.push("/(tabs)")} style={styles.goHomeButton}>
                <Text style={styles.goHomeText}>{t("trips.goHome")}</Text>
              </TouchableOpacity>
            </GlassCardOnLight>
          ) : (
            <>
              <View style={styles.nextAdventureRow}>
                <CaptionText style={styles.nextAdventureText}>{t("trips.nextAdventure")}</CaptionText>
                <Text style={styles.nextAdventureDate}>{t("trips.inDays", { days: 2 })}</Text>
              </View>

              {SAVED_TRIPS.map((trip, idx) => (
                <TouchableOpacity
                  key={trip.id}
                  onPress={() => router.push("/timeline")}
                  activeOpacity={0.9}
                  style={styles.cardWrapper}
                >
                  <GlassCardOnLight style={styles.tripCard}>
                    <View style={styles.tripCardContent}>
                      <Image source={{ uri: trip.previewImageUrl }} style={styles.tripImage} resizeMode="cover" />
                      <View style={styles.bookedBadge}>
                        <View style={styles.bookedIndicator} />
                        <Text style={styles.bookedText}>BOOKED</Text>
                      </View>
                      <View style={styles.tripOverlay}>
                        <View style={styles.tripDateRow}>
                          <Ionicons name="calendar-outline" size={14} color="#FFF" style={styles.calendarIcon} />
                          <CaptionText style={styles.tripDateText}>Feb 6, 19:00</CaptionText>
                        </View>
                        <Text style={styles.tripTitle}>{idx === 0 ? "DATE NIGHT" : trip.title}</Text>
                        <Text style={styles.tripCity}>{trip.cityName}</Text>
                        <TouchableOpacity style={styles.forwardButton}>
                          <Ionicons name="arrow-forward" size={22} color="#0F172A" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </GlassCardOnLight>
                </TouchableOpacity>
              ))}
            </>
          )
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
});
