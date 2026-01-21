import React from 'react';
import { motion, MotionValue } from 'framer-motion';

interface ScrollProgressProps {
    scaleX: MotionValue<number>;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({ scaleX }) => {
    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left"
            style={{ scaleX }}
        />
    );
};
