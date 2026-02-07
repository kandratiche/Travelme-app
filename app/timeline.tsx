import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LightScreen } from "../components/ui/LightScreen";
import { GlassCardOnLight } from "../components/ui/GlassCard";
import { BodyText, CaptionText } from "../components/ui/ThemedText";
import { ALMATY_ITINERARY } from "../constants/mockData";

const safetyColor = (level: string) => {
  switch (level) {
    case "safe": return "#10B981";
    case "warning": return "#F59E0B";
    case "danger": return "#EF4444";
    default: return "#10B981";
  }
};

export default function TimelineScreen() {
  const itinerary = ALMATY_ITINERARY;
  const guideWhatsApp = "77001234567";

  const openWhatsApp = () => {
    const message = encodeURIComponent(`Hi! I'd like to book the "${itinerary.title}" experience.`);
    Linking.openURL(`https://wa.me/${guideWhatsApp}?text=${message}`);
  };

  return (
    <LightScreen>
      <View style={{ paddingTop: 56, paddingHorizontal: 24, paddingBottom: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.9)", alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(167, 139, 250, 0.2)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#A78BFA", marginRight: 6 }} />
          <CaptionText style={{ color: "#6D28D9", fontWeight: "600", fontSize: 12 }}>ANALYZING SAFETY...</CaptionText>
        </View>
        <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.9)", alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="ellipsis-vertical" size={20} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontFamily: "Montserrat_700Bold", fontSize: 28, color: "#0F172A", marginBottom: 0 }}>Your Night</Text>
        <View style={{ flexDirection: "row", alignItems: "baseline", marginBottom: 16 }}>
          <Text style={{ fontFamily: "Montserrat_700Bold", fontSize: 28, color: "#0F172A" }}>in </Text>
          <Text style={{ fontFamily: "Montserrat_700Bold", fontSize: 28, color: "#2DD4BF" }}>Almaty</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 28 }}>
          <GlassCardOnLight style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="shield-checkmark" size={18} color="#10B981" style={{ marginRight: 6 }} />
            <CaptionText style={{ color: "#64748B", fontSize: 12 }}>{itinerary.totalSafetyScore}% safe</CaptionText>
          </GlassCardOnLight>
          <GlassCardOnLight style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="time-outline" size={18} color="#2DD4BF" style={{ marginRight: 6 }} />
            <CaptionText style={{ color: "#64748B", fontSize: 12 }}>{itinerary.totalDuration}</CaptionText>
          </GlassCardOnLight>
          <GlassCardOnLight style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="wallet-outline" size={18} color="#FACC15" style={{ marginRight: 6 }} />
            <CaptionText style={{ color: "#64748B", fontSize: 11 }} numberOfLines={1}>{itinerary.estimatedCost}</CaptionText>
          </GlassCardOnLight>
        </View>

        <View style={{ marginLeft: 12 }}>
          {itinerary.stops.map((stop, index) => (
            <View key={stop.id} style={{ flexDirection: "row", marginBottom: index < itinerary.stops.length - 1 ? 0 : 8 }}>
              <View style={{ alignItems: "center", width: 32 }}>
                <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: safetyColor(stop.safetyLevel), borderWidth: 3, borderColor: "#F8FAFC" }} />
                {index < itinerary.stops.length - 1 && (
                  <View style={{ width: 2, flex: 1, backgroundColor: "#A78BFA", marginVertical: 4, minHeight: 40, opacity: 0.5 }} />
                )}
              </View>
              <View style={{ flex: 1, marginLeft: 16, paddingBottom: 24 }}>
                <GlassCardOnLight style={{ borderRadius: 20, overflow: "hidden", padding: 0 }}>
                  <View style={{ padding: 14 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <Text style={{ fontFamily: "Montserrat_700Bold", fontSize: 18, color: "#0F172A" }}>{stop.time}</Text>
                      <View style={{ backgroundColor: "#10B981", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                        <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 10 }}>SAFE ZONE</Text>
                      </View>
                    </View>
                    <BodyText style={{ fontWeight: "700", fontSize: 16, color: "#0F172A", marginBottom: 4 }}>{stop.title}</BodyText>
                    <CaptionText style={{ color: "#64748B", marginBottom: 10 }}>{stop.title.includes("Meeting") ? "Meeting point near Hachiko statue. Crowded but highly monitored." : "Next stop on your route."}</CaptionText>
                    <View style={{ height: 100, borderRadius: 12, overflow: "hidden" }}>
                      <Image source={{ uri: stop.imageUrl }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                      <View style={{ position: "absolute", bottom: 8, left: 8, flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                        <Ionicons name="eye-outline" size={12} color="#FFF" style={{ marginRight: 4 }} />
                        <Text style={{ color: "#FFF", fontSize: 11 }}>High Visibility</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                      <Ionicons name="walk-outline" size={14} color="#64748B" style={{ marginRight: 4 }} />
                      <CaptionText style={{ color: "#64748B" }}>WALK: 15 MIN • FLAT TERRAIN</CaptionText>
                    </View>
                  </View>
                </GlassCardOnLight>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={openWhatsApp}
          style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#2DD4BF", paddingVertical: 16, borderRadius: 20, marginTop: 16 }}
        >
          <Text style={{ color: "#0F172A", fontWeight: "700", fontSize: 16, marginRight: 8 }}>Book everything</Text>
          <Ionicons name="arrow-forward" size={20} color="#0F172A" />
        </TouchableOpacity>
      </ScrollView>
    </LightScreen>
  );
}
