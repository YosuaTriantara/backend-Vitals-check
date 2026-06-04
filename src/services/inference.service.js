import axios from "axios";

// Normalisasi URL — hilangkan trailing slash agar tidak jadi double slash saat concat
const MODEL_API_URL = process.env.MODEL_API_URL?.replace(/\/+$/, "");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Map internal input format → model's expected JSON body.
 * `input` harus sudah memiliki field `bmi` yang dihitung sebelumnya.
 */
function buildModelPayload(input) {
  return {
    Age: input.age,
    Sex: input.gender === "male" ? 1 : 0,
    BMI: input.bmi,
    GenHlth: input.genHlth,
    MentHlth: input.mentHlth,
    PhysHlth: input.physHlth,
    DiffWalk: input.diffWalk ? 1 : 0,
    CholCheck: input.cholCheck ? 1 : 0,
    Smoker: input.smoker ? 1 : 0,
    PhysActivity: input.physActivity ? 1 : 0,
    Fruits: input.fruits ? 1 : 0,
    Veggies: input.veggies ? 1 : 0,
    HvyAlcoholConsump: input.hvyAlcoholConsump ? 1 : 0,
  };
}

/**
 * Parse response model → format internal kita.
 * riskScore = max probability across all diseases.
 * riskCategory = 'high' jika ada Tinggi, 'low' jika semua Rendah, else 'medium'.
 */
function parseModelResponse(data) {
  const predictions = data.predictions;
  const entries = Object.entries(predictions);

  const riskScore = Number(
    Math.max(...entries.map(([, d]) => d.probability_score)).toFixed(4),
  );

  const hasHigh = entries.some(([, d]) => d.predicted_risk === "Tinggi");
  const allLow = entries.every(([, d]) => d.predicted_risk === "Rendah");
  const riskCategory = hasHigh ? "high" : allLow ? "low" : "medium";

  return { riskScore, riskCategory, predictions, rawPrediction: data };
}

/** Dummy predictions untuk fallback / dummy mode. */
function dummyPredictions() {
  return {
    Diabetes: {
      probability_score: 0.15,
      threshold_used: 0.42,
      predicted_risk: "Rendah",
    },
    "Penyakit Jantung": {
      probability_score: 0.08,
      threshold_used: 0.46,
      predicted_risk: "Rendah",
    },
    Stroke: {
      probability_score: 0.06,
      threshold_used: 0.45,
      predicted_risk: "Rendah",
    },
    Hipertensi: {
      probability_score: 0.2,
      threshold_used: 0.52,
      predicted_risk: "Rendah",
    },
    "Kolesterol Tinggi": {
      probability_score: 0.25,
      threshold_used: 0.5,
      predicted_risk: "Rendah",
    },
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Cek apakah model API sudah aktif (berguna untuk handle Render cold start).
 * Kembalikan status: 'ready' | 'warming_up' | 'unavailable' | 'not_configured'
 */
export async function pingModel() {
  if (!MODEL_API_URL) {
    return { status: "not_configured" };
  }

  try {
    await axios.get(`${MODEL_API_URL}/health`, { timeout: 8000 });
    return { status: "ready" };
  } catch (error) {
    // 404 = server hidup tapi tidak ada route /health → tetap dianggap ready
    if (error.response?.status === 404) {
      return { status: "ready" };
    }

    // Timeout / connection refused = model sedang cold start
    if (
      error.code === "ECONNABORTED" ||
      error.code === "ECONNREFUSED" ||
      error.code === "ETIMEDOUT"
    ) {
      return { status: "warming_up" };
    }

    return { status: "unavailable", reason: error.message };
  }
}

/**
 * Panggil ML model dan kembalikan hasil prediksi yang sudah dinormalisasi.
 * `input` harus mengandung semua field screening + `bmi` (ditambahkan oleh service).
 */
export async function predictRisk(input) {
  const payload = buildModelPayload(input);

  // -------------------------------------------------------------------------
  // DUMMY MODE — MODEL_API_URL tidak di-set
  // -------------------------------------------------------------------------
  if (!MODEL_API_URL) {
    return {
      riskScore: 0.25,
      riskCategory: "low",
      isWarmingUp: false,
      predictions: dummyPredictions(),
      rawPrediction: { source: "dummy-inference", input: payload },
    };
  }

  // -------------------------------------------------------------------------
  // REAL API MODE
  // -------------------------------------------------------------------------
  try {
    const response = await axios.post(`${MODEL_API_URL}/predict`, payload, {
      timeout: 15000,
    });

    return {
      ...parseModelResponse(response.data),
      isWarmingUp: false,
    };
  } catch (error) {
    // Bedakan cold start (timeout) dengan error lain agar frontend bisa bereaksi
    const isWarmingUp =
      error.code === "ECONNABORTED" ||
      error.code === "ECONNREFUSED" ||
      error.code === "ETIMEDOUT";

    return {
      riskScore: 0.25,
      riskCategory: "low",
      isWarmingUp,
      predictions: dummyPredictions(),
      rawPrediction: {
        source: isWarmingUp ? "fallback-cold-start" : "fallback-error",
        reason: error.message,
        input: payload,
      },
    };
  }
}
