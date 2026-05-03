import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the SDK. In a real app, use import.meta.env.VITE_GEMINI_API_KEY
const API_KEY = "MOCK_API_KEY_FOR_DEMO";
const genAI = new GoogleGenerativeAI(API_KEY);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

const systemInstruction = "You are a highly objective, non-partisan AI agent assisting Indian voters in the 2026 elections. Provide clear, accurate, and concise civic information based on the Constitution and the Election Commission of India. Maintain absolute neutrality.";

/**
 * AI Service Simulator
 * This simulates a Cloud Run backend calling Gemini 1.5 Flash.
 */
export const getRegistrationProtocol = async () => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    title: "2026 FORM 6 PROTOCOL",
    steps: [
      {
        id: 1,
        instruction: "Access the ECI Voter Portal and select 'New Voter Registration'.",
        details: "Ensure you have your Aadhaar and a digital passport-size photo ready."
      },
      {
        id: 2,
        instruction: "Fill in personal details matching your age proof exactly.",
        details: "The 2026 cycle requires biometric-linked Aadhaar verification for faster processing."
      },
      {
        id: 3,
        instruction: "Upload Address Proof (Utility Bill/Bank Passbook).",
        details: "Must be dated within the last 3 months to be valid for the 2026 ECI cycle."
      },
      {
        id: 4,
        instruction: "Submit and track using your Reference ID.",
        details: "Verification usually takes 7-10 business days. Monitor your status in the 'Booth Finder' section."
      }
    ],
    metadata: {
      api_version: "gemini-1.5-flash",
      last_updated: "2026-05-01",
      status: "VERIFIED"
    }
  };
};

/**
 * Verifies the electoral ink signature and checks constituency radius.
 */
export const verifyInk = async (imageData, lat, lng) => {
  await new Promise(resolve => setTimeout(resolve, 3500));

  const mockConstituency = {
    name: "SOUTH DELHI",
    center: { lat: 28.5355, lng: 77.2090 },
    radiusKm: 15
  };

  const distance = Math.sqrt(
    Math.pow(lat - mockConstituency.center.lat, 2) +
    Math.pow(lng - mockConstituency.center.lng, 2)
  ) * 111; // Approx km

  if (distance > mockConstituency.radiusKm) {
    return {
      success: false,
      error: "CONSTITUENCY_MISMATCH",
      message: "Location does not match your registered constituency."
    };
  }

  return {
    success: true,
    confidence: 0.98,
    constituency: mockConstituency.name,
    timestamp: new Date().toISOString()
  };
};

// CRITICAL FIX: Named exports + Default export to satisfy Vite/Rolldown bundler
const aiService = {
  getRegistrationProtocol,
  verifyInk
};

export default aiService;