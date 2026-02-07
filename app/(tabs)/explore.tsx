import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LightScreen } from "../../components/ui/LightScreen";
import { GlassCardOnLight } from "../../components/ui/GlassCard";
import { SplitTitle } from "../../components/ui/SplitTitle";
import { BodyText, CaptionText } from "../../components/ui/ThemedText";
import { GUIDES, PLACES } from "../../constants/mockData";

const { width } = Dimensions.get("window");

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState<"guides" | "places">("guides");

  return (
    <LightScreen>
      <View style={{ paddingTop: 56, paddingHorizontal: 24, paddingBottom: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <SplitTitle first="EXPLORE " second="GUIDES" style={{ marginTop: 0 }} textStyle={{ fontSize: 24 }} />
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.9)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 }}>
            <Ionicons name="location" size={14} color="#2DD4BF" style={{ marginRight: 4 }} />
            <CaptionText style={{ color: "#475569", fontSize: 12 }}>ALMATY, KZ</CaptionText>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: 16, gap: 10 }}>
          <TouchableOpacity
            onPress={() => setActiveTab("guides")}
            style={{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: activeTab === "guides" ? "#0F172A" : "rgba(255,255,255,0.9)" }}
          >
            <Text style={{ color: activeTab === "guides" ? "#FFF" : "#64748B", fontWeight: "600", fontSize: 13 }}>ALL GUIDES</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("places")}
            style={{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.9)" }}
          >
            <Text style={{ color: "#64748B", fontWeight: "600", fontSize: 13 }}>PLACES</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        <View style={{ height: 180, backgroundColor: "#E2E8F0", borderRadius: 16, marginBottom: 20, overflow: "hidden", position: "relative" }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", padding: 8, gap: 6 }}>
            {[...Array(24)].map((_, i) => (
              <View key={i} style={{ width: (width - 48 - 48) / 6, height: 20, backgroundColor: "#CBD5E1", borderRadius: 4, opacity: 0.6 }} />
            ))}
          </View>
          <View style={{ position: "absolute", top: 30, left: 40, width: 10, height: 10, borderRadius: 5, backgroundColor: "#2DD4BF" }} />
          <View style={{ position: "absolute", top: 70, left: 100, width: 10, height: 10, borderRadius: 5, backgroundColor: "#FACC15" }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
          {activeTab === "guides" &&
            GUIDES.map((guide) => (
              <TouchableOpacity
                key={guide.id}
                onPress={() => router.push(`/guide/${guide.id}`)}
                activeOpacity={0.9}
                style={{ marginBottom: 16 }}
              >
                <GlassCardOnLight style={{ borderRadius: 20, overflow: "hidden", padding: 0 }}>
                  <View style={{ height: 200, position: "relative" }}>
                    <Image source={{ uri: guide.heroImageUrl }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                    <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 16, backgroundColor: "rgba(255,255,255,0.92)" }}>
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View>
                          <Text style={{ fontFamily: "Montserrat_700Bold", fontSize: 18, color: "#0F172A" }}>{guide.name.toUpperCase()}</Text>
                          <CaptionText style={{ color: "#64748B", marginTop: 2 }}>{guide.specialties[0]}</CaptionText>
                        </View>
                        <Text style={{ color: "#2DD4BF", fontWeight: "700", fontSize: 16 }}>{guide.pricePerHour.toLocaleString()}{guide.currency}/hr</Text>
                      </View>
                      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8, gap: 6 }}>
                        {guide.tags.slice(0, 3).map((tag) => (
                          <View key={tag} style={{ backgroundColor: "#F1F5F9", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                            <CaptionText style={{ color: "#475569", fontSize: 11 }}>{tag.toUpperCase()}</CaptionText>
                          </View>
                        ))}
                      </View>
                      <TouchableOpacity style={{ marginTop: 12, backgroundColor: "#2DD4BF", paddingVertical: 10, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: "#0F172A", fontWeight: "700", fontSize: 13 }}>CHAT / BOOK →</Text>
                      </TouchableOpacity>
                    </View>
                    {guide.verified && (
                      <View style={{ position: "absolute", top: 12, left: 12, flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.9)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 }}>
                        <Ionicons name="checkmark-circle" size={14} color="#2DD4BF" style={{ marginRight: 4 }} />
                        <Text style={{ fontSize: 11, fontWeight: "600", color: "#0F172A" }}>VERIFIED</Text>
                      </View>
                    )}
                    <View style={{ position: "absolute", top: 12, right: 12, flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.9)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 }}>
                      <Ionicons name="star" size={14} color="#FACC15" />
                      <Text style={{ fontSize: 12, fontWeight: "600", color: "#0F172A", marginLeft: 4 }}>{guide.rating}</Text>
                    </View>
                  </View>
                </GlassCardOnLight>
              </TouchableOpacity>
            ))}

          {activeTab === "places" &&
            PLACES.map((place) => (
              <TouchableOpacity key={place.id} activeOpacity={0.9} style={{ marginBottom: 16 }}>
                <GlassCardOnLight style={{ borderRadius: 20, overflow: "hidden", padding: 0 }}>
                  <View style={{ height: 140, flexDirection: "row" }}>
                    <Image source={{ uri: place.imageUrl }} style={{ width: 140, height: 140 }} resizeMode="cover" />
                    <View style={{ flex: 1, padding: 12, justifyContent: "space-between" }}>
                      <BodyText style={{ fontWeight: "700", fontSize: 16, color: "#0F172A" }}>{place.name}</BodyText>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="shield-checkmark" size={14} color="#10B981" />
                        <CaptionText style={{ marginLeft: 4, color: "#64748B" }}>{place.safetyScore}% safe</CaptionText>
                      </View>
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
                        {place.tags.slice(0, 2).map((tag) => (
                          <CaptionText key={tag} style={{ color: "#64748B", fontSize: 11 }}>#{tag}</CaptionText>
                        ))}
                      </View>
                    </View>
                  </View>
                </GlassCardOnLight>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    </LightScreen>
  );
}
