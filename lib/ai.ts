import { fetchAllPlaces, filterByCity, type DBPlace } from "./places";
import { haversineKm, formatDistance, estimateWalkingTime, type UserLocation } from "./location";
import { getRoute, formatDuration, formatKm } from "./routing";
import type { TimelineStop, AIResponse, SectionOption, StructuredSection, Itinerary } from "../types";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

// ─── Budget labels by price_level ───

const BUDGET_LABELS: Record<number, string> = {
  0: "Бесплатно",
  1: "2–5k ₸",
  2: "5–10k ₸",
  3: "10–15k ₸",
  4: "15–25k ₸",
  5: "25k+ ₸",
};

// ─── Interest → Tag mapping ───

const INTEREST_TAG_MAP: Record<string, string[]> = {
  food: ["food", "restaurant", "cafe", "coffee", "dinner", "breakfast", "street food", "kazakh", "traditional", "local"],
  culture: ["culture", "history", "museum", "art", "architecture", "education", "landmark"],
  nightlife: ["nightlife", "bar", "club", "lounge", "entertainment", "date", "evening"],
  nature: ["nature", "outdoor", "park", "mountain", "lake", "hiking", "river", "garden"],
  adventure: ["adventure", "hiking", "mountain", "ski", "active", "outdoor", "sports", "extreme"],
  shopping: ["shopping", "mall", "market", "bazaar", "entertainment", "cinema", "souvenirs"],
  photography: ["view", "photo", "landmark", "sunset", "scenic", "instagram", "panorama"],
  wellness: ["wellness", "spa", "fitness", "relax", "yoga", "massage", "health"],
  family: ["family", "park", "education", "museum", "zoo", "indoor", "kids", "playground"],
  budget: ["budget", "street food", "free", "park", "local", "affordable"],
  luxury: ["luxury", "fine dining", "premium", "spa", "five star", "rooftop", "gourmet"],
  local: ["local", "traditional", "kazakh", "authentic", "hidden gem", "vibe", "community"],
};

// ─── Prompt → Tag mapping (expanded with context keywords) ───

const PROMPT_TAG_MAP: Record<string, string[]> = {
  // English
  coffee: ["coffee", "cafe", "cozy", "breakfast", "wifi"],
  cafe: ["coffee", "cafe", "cozy", "breakfast"],
  food: ["food", "restaurant", "dinner", "kazakh", "traditional", "local"],
  eat: ["food", "restaurant", "dinner", "local"],
  restaurant: ["food", "restaurant", "dinner", "kazakh", "luxury"],
  date: ["romantic", "date", "view", "sunset", "dinner"],
  romantic: ["romantic", "date", "view", "sunset"],
  view: ["view", "sunset", "landmark", "photo", "outdoor"],
  photo: ["view", "photo", "landmark", "sunset"],
  nature: ["nature", "outdoor", "hiking", "park", "mountain", "lake"],
  park: ["park", "outdoor", "nature", "relax", "river"],
  walk: ["walking", "outdoor", "park", "center", "vibe"],
  culture: ["culture", "history", "architecture", "museum", "art"],
  museum: ["museum", "education", "culture", "indoor"],
  shop: ["shopping", "entertainment", "cinema", "indoor"],
  sport: ["sports", "ski", "hiking", "active", "outdoor"],
  adventure: ["hiking", "mountain", "outdoor", "lake"],
  night: ["date", "dinner", "view", "entertainment", "nightlife"],
  quiet: ["cozy", "cafe", "quiet", "relax"],
  budget: ["budget", "street food", "free", "park", "local", "affordable"],
  luxury: ["luxury", "fine dining", "premium", "spa", "rooftop", "gourmet"],
  premium: ["luxury", "fine dining", "premium", "rooftop", "gourmet"],
  indoor: ["indoor", "museum", "cafe", "mall", "cinema"],
  rain: ["indoor", "museum", "cafe", "mall", "cinema", "cozy"],
  healthy: ["healthy", "fitness", "outdoor", "park", "sports"],
  solo: ["cozy", "cafe", "quiet", "relax", "wifi"],
  business: ["restaurant", "quiet", "lounge", "premium", "dinner"],
  // Russian
  "кофе": ["coffee", "cafe", "cozy", "wifi", "breakfast"],
  "кафе": ["coffee", "cafe", "cozy", "breakfast", "trendy"],
  "еда": ["food", "restaurant", "dinner", "local", "kazakh"],
  "поесть": ["food", "restaurant", "dinner", "local"],
  "ресторан": ["food", "restaurant", "dinner", "kazakh", "luxury"],
  "свидан": ["romantic", "date", "view", "sunset"],
  "романтик": ["romantic", "date", "view", "sunset"],
  "годовщин": ["romantic", "date", "view", "premium", "luxury", "fine dining"],
  "вечер": ["date", "dinner", "view", "sunset", "entertainment"],
  "природ": ["nature", "outdoor", "hiking", "park", "mountain"],
  "гулять": ["walking", "outdoor", "park", "center", "vibe"],
  "прогулк": ["walking", "outdoor", "park", "river"],
  "парк": ["park", "outdoor", "nature", "relax"],
  "культур": ["culture", "history", "architecture", "museum"],
  "музей": ["museum", "education", "culture"],
  "магазин": ["shopping", "entertainment", "cinema"],
  "горы": ["mountain", "hiking", "outdoor", "ski"],
  "фото": ["view", "photo", "landmark", "sunset"],
  "завтрак": ["breakfast", "cafe", "coffee", "trendy"],
  "уютн": ["cozy", "cafe", "coffee"],
  // New context keywords
  "командировк": ["restaurant", "quiet", "lounge", "premium", "dinner"],
  "работ": ["restaurant", "quiet", "lounge", "premium"],
  "бизнес": ["restaurant", "quiet", "lounge", "premium", "dinner"],
  "студент": ["budget", "street food", "cafe", "affordable", "cozy"],
  "бюджет": ["budget", "street food", "free", "park", "local", "affordable"],
  "дешев": ["budget", "street food", "free", "affordable"],
  "дождь": ["indoor", "museum", "cafe", "mall", "cinema", "cozy"],
  "плох": ["indoor", "museum", "cafe", "mall", "cinema"],
  "здоров": ["healthy", "fitness", "outdoor", "park", "sports"],
  "актив": ["sports", "hiking", "active", "outdoor", "fitness"],
  "спорт": ["sports", "hiking", "active", "outdoor", "fitness"],
  "ноч": ["nightlife", "bar", "club", "lounge", "entertainment", "late"],
  "после 23": ["nightlife", "bar", "club", "lounge", "late"],
  "тусов": ["nightlife", "bar", "club", "entertainment"],
  "интроверт": ["cozy", "cafe", "quiet", "relax", "wifi"],
  "один": ["cozy", "cafe", "quiet", "relax", "wifi"],
  "побыть": ["cozy", "cafe", "quiet", "relax"],
  "спокойн": ["quiet", "cozy", "calm", "relax", "cafe"],
  "тих": ["quiet", "cozy", "calm", "relax"],
  "без толп": ["quiet", "cozy", "calm"],
  "без шум": ["quiet", "cozy", "calm"],
  "толп": ["quiet", "calm"],
  "дорог": ["luxury", "fine dining", "premium", "rooftop", "gourmet"],
  "премиум": ["luxury", "fine dining", "premium", "rooftop", "gourmet"],
  "необычн": ["unique", "hidden gem", "premium", "authentic"],
  "запомн": ["unique", "hidden gem", "premium", "luxury"],
  "инстаграм": ["instagram", "view", "photo", "trendy", "panorama"],
  "красив": ["view", "photo", "instagram", "panorama", "sunset"],
  "лаунж": ["lounge", "bar", "quiet", "premium"],
  "кальян": ["lounge", "bar", "evening"],
  "пиво": ["bar", "restaurant", "casual"],
  "вино": ["bar", "restaurant", "premium", "rooftop"],
  "стейк": ["restaurant", "food", "premium", "dinner"],
  "поужинать": ["food", "restaurant", "dinner", "evening"],
  "обед": ["food", "restaurant", "lunch", "cafe"],
  "семь": ["family", "park", "kids", "zoo", "museum"],
  "ребенк": ["family", "kids", "park", "playground", "indoor"],
  "дет": ["family", "kids", "park", "playground"],
};

// ─── Module-level cache for Replace feature ───

let _lastCityPlaces: DBPlace[] = [];

export function getCachedPlaces(): DBPlace[] {
  return _lastCityPlaces;
}

// ─── Main entry point ───

export interface GenerateOptions {
  prompt: string;
  city: string;
  interests?: string[];
  userLocation?: UserLocation | null;
}

export async function generateAIResponse(options: GenerateOptions): Promise<AIResponse> {
  const { prompt, city, interests: rawInterests = [], userLocation = null } = options;

  let interests: string[] = [];
  if (typeof rawInterests === "string") {
    try { interests = JSON.parse(rawInterests); } catch { interests = []; }
  } else if (Array.isArray(rawInterests)) {
    interests = rawInterests;
  }

  // 1. Fetch & filter
  const allPlaces = await fetchAllPlaces();
  const cityPlaces = await filterByCity(allPlaces, city);
  _lastCityPlaces = cityPlaces; // cache for Replace

  if (cityPlaces.length === 0) {
    throw new Error(`No places found for ${city}`);
  }

  console.log(`[AI] City: ${city}, Places: ${allPlaces.length} → ${cityPlaces.length}, Interests: [${interests.join(", ")}]`);

  // 2. Score
  const scored = scorePlaces(cityPlaces, interests, prompt, userLocation);
  const topPlaces = scored.slice(0, 20);

  // 3. Gemini structured or fallback
  let title: string;
  let sections: StructuredSection[];
  const usedIds = new Set<string>();

  if (GEMINI_API_KEY && topPlaces.length > 0) {
    console.log(`[AI] Calling Gemini with ${topPlaces.length} places...`);
    try {
      const geminiResult = await askGeminiStructured(
        prompt, interests, topPlaces.map(s => s.place), city
      );
      title = geminiResult.title || guessTitle(prompt, city);
      sections = buildStructuredSections(geminiResult.sections, topPlaces.map(s => s.place), userLocation);
      console.log(`[AI] Gemini returned ${sections.length} sections`);
    } catch (err: any) {
      console.warn("[AI] Gemini failed, using fallback:", err?.message || err);
      title = guessTitle(prompt, city);
      sections = buildFallbackSections(topPlaces.map(s => s.place), city, userLocation);
    }
  } else {
    console.log(`[AI] No Gemini key or no places, using fallback. Key: ${!!GEMINI_API_KEY}, Places: ${topPlaces.length}`);
    title = guessTitle(prompt, city);
    sections = buildFallbackSections(topPlaces.map(s => s.place), city, userLocation);
  }

  // Track used IDs
  for (const s of sections) {
    for (const o of [...s.options, ...s.reserves]) usedIds.add(o.place.id);
  }

  // Remaining scored IDs for Replace fallback
  const scoredPool = scored
    .filter(s => !usedIds.has(s.place.id))
    .map(s => s.place.id);

  console.log(`[AI] Title: "${title}", Sections: ${sections.length}, Pool: ${scoredPool.length}`);

  const response: AIResponse = { title, sections, scoredPool };
  // Fire-and-forget: don't block AI response on OSRM network call
  enrichWalkingTimes(response).catch(() => {});
  return response;
}

/**
 * Enrich all stops in sections with real walking times from OSRM.
 * Collects all stops in order, calls OSRM once, distributes segment data.
 */
async function enrichWalkingTimes(response: AIResponse): Promise<void> {
  const allStops: TimelineStop[] = [];
  for (const section of response.sections) {
    for (const opt of section.options) {
      if (opt.place.latitude && opt.place.longitude) {
        allStops.push(opt.place);
      }
    }
  }
  if (allStops.length < 2) return;

  try {
    const waypoints = allStops.map((s) => ({ latitude: s.latitude!, longitude: s.longitude! }));
    const route = await getRoute(waypoints, "foot");
    if (!route?.segments) return;

    for (let i = 0; i < route.segments.length; i++) {
      const seg = route.segments[i];
      const nextStop = allStops[i + 1];
      if (nextStop) {
        nextStop.walkingTime = `${formatDuration(seg.durationMinutes)} · ${formatKm(seg.distanceKm)}`;
        nextStop.distanceKm = seg.distanceKm;
      }
    }
    console.log(`[AI] Enriched ${route.segments.length} walking segments via OSRM`);
  } catch (err) {
    console.warn("[AI] OSRM enrichment failed, using estimates:", err);
  }
}

// ─── Replace option (pure, instant, no API call) ───

export function replaceOption(
  response: AIResponse,
  sectionIdx: number,
  optionIdx: number,
  allPlaces: DBPlace[],
  userLocation: UserLocation | null
): AIResponse {
  // Deep clone sections
  const newSections = response.sections.map(s => ({
    ...s,
    options: [...s.options],
    reserves: [...s.reserves],
  }));
  let newPool = [...response.scoredPool];

  const section = newSections[sectionIdx];
  if (!section || optionIdx < 0 || optionIdx >= section.options.length) return response;

  // Remove current option
  section.options.splice(optionIdx, 1);

  // Insert replacement
  if (section.reserves.length > 0) {
    // Use reserve first
    const replacement = section.reserves.shift()!;
    section.options.splice(optionIdx, 0, replacement);
  } else if (newPool.length > 0) {
    // Fallback: use next from scored pool
    const nextId = newPool.shift()!;
    const place = allPlaces.find(p => p.id === nextId);
    if (place) {
      const stop = buildTimelineStop(place, userLocation);
      const newOption: SectionOption = {
        place: stop,
        why: place.description || "Рекомендованное место",
        budgetHint: BUDGET_LABELS[place.price_level || 0],
      };
      section.options.splice(optionIdx, 0, newOption);
    }
  }

  return { title: response.title, sections: newSections, scoredPool: newPool };
}

// ─── Gemini Structured Call ───

interface GeminiOption {
  id: string;
  why: string;
  budget: string;
}

interface GeminiSection {
  title: string;
  emoji: string;
  timeRange: string;
  options: GeminiOption[];
  reserveIds: string[];
}

interface GeminiResult {
  title: string;
  sections: GeminiSection[];
}

async function askGeminiStructured(
  prompt: string,
  interests: string[],
  places: DBPlace[],
  city: string,
): Promise<GeminiResult> {
  const placeList = places.map(p => ({
    id: p.id,
    title: p.title,
    type: p.type,
    tags: p.tags,
    rating: p.rating,
    desc: (p.description || "").slice(0, 100),
    price: p.price_level || 0,
    addr: p.address || "",
  }));

  const interestStr = interests.length > 0
    ? `\nUser preferences: ${interests.join(", ")}.`
    : "";

  const systemPrompt = `You are Nomad AI — a premium local city assistant for ${city}, Kazakhstan.
You create personalized plans that feel premium, not generic. Avoid tourist traps unless requested.${interestStr}

Available places (pre-scored by relevance):
${JSON.stringify(placeList)}

User request: "${prompt}"

Analyze the user's intent (mood, budget, time, purpose) and create a structured recommendation.
Return ONLY valid JSON (no markdown):
{"title":"Short catchy title","sections":[{"title":"Section name","emoji":"one emoji","timeRange":"HH:MM–HH:MM","options":[{"id":"place-uuid","why":"1-2 sentence contextual description","budget":"Xk KZT"}],"reserveIds":["backup-id"]}]}

Rules:
- 1-4 sections depending on query complexity
- Single-item query (e.g. "хочу кофе", "где поесть") → 1 section with 2-3 options
- Multi-activity query (e.g. "вечер провести", "поужинать и сходить") → 2-3 sections
- Full day query → 3-4 sections
- Each section: 2-3 primary options + 1-2 reserveIds (backup IDs for swap)
- "why" MUST be specific to the user's context (mood, purpose, budget), NOT a generic description
- Budget hints from price level: 0=бесплатно, 1=2-5k, 2=5-10k, 3=10-15k, 4=15-25k, 5=25k+ KZT
- Time ranges should be realistic and sequential
- Use ONLY IDs from the available list
- NEVER repeat IDs across sections or reserves
- If query mentions "без толп"/"тихо" → pick calm places
- If query mentions "командировка"/"бизнес" → pick professional atmosphere
- If query mentions "бюджет"/"студент" → pick affordable options
- Respond in Russian for Russian queries, English for English queries`;

  const models = ["gemini-2.0-flash-lite", "gemini-2.0-flash"];
  let lastError: Error | null = null;

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      console.log(`[Gemini] Calling ${model}...`);
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
        }),
      });
      clearTimeout(timeout);

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        const errMsg = (errBody as any)?.error?.message || `status ${response.status}`;
        console.warn(`[Gemini] ${model} failed: ${errMsg}`);
        lastError = new Error(`Gemini ${model}: ${errMsg}`);
        continue; // try next model
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      console.log(`[Gemini] ${model} raw response length: ${text.length}`);

      if (!text) {
        lastError = new Error(`Gemini ${model} returned empty response`);
        continue;
      }

      const cleaned = text.replace(/```json?\s*/g, "").replace(/```/g, "").trim();
      const result = JSON.parse(cleaned) as GeminiResult;

      // Validate structure
      if (!result.sections || !Array.isArray(result.sections) || result.sections.length === 0) {
        lastError = new Error(`Gemini ${model} returned invalid structure`);
        continue;
      }

      console.log(`[Gemini] ${model} success: ${result.sections.length} sections`);
      return result;
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.warn(`[Gemini] ${model} timed out after 15s`);
        lastError = new Error(`Gemini ${model} timed out`);
      } else {
        console.warn(`[Gemini] ${model} error:`, err.message);
        lastError = err;
      }
    }
  }

  throw lastError || new Error("All Gemini models failed");
}

// ─── Build structured sections from Gemini result ───

function buildStructuredSections(
  geminiSections: GeminiSection[],
  places: DBPlace[],
  userLocation: UserLocation | null,
): StructuredSection[] {
  const placeMap = new Map(places.map(p => [p.id, p]));

  return geminiSections.map(gs => {
    const options: SectionOption[] = gs.options
      .map(opt => {
        const place = placeMap.get(opt.id);
        if (!place) return null;
        return {
          place: buildTimelineStop(place, userLocation),
          why: opt.why,
          budgetHint: opt.budget || BUDGET_LABELS[place.price_level || 0],
        };
      })
      .filter(Boolean) as SectionOption[];

    const reserves: SectionOption[] = (gs.reserveIds || [])
      .map(id => {
        const place = placeMap.get(id);
        if (!place) return null;
        return {
          place: buildTimelineStop(place, userLocation),
          why: place.description || "Альтернативный вариант",
          budgetHint: BUDGET_LABELS[place.price_level || 0],
        };
      })
      .filter(Boolean) as SectionOption[];

    return {
      title: gs.title,
      emoji: gs.emoji || "📍",
      timeRange: gs.timeRange || "",
      options,
      reserves,
    };
  });
}

// ─── Fallback sections (when Gemini fails) ───

function buildFallbackSections(
  places: DBPlace[],
  city: string,
  userLocation: UserLocation | null,
): StructuredSection[] {
  const options = places.slice(0, 3).map(p => ({
    place: buildTimelineStop(p, userLocation),
    why: p.description || `Популярное место в ${city}`,
    budgetHint: BUDGET_LABELS[p.price_level || 0],
  }));
  const reserves = places.slice(3, 5).map(p => ({
    place: buildTimelineStop(p, userLocation),
    why: p.description || "Альтернативный вариант",
    budgetHint: BUDGET_LABELS[p.price_level || 0],
  }));

  return [{
    title: "Рекомендации",
    emoji: "✨",
    timeRange: "",
    options,
    reserves,
  }];
}

// ─── Build TimelineStop from DBPlace ───

function buildTimelineStop(place: DBPlace, userLocation: UserLocation | null): TimelineStop {
  let distKm: number | null = null;
  if (userLocation && place.latitude && place.longitude) {
    distKm = haversineKm(userLocation.latitude, userLocation.longitude, place.latitude, place.longitude);
  }

  return {
    id: place.id,
    title: place.title,
    time: "",
    imageUrl: place.image_url || "",
    safetyLevel: (place.safety_score || 90) >= 85 ? "safe" : "warning",
    safetyScore: place.safety_score || 90,
    tags: place.tags || [],
    description: place.description || "",
    type: place.type,
    rating: place.rating,
    address: place.address,
    priceLevel: place.price_level,
    openingHours: place.opening_hours,
    contact: place.contact,
    reviewCount: place.reviews?.count || 0,
    verified: place.verified,
    distanceKm: distKm,
    latitude: place.latitude,
    longitude: place.longitude,
  };
}

// ─── Stage 1: Weighted Scoring (unchanged) ───

interface ScoredPlace {
  place: DBPlace;
  score: number;
  distanceKm: number | null;
}

function scorePlaces(
  places: DBPlace[],
  interests: string[],
  prompt: string,
  userLocation: UserLocation | null
): ScoredPlace[] {
  const interestTags = new Set<string>();
  for (const interest of interests) {
    const tags = INTEREST_TAG_MAP[interest.toLowerCase()];
    if (tags) tags.forEach(t => interestTags.add(t));
  }

  const promptTags = new Set<string>();
  const words = prompt.toLowerCase().split(/\s+/);
  for (const word of words) {
    for (const [key, tags] of Object.entries(PROMPT_TAG_MAP)) {
      if (word.includes(key) || key.includes(word)) {
        tags.forEach(t => promptTags.add(t));
      }
    }
  }

  const scored: ScoredPlace[] = places.map((place) => {
    let score = 0;
    const placeTags = (place.tags || []).map(t => t.toLowerCase());
    const placeType = (place.type || "").toLowerCase();
    const placeTitle = (place.title || "").toLowerCase();

    for (const tag of placeTags) { if (interestTags.has(tag)) score += 3; }
    if (interestTags.has(placeType)) score += 2;

    for (const tag of placeTags) { if (promptTags.has(tag)) score += 4; }
    if (promptTags.has(placeType)) score += 3;

    for (const word of words) {
      if (word.length > 2 && placeTitle.includes(word)) score += 5;
      if (word.length > 2 && placeType.includes(word)) score += 3;
    }

    if (place.rating && place.rating >= 4.7) score += 2;
    if (place.rating && place.rating >= 4.5) score += 1;

    let distanceKm: number | null = null;
    if (userLocation && place.latitude && place.longitude) {
      distanceKm = haversineKm(userLocation.latitude, userLocation.longitude, place.latitude, place.longitude);
      if (distanceKm < 1) score += 5;
      else if (distanceKm < 3) score += 3;
      else if (distanceKm < 5) score += 1;
    }

    return { place, score, distanceKm };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.distanceKm !== null && b.distanceKm !== null) return a.distanceKm - b.distanceKm;
    return 0;
  });

  return scored;
}

// ─── Helpers ───

function guessTitle(prompt: string, city: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes("date") || lower.includes("romantic") || lower.includes("свидан") || lower.includes("романтик") || lower.includes("годовщин"))
    return `Романтический вечер — ${city}`;
  if (lower.includes("coffee") || lower.includes("cafe") || lower.includes("кофе") || lower.includes("кафе"))
    return `Кофейни — ${city}`;
  if (lower.includes("food") || lower.includes("eat") || lower.includes("еда") || lower.includes("поесть") || lower.includes("ресторан") || lower.includes("поужинать"))
    return `Где поесть — ${city}`;
  if (lower.includes("view") || lower.includes("фото") || lower.includes("вид"))
    return `Лучшие виды — ${city}`;
  if (lower.includes("culture") || lower.includes("культур") || lower.includes("музей"))
    return `Культура — ${city}`;
  if (lower.includes("nature") || lower.includes("природ") || lower.includes("горы") || lower.includes("парк"))
    return `На природу — ${city}`;
  if (lower.includes("walk") || lower.includes("гулять") || lower.includes("прогулк"))
    return `Прогулка по ${city}`;
  if (lower.includes("night") || lower.includes("вечер") || lower.includes("ноч"))
    return `Вечер в ${city}`;
  if (lower.includes("shop") || lower.includes("магазин"))
    return `Шоппинг — ${city}`;
  if (lower.includes("командировк") || lower.includes("бизнес") || lower.includes("работ"))
    return `Бизнес-вечер — ${city}`;
  if (lower.includes("студент") || lower.includes("бюджет"))
    return `Бюджетный план — ${city}`;
  if (lower.includes("дождь"))
    return `Что делать в дождь — ${city}`;
  if (lower.includes("семь") || lower.includes("ребенк") || lower.includes("дет"))
    return `С семьёй — ${city}`;
  return `Рекомендации — ${city}`;
}

// ─── Backward compat: generateItinerary wrapper ───

export async function generateItinerary(options: GenerateOptions): Promise<Itinerary> {
  const res = await generateAIResponse(options);
  // Build a minimal Itinerary from the structured response
  const allStops = res.sections.flatMap(s => s.options.map(o => o.place));
  return {
    id: `ai-${Date.now()}`,
    cityId: options.city.toLowerCase(),
    cityName: options.city,
    title: res.title,
    stops: allStops,
    totalSafetyScore: Math.round(allStops.reduce((s, p) => s + p.safetyScore, 0) / (allStops.length || 1)),
    totalDuration: "",
    estimatedCost: "",
    previewImageUrl: allStops[0]?.imageUrl || "",
    createdAt: new Date().toISOString(),
  };
}
