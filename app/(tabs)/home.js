// app/(tabs)/home.js
// Trace home: cascading favorite "stamp" photos on top, month calendar below.
// Days that have memories show the photo in the cell. Tapping a day lists
// that day's memories. Tapping a memory reveals full details, plus all photos
// from that date and that place.
import { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import { MOCK_MEMORIES } from "@/constants/mockData";

const BUCKET = "memories"; // change if your storage bucket has a different name

const COLORS = {
  bg: "#0B0B0C",
  grid: "#1E1E21",
  cell: "#111113",
  card: "#18181B",
  text: "#F2F2F3",
  muted: "#7C7C82",
  accent: "#FF9F0A",
  chip: "#2A2A2E",
  favorite: "#EF4444",
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

// Position of each stamp in the diagonal cascade
const STAMP_LAYOUT = [
  { left: 0.03, top: 175, rot: -7, size: 92 },
  { left: 0.15, top: 128, rot: 5, size: 96 },
  { left: 0.3, top: 86, rot: -4, size: 100 },
  { left: 0.44, top: 50, rot: 6, size: 100 },
  { left: 0.58, top: 20, rot: -3, size: 100 },
  { left: 0.7, top: 0, rot: 4, size: 92 },
];

const dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const formatTime = (d) =>
  d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
const formatDate = (d) =>
  d.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short", year: "numeric" });

function Stamp({ uri, size, style, isFavorite }) {
  return (
    <View style={[styles.stamp, { width: size, height: size * 1.15 }, style]}>
      <Image source={{ uri }} style={styles.stampImg} />
      {isFavorite && (
        <View style={styles.favoriteBadge}>
          <Ionicons name="heart" size={10} color="#FFFFFF" />
        </View>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cellW = width / 7;

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedKey, setSelectedKey] = useState(null);
  const [activeMemory, setActiveMemory] = useState(null);
  const [memories, setMemories] = useState([]);

  // Load memories + signed URLs
  const load = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("memories")
        .select("id, image_path, caption, place_name, taken_at, created_at, is_favorite, description")
        .order("taken_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const paths = data.map((m) => m.image_path).filter(Boolean);
        let urlByPath = {};
        if (paths.length) {
          const { data: signed } = await supabase.storage
            .from(BUCKET)
            .createSignedUrls(paths, 3600);
          (signed || []).forEach((s) => {
            if (s.path && s.signedUrl) urlByPath[s.path] = s.signedUrl;
          });
        }

        setMemories(
          data.map((m) => ({
            ...m,
            uri: urlByPath[m.image_path] || m.image_url,
            date: new Date(m.taken_at || m.created_at),
            is_favorite: m.is_favorite ?? false,
          }))
        );
        return;
      }
    } catch {
      // Fallback to sample memories
    }

    // Default to mock memories
    setMemories(
      MOCK_MEMORIES.map((m) => ({
        ...m,
        uri: m.image_url,
        date: new Date(m.taken_at || m.created_at),
        caption: m.title,
        is_favorite: m.is_favorite ?? false,
      }))
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  // Toggle favorite status on a memory
  const toggleFavorite = (id) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_favorite: !m.is_favorite } : m))
    );
    if (activeMemory && activeMemory.id === id) {
      setActiveMemory((prev) => ({ ...prev, is_favorite: !prev.is_favorite }));
    }
    // Also sync to Supabase if available
    supabase.from("memories").update({ is_favorite: !activeMemory?.is_favorite }).eq("id", id).then();
  };

  // Group memories by calendar day
  const byDay = useMemo(() => {
    const map = {};
    memories.forEach((m) => {
      const k = dayKey(m.date);
      (map[k] = map[k] || []).push(m);
    });
    return map;
  }, [memories]);

  // Build the month grid
  const cells = useMemo(() => {
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const list = [];
    for (let i = 0; i < firstWeekday; i++) list.push(null);
    for (let d = 1; d <= daysInMonth; d++) list.push(d);
    while (list.length % 7 !== 0) list.push(null);
    const rows = [];
    for (let i = 0; i < list.length; i += 7) rows.push(list.slice(i, i + 7));
    return rows;
  }, [viewYear, viewMonth]);

  const changeMonth = (delta) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m);
    setViewYear(y);
    setSelectedKey(null);
  };

  // 1. Prioritize favorite memories for the top stamp cascade
  const favoriteMemories = useMemo(() => {
    return memories.filter((m) => m.is_favorite && m.uri);
  }, [memories]);

  const stampMemories = useMemo(() => {
    const pool = favoriteMemories.length > 0 ? favoriteMemories : memories.filter((m) => m.uri);
    return pool.slice(0, STAMP_LAYOUT.length);
  }, [favoriteMemories, memories]);

  const selectedDayMemories = selectedKey ? byDay[selectedKey] || [] : [];

  // Related photos for active memory
  const sameDateMemories = useMemo(() => {
    if (!activeMemory) return [];
    const k = dayKey(activeMemory.date);
    return (byDay[k] || []).filter((m) => m.id !== activeMemory.id && m.uri);
  }, [activeMemory, byDay]);

  const samePlaceMemories = useMemo(() => {
    if (!activeMemory || !activeMemory.place_name) return [];
    return memories.filter(
      (m) =>
        m.id !== activeMemory.id &&
        m.place_name &&
        m.place_name.toLowerCase() === activeMemory.place_name.toLowerCase() &&
        m.uri
    );
  }, [activeMemory, memories]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {/* Top buttons & Favorites title */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.roundBtn} onPress={() => router.push("/(tabs)/camera")}>
            <Text style={styles.roundBtnText}>+</Text>
          </TouchableOpacity>

          <View style={styles.favoritesHeaderBadge}>
            <Ionicons name="heart" size={13} color={COLORS.favorite} />
            <Text style={styles.favoritesBadgeText}>FAVORITE MEMORIES</Text>
            <View style={styles.favoritesCountPill}>
              <Text style={styles.favoritesCountText}>{favoriteMemories.length}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.roundBtn} onPress={() => router.push("/(tabs)/profile")}>
            <Text style={styles.roundBtnText}>⋯</Text>
          </TouchableOpacity>
        </View>

        {/* Favorite Stamps cascade */}
        <View style={styles.cascade}>
          {stampMemories.map((m, i) => {
            const p = STAMP_LAYOUT[i];
            return (
              <TouchableOpacity
                key={m.id}
                activeOpacity={0.88}
                style={{ position: "absolute", left: width * p.left, top: p.top, zIndex: i }}
                onPress={() => setActiveMemory(m)}
              >
                <Stamp
                  uri={m.uri}
                  size={p.size}
                  isFavorite={m.is_favorite}
                  style={{ transform: [{ rotate: `${p.rot}deg` }] }}
                />
              </TouchableOpacity>
            );
          })}
          {stampMemories.length === 0 && (
            <Text style={styles.emptyHint}>Tap heart on any memory to show it here</Text>
          )}
        </View>

        {/* Month header */}
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={() => changeMonth(-1)} hitSlop={12}>
            <Text style={styles.chev}>‹</Text>
          </TouchableOpacity>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.year}>{viewYear}</Text>
            <Text style={styles.month}>{MONTHS[viewMonth]}</Text>
          </View>
          <TouchableOpacity onPress={() => changeMonth(1)} hitSlop={12}>
            <Text style={styles.chev}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar grid */}
        <View style={styles.grid}>
          <View style={styles.row}>
            {WEEKDAYS.map((w, i) => (
              <View key={i} style={[styles.weekCell, { width: cellW }]}>
                <Text style={styles.weekText}>{w}</Text>
              </View>
            ))}
          </View>

          {cells.map((row, r) => (
            <View key={r} style={styles.row}>
              {row.map((day, c) => {
                if (!day) return <View key={c} style={[styles.cell, { width: cellW }]} />;
                const key = `${viewYear}-${viewMonth}-${day}`;
                const list = byDay[key];
                const has = list && list.length > 0 && list[0].uri;
                const isSelected = selectedKey === key;
                return (
                  <TouchableOpacity
                    key={c}
                    activeOpacity={0.7}
                    style={[styles.cell, { width: cellW }, isSelected && styles.cellSelected]}
                    onPress={() => {
                      if (isSelected) {
                        setSelectedKey(null);
                      } else {
                        setSelectedKey(key);
                        if (list && list.length > 0) {
                          setActiveMemory(list[0]);
                        }
                      }
                    }}
                  >
                    {has ? (
                      <Stamp
                        uri={list[0].uri}
                        size={cellW * 0.55}
                        isFavorite={list[0].is_favorite}
                        style={{ transform: [{ rotate: "-3deg" }] }}
                      />
                    ) : (
                      <Text style={styles.dayNum}>{day}</Text>
                    )}
                    {list && list.length > 1 && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{list.length}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* Selected day list */}
        {selectedKey && (
          <View style={styles.dayPanel}>
            {selectedDayMemories.length === 0 ? (
              <Text style={styles.panelEmpty}>No memories on this day</Text>
            ) : (
              <>
                <Text style={styles.panelTitle}>
                  {formatDate(selectedDayMemories[0].date)} ({selectedDayMemories.length}{" "}
                  {selectedDayMemories.length === 1 ? "memory" : "memories"})
                </Text>
                {selectedDayMemories.map((m) => {
                  const isActive = activeMemory?.id === m.id;
                  return (
                    <TouchableOpacity
                      key={m.id}
                      style={[styles.panelItem, isActive && styles.panelItemActive]}
                      onPress={() => setActiveMemory(m)}
                    >
                      <Stamp uri={m.uri} size={48} isFavorite={m.is_favorite} />
                      <View style={{ marginLeft: 14, flex: 1 }}>
                        <Text style={styles.panelTime}>{formatTime(m.date)}</Text>
                        <Text style={styles.panelCaption} numberOfLines={1}>
                          {m.caption || m.title || "Untitled memory"}
                        </Text>
                        {m.place_name && (
                          <Text style={styles.panelPlace}>📍 {m.place_name}</Text>
                        )}
                      </View>
                      <Ionicons
                        name={isActive ? "chevron-down" : "chevron-forward"}
                        size={18}
                        color={COLORS.muted}
                      />
                    </TouchableOpacity>
                  );
                })}
              </>
            )}
          </View>
        )}

        {/* Detailed Inspector Card for the selected Memory */}
        {activeMemory && (
          <View style={styles.inspectorContainer}>
            <View style={styles.inspectorHeader}>
              <View style={styles.inspectorTitleBlock}>
                <Text style={styles.inspectorSubtitle}>MEMORY DETAILS</Text>
                <Text style={styles.inspectorTitle}>
                  {activeMemory.caption || activeMemory.title}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeInspectorBtn}
                onPress={() => setActiveMemory(null)}
              >
                <Ionicons name="close" size={20} color={COLORS.muted} />
              </TouchableOpacity>
            </View>

            {/* Main Image with favorite button */}
            <View style={styles.inspectorImageFrame}>
              <Image source={{ uri: activeMemory.uri }} style={styles.inspectorImage} />
              <TouchableOpacity
                style={styles.inspectorFavoriteBtn}
                onPress={() => toggleFavorite(activeMemory.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={activeMemory.is_favorite ? "heart" : "heart-outline"}
                  size={22}
                  color={activeMemory.is_favorite ? COLORS.favorite : "#FFFFFF"}
                />
              </TouchableOpacity>
            </View>

            {/* Meta tags bar */}
            <View style={styles.metaRow}>
              {activeMemory.place_name && (
                <View style={styles.metaPill}>
                  <Ionicons name="location" size={13} color={COLORS.accent} />
                  <Text style={styles.metaPillText}>{activeMemory.place_name}</Text>
                </View>
              )}
              <View style={styles.metaPill}>
                <Ionicons name="calendar-outline" size={13} color={COLORS.muted} />
                <Text style={styles.metaPillText}>
                  {formatDate(activeMemory.date)} • {formatTime(activeMemory.date)}
                </Text>
              </View>
            </View>

            {activeMemory.description && (
              <Text style={styles.inspectorDescription}>
                {activeMemory.description}
              </Text>
            )}

            {/* 1. All photos on this Date */}
            {sameDateMemories.length > 0 && (
              <View style={styles.relatedSection}>
                <View style={styles.relatedHeader}>
                  <Ionicons name="calendar" size={14} color={COLORS.accent} />
                  <Text style={styles.relatedHeading}>
                    More photos from {formatDate(activeMemory.date)} ({sameDateMemories.length})
                  </Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedScroll}>
                  {sameDateMemories.map((m) => (
                    <TouchableOpacity
                      key={m.id}
                      style={styles.relatedThumb}
                      onPress={() => setActiveMemory(m)}
                    >
                      <Image source={{ uri: m.uri }} style={styles.relatedImg} />
                      <Text style={styles.relatedTime}>{formatTime(m.date)}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* 2. All photos on this Place */}
            {samePlaceMemories.length > 0 && (
              <View style={styles.relatedSection}>
                <View style={styles.relatedHeader}>
                  <Ionicons name="location" size={14} color={COLORS.accent} />
                  <Text style={styles.relatedHeading}>
                    More photos from {activeMemory.place_name} ({samePlaceMemories.length})
                  </Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedScroll}>
                  {samePlaceMemories.map((m) => (
                    <TouchableOpacity
                      key={m.id}
                      style={styles.relatedThumb}
                      onPress={() => setActiveMemory(m)}
                    >
                      <Image source={{ uri: m.uri }} style={styles.relatedImg} />
                      <Text style={styles.relatedTime} numberOfLines={1}>{m.caption || m.title}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Button to open full detail screen */}
            <TouchableOpacity
              style={styles.fullStoryBtn}
              onPress={() => router.push(`/memory/${activeMemory.id}`)}
            >
              <Text style={styles.fullStoryBtnText}>Open Full Journal Entry</Text>
              <Ionicons name="arrow-forward" size={16} color="#000000" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 50,
  },
  roundBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.chip,
    justifyContent: "center",
    alignItems: "center",
  },
  roundBtnText: { color: COLORS.text, fontSize: 20, marginTop: -2 },

  favoritesHeaderBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1C1C20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2A2A30",
  },
  favoritesBadgeText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  favoritesCountPill: {
    backgroundColor: COLORS.favorite,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  favoritesCountText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },

  cascade: { height: 300, marginTop: -24 },
  emptyHint: { color: COLORS.muted, textAlign: "center", marginTop: 140, fontSize: 13 },

  stamp: {
    backgroundColor: "#FFFFFF",
    padding: 4,
    borderRadius: 3,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    borderStyle: "dotted",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    position: "relative",
  },
  stampImg: { flex: 1, borderRadius: 1, backgroundColor: "#222" },
  favoriteBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(239, 68, 68, 0.95)",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  monthHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  year: { color: COLORS.muted, fontSize: 15 },
  month: { color: COLORS.text, fontSize: 32, fontWeight: "800", marginRight: 4 },
  chev: { color: COLORS.muted, fontSize: 28, paddingHorizontal: 10 },

  grid: { borderTopWidth: 1, borderTopColor: COLORS.grid },
  row: { flexDirection: "row" },
  weekCell: {
    height: 34,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.grid,
  },
  weekText: { color: COLORS.muted, fontSize: 11 },
  cell: {
    height: 78,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.cell,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.grid,
  },
  cellSelected: { backgroundColor: "#1E1E26", borderColor: COLORS.accent },
  dayNum: { color: COLORS.muted, fontSize: 13 },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "#000", fontSize: 10, fontWeight: "700" },

  dayPanel: { paddingHorizontal: 16, paddingTop: 20 },
  panelTitle: { color: COLORS.text, fontSize: 16, fontWeight: "700", marginBottom: 12 },
  panelEmpty: { color: COLORS.muted, textAlign: "center", paddingVertical: 12 },
  panelItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cell,
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.grid,
  },
  panelItemActive: {
    borderColor: COLORS.accent,
    backgroundColor: "#191920",
  },
  panelTime: { color: COLORS.accent, fontSize: 13, fontWeight: "700" },
  panelCaption: { color: COLORS.text, fontSize: 14, marginTop: 2, fontWeight: "500" },
  panelPlace: { color: COLORS.muted, fontSize: 12, marginTop: 2 },

  // Inspector Card
  inspectorContainer: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2B2B32",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  inspectorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  inspectorTitleBlock: {
    flex: 1,
    marginRight: 10,
  },
  inspectorSubtitle: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.accent,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  inspectorTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  closeInspectorBtn: {
    padding: 4,
    borderRadius: 14,
    backgroundColor: COLORS.chip,
  },
  inspectorImageFrame: {
    height: 220,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#000",
    marginBottom: 12,
  },
  inspectorImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  inspectorFavoriteBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#222228",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  metaPillText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "500",
  },
  inspectorDescription: {
    color: "#D1D5DB",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  relatedSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#2A2A30",
  },
  relatedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  relatedHeading: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
  },
  relatedScroll: {
    gap: 10,
  },
  relatedThumb: {
    width: 80,
    alignItems: "center",
  },
  relatedImg: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#222",
  },
  relatedTime: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 4,
    textAlign: "center",
  },
  fullStoryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 18,
  },
  fullStoryBtnText: {
    color: "#000000",
    fontWeight: "800",
    fontSize: 14,
  },
});