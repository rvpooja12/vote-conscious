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
 * @param {string} imageData - Base64 encoded compressed image.
 * @param {number} lat - GPS Latitude.
 * @param {number} lng - GPS Longitude.
 */
export const verifyInk = async (imageData, lat, lng) => {
  // Simulate network latency for "Biometric Scan" vibe
  await new Promise(resolve => setTimeout(resolve, 3500));

  // Mock Constituency Data (Fetched from simulated EPIC data)
  const mockConstituency = {
    name: "SOUTH DELHI",
    center: { lat: 28.5355, lng: 77.2090 },
    radiusKm: 15
  };

  // Radius Match Logic (Simplified)
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

  // Vertex AI Vision Analysis Simulation
  // In a real app, this would call the /api/verify-ink endpoint
  const systemResponse = {
    ink_detected: true,
    confidence: 0.98
  };

  console.log("[DEV MODE]: Image purged from memory to ensure PII compliance.");

  return {
    success: systemResponse.ink_detected,
    confidence: systemResponse.confidence,
    constituency: mockConstituency.name,
    timestamp: new Date().toISOString()
  };
};
