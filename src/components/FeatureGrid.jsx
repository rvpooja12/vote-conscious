import { 
  ClipboardCheck, 
  Map, 
  CheckSquare, 
  Search, 
  FileText, 
  Award 
} from 'lucide-react';
import FeatureCard from './FeatureCard';

const features = [
  {
    title: "Smart Registration",
    description: "Real-time, AI-curated registration protocols dynamically synced with the latest ECI guidelines.",
    icon: ClipboardCheck,
    link: "/register"
  },
  {
    title: "Power Mapper",
    description: "Visualize how your vote moves from the booth to the Parliament. Trace the hierarchy of power.",
    icon: Map,
    link: "/power-mapper"
  },
  {
    title: "The Election Pulse",
    description: "An interactive, save-state checklist. Monitor your progress and deadlines through the 2026 cycle.",
    icon: CheckSquare,
    link: "/pulse"
  },
  {
    title: "Booth Finder",
    description: "Instant lookup. Provide your EPIC ID to see your specific polling room and real-time candidate data.",
    icon: Search,
    link: "/booth-finder"
  },
  {
    title: "Manifesto Analyst",
    description: "Objective, AI-powered summaries of party promises. Get cited answers to your specific policy questions.",
    icon: FileText,
    link: "/manifesto"
  },
  {
    title: "The Indelible Badge",
    description: "Scan your ink and verify your location to generate a custom, secure 2026 digital voting certificate.",
    icon: Award,
    link: "/badge"
  }
];

const FeatureGrid = () => {
  return (
    <section className="nike-container">
      <div className="grid-container">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            {...feature}
          />
        ))}
      </div>
    </section>
  );
};

export default FeatureGrid;
