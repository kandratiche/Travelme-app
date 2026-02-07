import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CITIES } from "../constants/mockData";
import { LightScreen } from "../components/ui/LightScreen";
import { GlassCardOnLight } from "../components/ui/GlassCard";
import { SplitTitle } from "../components/ui/SplitTitle";
import { CaptionText } from "../components/ui/ThemedText";

const CITY_SUBTITLES: Record<string, string> = {
  astana: "Futuristic City",
  almaty: "Mountains",
  aktau: "Seaside",
};

export default function CitySelectScreen() {
  const [selectedId, setSelectedId] = useState<string | null>("almaty");

  const handleContinue = () => {
    router.replace("/vibe-check");
  };

  return (
    <LightScreen>
      <View style={{ paddingHorizontal: 24, paddingTop: 56, flex: 1 }}>
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", position: "absolute", top: 0, left: 0, right: 0 }}>
          <TouchableOpacity 
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.push('/');
              }
            }} 
            style={{ top: 56, left: 24, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(241,245,249,0.95)", alignItems: "center", justifyContent: "center" }}
          >
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <View style={{ top: 56, right: 24, zIndex: 10, flexDirection: "row", gap: 6 }}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: i === 1 ? "#2DD4BF" : "#E2E8F0" }} />
            ))}
          </View>
        </View>

        <SplitTitle first="Where do we " second="start?" style={{ marginTop: 50, marginBottom: 20 }} />

        <TouchableOpacity
          onPress={handleContinue} 
          style={{
            alignSelf: "center",
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: "#2DD4BF",
            backgroundColor: "#FFF",
            marginBottom: 24,
          }}
        >
          <Ionicons name="compass-outline" size={20} color="#2DD4BF" style={{ marginRight: 8 }} />
          <Text style={{ color: "#475569", fontWeight: "600", fontSize: 15 }}>LOCATE ME</Text>
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {CITIES.map((city) => {
            const isSelected = selectedId === city.id;
            return (
              <TouchableOpacity
                key={city.id}
                onPress={() => setSelectedId(city.id)}
                activeOpacity={0.9}
                style={{ marginBottom: 16 }}
              >
                <GlassCardOnLight
                  style={{
                    borderRadius: 20,
                    overflow: "hidden",
                    padding: 0,
                    borderWidth: isSelected ? 2 : 0,
                    borderColor: "#2DD4BF",
                  }}
                >
                  <View style={{ height: 140, position: "relative" }}>
                    <Image source={{ uri: city.imageUrl }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                    <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 16, backgroundColor: "rgba(0,0,0,0.35)" }}>
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View>
                          <Text style={{ color: "#FFF", fontSize: 22, fontWeight: "700" }}>{city.name}</Text>
                          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: isSelected ? "#FACC15" : "#2DD4BF", marginRight: 6 }} />
                            <CaptionText style={{ color: "rgba(255,255,255,0.95)", fontSize: 13 }}>{CITY_SUBTITLES[city.id] || city.country}</CaptionText>
                          </View>
                        </View>
                        {isSelected && (
                          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: "#2DD4BF", alignItems: "center", justifyContent: "center" }}>
                            <Ionicons name="checkmark" size={18} color="#FFF" />
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </GlassCardOnLight>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          onPress={handleContinue}
          style={{
            position: "absolute",
            bottom: 40,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: "#0F172A",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="arrow-forward" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </LightScreen>
  );
}
