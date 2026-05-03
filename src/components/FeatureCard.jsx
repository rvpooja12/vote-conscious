import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FeatureCard = ({ title, description, icon: Icon, delay, link }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="feature-card"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onClick={() => {
        console.log(`Feature clicked: ${title}`);
        if (link) navigate(link);
      }}
    >
      <Icon size={40} />
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
