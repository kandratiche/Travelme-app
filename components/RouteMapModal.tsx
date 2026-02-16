import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { TimelineStop } from "@/types";

interface Props {
  visible: boolean;
  stops: TimelineStop[];
  onClose: () => void;
}

const COLORS = ["#A78BFA", "#2DD4BF", "#F59E0B", "#EF4444", "#3B82F6", "#EC4899", "#10B981", "#8B5CF6"];

function buildLeafletHTML(stops: TimelineStop[]): string {
  const validStops = stops.filter((s) => s.latitude && s.longitude);
  if (validStops.length === 0) {
    return `<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#64748B">
      <p>Нет координат для отображения маршрута</p></body></html>`;
  }

  const center = {
    lat: validStops.reduce((s, p) => s + (p.latitude || 0), 0) / validStops.length,
    lng: validStops.reduce((s, p) => s + (p.longitude || 0), 0) / validStops.length,
  };

  const markersJS = validStops
    .map((stop, i) => {
      const color = COLORS[i % COLORS.length];
      const walkInfo = stop.walkingTime ? `<br/><small>${stop.walkingTime}</small>` : "";
      const priceInfo = stop.priceLevel ? `<br/><small>${"₸".repeat(stop.priceLevel)}</small>` : "";
      return `
        L.circleMarker([${stop.latitude}, ${stop.longitude}], {
          radius: 14, fillColor: '${color}', color: '#fff', weight: 3, fillOpacity: 1
        }).addTo(map)
          .bindPopup('<b>${(i + 1)}. ${stop.title.replace(/'/g, "\\'")}</b>${stop.time ? "<br/>" + stop.time : ""}${walkInfo}${priceInfo}');
        L.marker([${stop.latitude}, ${stop.longitude}], {
          icon: L.divIcon({
            className: 'num-icon',
            html: '<div style="color:#fff;font-weight:800;font-size:12px;text-align:center;line-height:28px">${i + 1}</div>',
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          })
        }).addTo(map);`;
    })
    .join("\n");

  const coords = validStops.map((s) => `[${s.latitude}, ${s.longitude}]`).join(",");
  const bounds = validStops.map((s) => `[${s.latitude}, ${s.longitude}]`).join(",");

  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{height:100%;width:100%}
    #map{height:100%;width:100%}
    .num-icon{background:transparent!important;border:none!important}
    .leaflet-popup-content-wrapper{border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.15)}
    .leaflet-popup-content{margin:12px 16px;font-family:-apple-system,sans-serif;font-size:13px;line-height:1.5}
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map',{zoomControl:false});
    L.control.zoom({position:'bottomright'}).addTo(map);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{
      attribution:'OpenStreetMap',maxZoom:19
    }).addTo(map);

    ${markersJS}

    var route = L.polyline([${coords}],{
      color:'#A78BFA',weight:4,opacity:0.8,
      dashArray:'8,12',lineCap:'round'
    }).addTo(map);

    map.fitBounds([${bounds}],{padding:[50,50]});
  </script>
</body>
</html>`;
}

export default function RouteMapModal({ visible, stops, onClose }: Props) {
  const html = useMemo(() => buildLeafletHTML(stops), [stops]);

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Маршрут</Text>
          <View style={styles.headerRight}>
            <Text style={styles.stopsCount}>{stops.length} мест</Text>
          </View>
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          {Platform.OS === "web" ? (
            <iframe
              srcDoc={html}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="Route Map"
            />
          ) : (
            <View style={styles.fallback}>
              <Ionicons name="map-outline" size={48} color="#A78BFA" />
              <Text style={styles.fallbackText}>Карта доступна в веб-версии</Text>
            </View>
          )}
        </View>

        {/* Bottom legend */}
        <View style={styles.legend}>
          {stops.filter(s => s.latitude && s.longitude).map((stop, i) => (
            <View key={stop.id} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS[i % COLORS.length] }]}>
                <Text style={styles.legendDotText}>{i + 1}</Text>
              </View>
              <View style={styles.legendInfo}>
                <Text style={styles.legendTitle} numberOfLines={1}>{stop.title}</Text>
                {stop.walkingTime && i > 0 ? (
                  <Text style={styles.legendSub}>{stop.walkingTime}</Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "web" ? 16 : 56,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  headerRight: {
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stopsCount: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7C3AED",
  },
  mapContainer: {
    flex: 1,
  },
  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  fallbackText: {
    fontSize: 15,
    color: "#64748B",
  },
  legend: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    maxHeight: 180,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  legendDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  legendDotText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 12,
  },
  legendInfo: {
    flex: 1,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  legendSub: {
    fontSize: 12,
    color: "#94A3B8",
  },
});
