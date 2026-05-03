/**
 * Power Service
 * Manages the Hierarchy Tree and Gemini-powered role information.
 */

export const POWER_HIERARCHY = [
  {
    level: 1,
    title: "THE CITIZEN",
    roles: [
      { id: 'voter', label: 'THE VOTER', level: 'Base' }
    ]
  },
  {
    level: 2,
    title: "LEGISLATIVE",
    roles: [
      { id: 'mla', label: 'MLA', level: 'State Legislative' },
      { id: 'mp', label: 'MP', level: 'Union Legislative' }
    ]
  },
  {
    level: 3,
    title: "EXECUTIVE",
    roles: [
      { id: 'cm', label: 'CM', level: 'State Executive' },
      { id: 'pm', label: 'PM', level: 'Union Executive' }
    ]
  },
  {
    level: 4,
    title: "HEAD OF STATE",
    roles: [
      { id: 'president', label: 'PRESIDENT', level: 'Union Head' }
    ]
  }
];

// Simulated Gemini 1.5 Flash Role Engine with Article Citations
export const fetchRoleInfo = async (roleId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const summaries = {
    voter: "The Voter is the foundation of Indian democracy. Article 326 of the Constitution grants universal adult suffrage, empowering every citizen aged 18+ to choose their representatives. Power flows directly from your ballot to the Parliament. (38 words)",
    mla: "A Member of Legislative Assembly represents citizens in state governments. Article 170 governs their election. They are directly elected by voters in specific constituencies to frame state laws and oversee the executive. (34 words)",
    mp: "A Member of Parliament represents citizens in the Lok Sabha. Article 81 governs their direct election by the people. They are responsible for making union laws and ensuring the executive's accountability to the public. (36 words)",
    cm: "The Chief Minister is the elected head of a state executive. Article 164 provides for their appointment by the Governor after winning a majority in the Assembly. They lead the state's council of ministers and administration. (38 words)",
    pm: "The Prime Minister is the real executive head of India. Article 75 states they are appointed by the President after commanding a majority in the Lok Sabha. They lead the Union Cabinet and govern the nation. (39 words)",
    president: "The President is the formal Head of State and supreme commander. Article 52 establishes the office. Elected via an electoral college (Article 54), they signify the unity and integrity of the Republic of India. (37 words)"
  };

  return summaries[roleId] || "Information pending for this democratic role. Consult the Constitution of India for specific mandates and electoral processes. (18 words)";
};
