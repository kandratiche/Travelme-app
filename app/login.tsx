import { LightScreen } from "@/components/ui/LightScreen";
import { router } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
import { SplitTitle } from "@/components/ui/SplitTitle";
import { GlassCardOnLight } from "@/components/ui/GlassCard";
import { StyleSheet } from "react-native";

export default function UserRegister() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);

    const handleLogin = () => {
        console.log("Logging in");

    };

    return (
        <LightScreen>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity 
                        onPress={() => { router.push('/') }} 
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color="#0F172A" />
                    </TouchableOpacity>
                </View>

                <SplitTitle first="Sign " second="In" style={styles.title} />

                <View style={styles.screenContainer}>
                    <View style={styles.fieldContainer}>
                        <GlassCardOnLight
                            style={styles.glassCard}
                            contentStyle={styles.glassCardContent}
                        >
                            <TextInput
                                placeholder="Enter the email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                style={styles.input}
                                placeholderTextColor="#94A3B8"
                                returnKeyType="send"
                            />
                        </GlassCardOnLight>
                    </View>
                    <View style={styles.fieldContainer}>
                        <GlassCardOnLight
                            style={styles.glassCard}
                            contentStyle={styles.glassCardContent}
                        >
                            <TextInput
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                style={styles.input}
                                placeholderTextColor="#94A3B8"
                                returnKeyType="send"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons 
                                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                                    size={20} 
                                    color="#94A3B8" 
                                />
                            </TouchableOpacity>
                        </GlassCardOnLight>
                    </View>
                    <View style={styles.fieldContainer}>
                        <TouchableOpacity 
                            style={styles.button}
                            onPress={handleLogin} 
                        >
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </LightScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 0,
        paddingBottom: 12,
    },
    backButton: {
        top: 24,
        left: 24,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(241,245,249,0.95)",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginTop: 50,
        marginBottom: 20,
        marginLeft: 24,
    },
    glassCard: {
        borderRadius: 24,
        marginBottom: 20,
    },
    glassCardContent: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    input: {
        flex: 1,
        color: "#0F172A",
        fontSize: 16,
        paddingVertical: 4,
        ...(Platform.OS === 'web' && { outlineStyle: 'none' })
    },
    fieldContainer: {
        marginBottom: 8,
        width: 350,
    },
    screenContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 124,
    },
    button: {
        width: '100%',
        marginTop: 12,
        borderRadius: 24,
        backgroundColor: "#2DD4BF",
        paddingVertical: 16,
        paddingHorizontal: 16,
        alignItems: 'center',  
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    }
});