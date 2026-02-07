import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LightScreen } from "../../components/ui/LightScreen";
import { GlassCardOnLight } from "../../components/ui/GlassCard";
import { BodyText, CaptionText } from "../../components/ui/ThemedText";

const SETTINGS_ITEMS = [
  { id: "trips", label: "My Trips", sublabel: "View travel history", icon: "airplane-outline" },
  { id: "interests", label: "Edit Interests", sublabel: "Personalize AI", icon: "sparkles-outline" },
  { id: "sos", label: "SOS Settings", sublabel: "Emergency contacts & alerts", icon: "location-outline", highlight: true, hasDot: true },
  { id: "language", label: "App Language", sublabel: "English (US)", icon: "language-outline" },
];

export default function ProfileScreen() {
  return (
    <LightScreen>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 56, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ position: "absolute", top: 56, right: 24, zIndex: 10, alignItems: "flex-end" }}>
          <Text style={{ fontSize: 12, color: "#64748B", fontWeight: "600" }}>XP TO LEVEL 4</Text>
          <View style={{ width: 100, height: 6, backgroundColor: "#E2E8F0", borderRadius: 3, marginTop: 4, overflow: "hidden" }}>
            <View style={{ width: "65%", height: "100%", backgroundColor: "#2DD4BF", borderRadius: 3 }} />
          </View>
        </View>

        <View style={{ alignItems: "center", marginBottom: 28, marginTop: 8 }}>
          <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: "rgba(255,255,255,0.9)", alignItems: "center", justifyContent: "center", marginBottom: 12, borderWidth: 3, borderColor: "rgba(45, 212, 191, 0.5)" }}>
            <Ionicons name="person" size={44} color="#2DD4BF" />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontFamily: "Montserrat_700Bold", fontSize: 20, color: "#0F172A", marginRight: 6 }}>ALEX</Text>
            <Text style={{ fontFamily: "Montserrat_700Bold", fontSize: 20, color: "#64748B" }}>NOMAD</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, backgroundColor: "rgba(250, 204, 21, 0.25)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>
            <Ionicons name="flash-outline" size={14} color="#B45309" style={{ marginRight: 4 }} />
            <Text style={{ color: "#B45309", fontWeight: "700", fontSize: 13 }}>LEVEL 3 NOMAD</Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 20, gap: 24 }}>
            <GlassCardOnLight style={{ flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: "center" }}>
              <Text style={{ fontFamily: "Montserrat_700Bold", fontSize: 22, color: "#0F172A" }}>150</Text>
              <CaptionText style={{ color: "#64748B", marginTop: 2 }}>TOURS COMPLETED</CaptionText>
            </GlassCardOnLight>
            <GlassCardOnLight style={{ flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: "center" }}>
              <Text style={{ fontFamily: "Montserrat_700Bold", fontSize: 22, color: "#0F172A" }}>5</Text>
              <Text style={{ fontSize: 14, color: "#2DD4BF", fontWeight: "600" }}>Yrs</Text>
              <CaptionText style={{ color: "#64748B", marginTop: 2 }}>EXPERIENCE</CaptionText>
            </GlassCardOnLight>
          </View>
        </View>

        <GlassCardOnLight style={{ borderRadius: 20, padding: 0, overflow: "hidden" }}>
          {SETTINGS_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
                borderBottomWidth: index < SETTINGS_ITEMS.length - 1 ? 1 : 0,
                borderBottomColor: "rgba(0,0,0,0.06)",
                borderWidth: item.highlight ? 1 : 0,
                borderColor: "#F59E0B",
                borderRadius: item.highlight ? 12 : 0,
                margin: item.highlight ? 8 : 0,
                marginBottom: item.highlight ? 0 : undefined,
              }}
            >
              <Ionicons name={item.icon as any} size={22} color={item.highlight ? "#F59E0B" : "#64748B"} style={{ marginRight: 14 }} />
              <View style={{ flex: 1 }}>
                <BodyText style={{ color: "#0F172A", fontWeight: "600" }}>{item.label}</BodyText>
                <CaptionText style={{ color: "#64748B", marginTop: 2, fontSize: 12 }}>{item.sublabel}</CaptionText>
              </View>
              {item.hasDot && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#EF4444", marginRight: 8 }} />}
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </GlassCardOnLight>

        <TouchableOpacity
          onPress={() => router.replace("/")}
          style={{ marginTop: 24, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 16, backgroundColor: "rgba(239, 68, 68, 0.12)" }}
        >
          <Ionicons name="log-out-outline" size={22} color="#EF4444" style={{ marginRight: 8 }} />
          <Text style={{ color: "#EF4444", fontWeight: "600", fontSize: 16 }}>Sign Out</Text>
        </TouchableOpacity>

        <CaptionText style={{ textAlign: "center", marginTop: 24, color: "#94A3B8" }}>NOMAD AI V2.4.0</CaptionText>
      </ScrollView>
    </LightScreen>
  );
}
