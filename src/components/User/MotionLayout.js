import { motion } from 'framer-motion';

const MotionLayout = ({ children }) => {
   const variants = {
      visible: { y: 0, opacity: 1, transition: { duration: 1 } },
      hidden: { y: 50, opacity: 0 },
   };

   return (
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={variants}>
         {children}
      </motion.div>
   );
};

export default MotionLayout;
