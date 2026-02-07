import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LightScreen } from "../../components/ui/LightScreen";
import { GlassCardOnLight } from "../../components/ui/GlassCard";
import { SplitTitle } from "../../components/ui/SplitTitle";
import { BodyText, CaptionText } from "../../components/ui/ThemedText";
import { SAVED_TRIPS } from "../../constants/mockData";

export default function TripsScreen() {
  return (
    <LightScreen>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 56, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <View>
            <CaptionText style={{ color: "#64748B", marginBottom: 2 }}>WELCOME BACK</CaptionText>
            <BodyText style={{ fontWeight: "700", fontSize: 18, color: "#0F172A" }}>Nomad Traveler</BodyText>
          </View>
          <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.9)", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="notifications-outline" size={22} color="#0F172A" />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", alignItems: "baseline", marginBottom: 20 }}>
          <SplitTitle first="MY " second="TRIPS" textStyle={{ fontSize: 28 }} />
          <TouchableOpacity style={{ marginLeft: "auto", width: 40, height: 40, borderRadius: 20, backgroundColor: "#0F172A", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", marginBottom: 20, backgroundColor: "#F1F5F9", borderRadius: 12, padding: 4 }}>
          <TouchableOpacity style={{ flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: "#0F172A" }}>
            <Text style={{ color: "#FFF", fontWeight: "600", textAlign: "center", fontSize: 14 }}>Upcoming</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, paddingVertical: 10, borderRadius: 10 }}>
            <Text style={{ color: "#64748B", fontWeight: "600", textAlign: "center", fontSize: 14 }}>Past</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, paddingVertical: 10, borderRadius: 10 }}>
            <Text style={{ color: "#64748B", fontWeight: "600", textAlign: "center", fontSize: 14 }}>Saved</Text>
          </TouchableOpacity>
        </View>

        {SAVED_TRIPS.length === 0 ? (
          <GlassCardOnLight style={{ borderRadius: 24, alignItems: "center", paddingVertical: 48 }}>
            <Ionicons name="calendar-outline" size={48} color="#94A3B8" style={{ marginBottom: 16 }} />
            <BodyText style={{ marginBottom: 8, textAlign: "center", color: "#0F172A" }}>No saved trips yet</BodyText>
            <CaptionText style={{ marginBottom: 20, textAlign: "center", color: "#64748B" }}>Create one from Home with the AI agent</CaptionText>
            <TouchableOpacity onPress={() => router.push("/(tabs)")} style={{ backgroundColor: "#2DD4BF", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16 }}>
              <Text style={{ color: "#FFF", fontWeight: "700" }}>Go to Home</Text>
            </TouchableOpacity>
          </GlassCardOnLight>
        ) : (
          <>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <CaptionText style={{ color: "#64748B" }}>NEXT ADVENTURE</CaptionText>
              <Text style={{ color: "#2DD4BF", fontWeight: "700", fontSize: 13 }}>IN 2 DAYS</Text>
            </View>
            {SAVED_TRIPS.map((trip, idx) => (
              <TouchableOpacity
                key={trip.id}
                onPress={() => router.push("/timeline")}
                activeOpacity={0.9}
                style={{ marginBottom: 20 }}
              >
                <GlassCardOnLight style={{ borderRadius: 24, overflow: "hidden", padding: 0 }}>
                  <View style={{ height: 180, position: "relative" }}>
                    <Image source={{ uri: trip.previewImageUrl }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                    <View style={{ position: "absolute", top: 12, right: 12, flexDirection: "row", alignItems: "center", backgroundColor: "#0F172A", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#2DD4BF", marginRight: 6 }} />
                      <Text style={{ color: "#FFF", fontWeight: "600", fontSize: 12 }}>BOOKED</Text>
                    </View>
                    <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 16, backgroundColor: "rgba(0,0,0,0.5)" }}>
                      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                        <Ionicons name="calendar-outline" size={14} color="#FFF" style={{ marginRight: 4 }} />
                        <CaptionText style={{ color: "rgba(255,255,255,0.95)" }}>Feb 6, 19:00</CaptionText>
                      </View>
                      <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 20 }}>{idx === 0 ? "DATE NIGHT" : trip.title}</Text>
                      <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 16 }}>{trip.cityName}</Text>
                      <TouchableOpacity style={{ position: "absolute", bottom: 16, right: 16, width: 44, height: 44, borderRadius: 22, backgroundColor: "#FFF", alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name="arrow-forward" size={22} color="#0F172A" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </GlassCardOnLight>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </LightScreen>
  );
}
