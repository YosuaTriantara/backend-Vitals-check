import axios from 'axios';
import { ApiError } from '../utils/apiError.js';

const MODEL_API_URL = process.env.MODEL_API_URL;

export async function predictRisk(payload) {
  // =========================
  // DUMMY MODE
  // =========================
  if (!MODEL_API_URL) {
    return {
      riskScore: 0.42,
      riskCategory: 'medium',
      rawPrediction: {
        source: 'dummy-inference',
        input: payload,
        prediction: {
          risk_score: 0.42,
          risk_category: 'medium',
        },
      },
    };
  }

  // =========================
  // REAL API MODE
  // =========================
  try {
    const response = await axios.post(
      `${MODEL_API_URL}/predict`,
      payload,
      {
        timeout: 15000,
      }
    );

    const data = response.data;

    return {
      riskScore: data.riskScore ?? data.risk_score,
      riskCategory: data.riskCategory ?? data.risk_category,
      rawPrediction: data,
    };
  } catch (error) {
    // fallback sementara jika Render cold start / API down
    return {
      riskScore: 0.42,
      riskCategory: 'medium',
      rawPrediction: {
        source: 'fallback-dummy',
        reason: error.message,
        input: payload,
      },
    };
  }
}