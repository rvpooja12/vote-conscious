/**
 * Manifesto Service (Mock RAG Edition)
 * Manages objective policy extraction from local mock-data corpus.
 */

export const ELECTION_NAME = "INDIRA PRADESH ASSEMBLY ELECTIONS 2026";
export const DEFAULT_PLACEHOLDER = "SEARCH CANDIDATE POLICY (e.g., energy, tech, infrastructure)";

export const MOCK_MANIFESTOS = {
  aruna: {
    name: "Dr. Aruna",
    party: "The Green Unity Party",
    focus: "Sustainability & Rural Tech",
    content: `Dr. Aruna's manifesto emphasizes a radical shift towards decentralized green energy. 
    The Green Unity Party proposes 'Solar Grids for Every Village', aiming to provide 100% renewable energy to rural districts by 2028. 
    Additionally, the manifesto details 'Agritech 2.0', a plan to provide AI-driven crop monitoring tools to farmers at no cost.
    "We believe the future of India is green and decentralized. Our energy policy prioritizes the soil over the skyscraper." 
    The document also mandates a 40% reforestation quota for all new industrial developments.`
  },
  bose: {
    name: "Mr. Bose",
    party: "The Urban Growth Alliance",
    focus: "Infrastructure & Tier-1 Digital Hubs",
    content: `Mr. Bose's manifesto centers on making India the 'Digital Capital of the World'. 
    The Urban Growth Alliance pledges to build 10 new 'Mega-Cities' with integrated 6G infrastructure by 2030. 
    The 'Hyper-Loop Connectivity' initiative aims to reduce travel time between major economic hubs by 70%.
    "Speed is our greatest asset. We will build the infrastructure that powers the next century of global trade."
    The manifesto also includes 'Tech-Zone Autonomy', allowing special economic zones to operate with minimal regulatory oversight to foster innovation.`
  }
};

export const fetchManifestoAnalysis = async (userQuery, candidateId) => {
  const normalizedQuery = userQuery.toLowerCase();
  const manifesto = MOCK_MANIFESTOS[candidateId];

  if (!manifesto) {
    throw new Error("Invalid candidate selection.");
  }

  // Simulate Gemini 1.5 Flash processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simplified objective extraction logic for prototype
  const words = normalizedQuery.split(' ');
  const keywords = ['energy', 'tech', 'digital', 'infrastructure', 'solar', 'cities', 'innovation', 'farmers', 'rural'];
  const hasKeywords = words.some(w => keywords.includes(w));

  if (!hasKeywords) {
    return {
      answer: "This specific policy is not detailed in the available summary. [REVIEW FULL MOCK MANIFESTO HERE]",
      isLink: true,
      isNeutral: true,
      citations: []
    };
  }

  let summary = "";
  let quotes = [];

  if (candidateId === 'aruna') {
    summary = "Dr. Aruna prioritizes decentralized renewable energy through village-level solar grids. The policy emphasizes rural empowerment via free AI-driven agritech tools for farmers. Sustainability is enforced through strict reforestation quotas for industrial growth.";
    quotes = ["'Solar Grids for Every Village', aiming to provide 100% renewable energy to rural districts by 2028.", "'Agritech 2.0', a plan to provide AI-driven crop monitoring tools to farmers at no cost."];
  } else {
    summary = "Mr. Bose focuses on rapid urban expansion and high-speed digital infrastructure deployment. The manifesto pledges the creation of 10 new 6G-enabled Mega-Cities to drive global trade dominance. Innovation is fostered through regulatory autonomy in special economic 'Tech-Zones'.";
    quotes = ["'Hyper-Loop Connectivity' initiative aims to reduce travel time between major economic hubs by 70%.", "'Tech-Zone Autonomy', allowing special economic zones to operate with minimal regulatory oversight."];
  }

  return {
    answer: summary,
    quotes: quotes,
    isNeutral: true,
    citations: [`Official Manifesto 2026: ${manifesto.name} (${manifesto.party})`]
  };
};
