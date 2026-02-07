import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LightScreen } from "../../components/ui/LightScreen";
import { GlassCardOnLight } from "../../components/ui/GlassCard";
import { SafetyButton } from "../../components/SafetyButton";
import { BodyText, HeadingText, CaptionText } from "../../components/ui/ThemedText";
import { TRENDING_EXPERIENCES } from "../../constants/mockData";

const QUICK_ACTIONS = [
  { id: "date", label: "Date Night", icon: "heart" },
  { id: "budget", label: "Budget Eats", icon: "wallet" },
  { id: "views", label: "Best Views", icon: "eye" },
  { id: "culture", label: "Culture", icon: "book" },
  { id: "nature", label: "Nature", icon: "leaf" },
  { id: "local", label: "Local Vibes", icon: "people" },
];

export default function HomeScreen() {
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = () => {
    if (!input.trim() && !isThinking) return;
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      router.push("/timeline");
    }, 1500);
  };

  const handleQuickAction = () => {
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      router.push("/timeline");
    }, 1500);
  };

  return (
    <LightScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.9)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(0,0,0,0.06)" }}>
                <Ionicons name="person" size={24} color="#2DD4BF" />
              </View>
              <View style={{ marginLeft: 12 }}>
                <BodyText style={{ fontWeight: "600", color: "#0F172A" }}>Nomad</BodyText>
                <CaptionText style={{ color: "#10B981", fontSize: 13 }}>● Online</CaptionText>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.9)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: "rgba(0,0,0,0.06)" }}>
              <Ionicons name="location" size={14} color="#2DD4BF" style={{ marginRight: 4 }} />
              <CaptionText style={{ color: "#2DD4BF", fontSize: 13 }}>Almaty</CaptionText>
            </View>
          </View>

          <GlassCardOnLight
            style={{ borderRadius: 24, marginBottom: 20 }}
            contentStyle={{ flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16 }}
          >
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask for a plan..."
              placeholderTextColor="#94A3B8"
              style={{ flex: 1, minWidth: 0, color: "#0F172A", fontSize: 16, paddingVertical: 4 }}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              onPress={handleSend}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "#2DD4BF",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 12,
              }}
            >
              <Ionicons name="send" size={20} color="#FFF" />
            </TouchableOpacity>
          </GlassCardOnLight>


          <CaptionText style={{ marginBottom: 12, color: "#64748B" }}>Quick actions</CaptionText>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.id}
                onPress={handleQuickAction}
                activeOpacity={0.8}
              >
                <View style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.9)", borderWidth: 1, borderColor: "rgba(0,0,0,0.06)" }}>
                  <Ionicons name={action.icon as any} size={18} color="#2DD4BF" style={{ marginRight: 6 }} />
                  <Text style={{ color: "#475569", fontSize: 14, fontWeight: "500" }}>{action.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {isThinking && (
            <GlassCardOnLight style={{ borderRadius: 16, marginBottom: 24, flexDirection: "row", alignItems: "center", paddingVertical: 14 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#A78BFA", marginRight: 8, opacity: 0.8 }} />
              <ActivityIndicator size="small" color="#A78BFA" style={{ marginRight: 8 }} />
              <BodyText style={{ color: "#A78BFA" }}>AI is thinking...</BodyText>
            </GlassCardOnLight>
          )}

          <HeadingText style={{ marginBottom: 16, color: "#0F172A" }}>Trending</HeadingText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingRight: 24 }}>
            {TRENDING_EXPERIENCES.map((exp) => (
              <TouchableOpacity
                key={exp.id}
                onPress={() => router.push("/timeline")}
                activeOpacity={0.9}
                style={{ width: 180 }}
              >
                <GlassCardOnLight style={{ borderRadius: 20, overflow: "hidden", padding: 0 }}>
                  <View style={{ height: 120, borderRadius: 16, overflow: "hidden", position: "relative" }}>
                    <Image source={{ uri: exp.imageUrl }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                    <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 12, backgroundColor: "rgba(0,0,0,0.5)" }}>
                      <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 15 }} numberOfLines={2}>{exp.title}</Text>
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                        <Ionicons name="shield-checkmark" size={12} color="#10B981" />
                        <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 12, marginLeft: 4 }}>{exp.safetyScore}%</Text>
                      </View>
                    </View>
                  </View>
                </GlassCardOnLight>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      <SafetyButton variant="floating" />
    </LightScreen>
  );
}
