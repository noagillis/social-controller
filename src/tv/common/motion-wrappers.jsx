import { motion } from 'framer-motion';
import { motionObj_opacity } from '@/tv/utils/motion';

export const FadeInWrapper = ({ children, classNames = '' }) => {
  return (
    <motion.div {...motionObj_opacity} className={classNames}>
      {children}
    </motion.div>
  );
};
