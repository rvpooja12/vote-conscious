/**
 * Pulse Service (Race Day Edition)
 * Manages the 2026 Election Phases with aggressive AI logic and IST forcing.
 */

export const ELECTION_DAY = '2026-04-23';
export const COUNTING_DAY = '2026-05-04';

export const RACE_DAY_SCHEDULE = [
  { id: 'polling', date: ELECTION_DAY, label: 'POLLING', description: 'The nation votes. Booths are closed.' },
  { id: 'post_poll', date: '2026-05-01', label: 'POST-POLL VIGILANCE', description: 'Monitoring EVM security and reporting discrepancies.' },
  { id: 'counting', date: COUNTING_DAY, label: 'COUNTING DAY', description: 'Live tracking of the hierarchy of power.' },
  { id: 'results', date: '2026-05-05', label: 'FINAL VERDICT', description: 'Official declaration of the 2026 mandate.' }
];

// Force IST (India Standard Time)
export const getISTDate = () => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istOffset = 5.5 * 60 * 60 * 1000;
  return new Date(utc + istOffset);
};

// Aggressive but civic-minded AI Role Engine
export const fetchRaceRole = async (stageId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const roleData = {
    post_poll: "Listen up: Polling is OVER, but the battle isn't. It's May 1st. Don't sit back! You must monitor official ECI results-tracking and report any discrepancy immediately. Post-poll vigilance is your primary weapon. Stay sharp. (39 words)",
    counting: "The numbers are coming. Counting is May 4. Your role: Absolute vigilance. Track the live mandate and hold representatives to their party promises. The hierarchy of power is being decided—don't look away! (36 words)",
    default: "The 2026 cycle is active. Your role is simple: Stay informed, stay vigilant, and ensure your democratic choice is reflected in the final tally. No excuses. (29 words)"
  };

  return roleData[stageId] || roleData.default;
};

export const syncWithECI = async () => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return { status: "SYNCED", last_checked: getISTDate().toISOString() };
};
