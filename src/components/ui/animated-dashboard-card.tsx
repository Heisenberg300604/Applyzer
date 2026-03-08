"use client";

import { motion, useReducedMotion } from "framer-motion";

interface AnimatedDashboardCardProps {
  // Content
  leftLabel?: string;
  rightLabel?: string;
  leftValue?: number;
  rightValue?: number;
  // Styling
  borderColor?: string;
  backgroundColor?: string;
  leftDotColor?: string;
  rightDotColor?: string;
  // Dots configuration
  outerDotsCount?: number;
  innerDotsCount?: number;
  // Animation controls
  enableAnimations?: boolean;
}

const defaultProps: Partial<AnimatedDashboardCardProps> = {
  leftLabel: "Total Applied",
  rightLabel: "Replies Received",
  leftValue: 5,
  rightValue: 0,
  borderColor: "border-gray-200",
  backgroundColor: "bg-white",
  leftDotColor: "#f97316",
  rightDotColor: "#0a0a0a",
  outerDotsCount: 48,
  innerDotsCount: 36,
  enableAnimations: true,
};

export function AnimatedDashboardCard(props: AnimatedDashboardCardProps) {
  const {
    leftLabel,
    rightLabel,
    leftValue,
    rightValue,
    borderColor,
    backgroundColor,
    leftDotColor,
    rightDotColor,
    outerDotsCount,
    innerDotsCount,
    enableAnimations,
  } = { ...defaultProps, ...props };

  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableAnimations && !shouldReduceMotion;

  // Generate circular dots positions
  const generateDots = (count: number, radius: number, centerX: number, centerY: number) => {
    const dots = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI;
      const x = Math.round((centerX + radius * Math.cos(angle)) * 1000) / 1000;
      const y = Math.round((centerY + radius * Math.sin(angle)) * 1000) / 1000;
      dots.push({ x, y, angle, delay: i * 0.02 });
    }
    return dots;
  };

  const outerDots = generateDots(outerDotsCount!, 120, 150, 150);
  const innerDots = generateDots(innerDotsCount!, 90, 150, 150);

  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const dotVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
    },
    visible: {
      opacity: 0.6,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="w-full h-full"
      initial={shouldAnimate ? "hidden" : "visible"}
      animate="visible"
      variants={shouldAnimate ? containerVariants : {}}
    >
      <motion.div
        className={`${backgroundColor} ${borderColor} border-2 rounded-xl overflow-hidden shadow-lg h-full flex flex-col`}
      >
        {/* Title Section */}
        <div className="px-6 pt-4 pb-2">
          <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider">
            Application Stats
          </h3>
        </div>

        {/* Top Section - Dots Visualization */}
        <div className="relative flex-1 flex items-center justify-center py-2">
          <div className="relative">
            <svg className="w-44 h-44" viewBox="0 0 300 300">
              {/* Outer dots */}
              {outerDots.map((dot, index) => (
                <motion.circle
                  key={`outer-${index}`}
                  cx={dot.x}
                  cy={dot.y}
                  r="5"
                  fill="currentColor"
                  style={{ color: leftDotColor }}
                  variants={shouldAnimate ? dotVariants : {}}
                  initial="hidden"
                  animate="visible"
                />
              ))}

              {/* Inner dots */}
              {innerDots.map((dot, index) => (
                <motion.circle
                  key={`inner-${index}`}
                  cx={dot.x}
                  cy={dot.y}
                  r="5"
                  fill="currentColor"
                  style={{ color: rightDotColor }}
                  variants={shouldAnimate ? dotVariants : {}}
                  initial="hidden"
                  animate="visible"
                />
              ))}
            </svg>

            {/* Center Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  className="text-xs font-semibold text-gray-600 mb-1 tracking-wider"
                  initial={shouldAnimate ? { opacity: 0, y: -10, scale: 0.95 } : {}}
                  animate={shouldAnimate ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{
                    delay: 0.3,
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    mass: 0.6,
                  }}
                >
                  TOTAL
                </motion.div>
                <motion.div
                  className="text-3xl font-black text-gray-900"
                  initial={shouldAnimate ? { opacity: 0, y: 20, scale: 0.8, filter: "blur(4px)" } : {}}
                  animate={shouldAnimate ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
                  transition={{
                    delay: 0.5,
                    type: "spring",
                    stiffness: 300,
                    damping: 28,
                    mass: 0.8,
                  }}
                >
                  {(leftValue! + rightValue!).toLocaleString()}
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Stats */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left Stat */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-0.5 h-5 rounded-full"
                  style={{ backgroundColor: leftDotColor }}
                  initial={shouldAnimate ? { opacity: 0, scaleY: 0 } : {}}
                  animate={shouldAnimate ? { opacity: 1, scaleY: 1 } : {}}
                  transition={{ delay: 0.4, type: "spring" }}
                />
                <motion.div
                  className="text-xs font-semibold text-gray-600"
                  initial={shouldAnimate ? { opacity: 0, x: -20 } : {}}
                  animate={shouldAnimate ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 }}
                >
                  {leftLabel}
                </motion.div>
              </div>
              <motion.div
                className="text-2xl font-black text-gray-900 pl-3"
                initial={shouldAnimate ? { opacity: 0, y: -10 } : {}}
                animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
              >
                {leftValue!.toLocaleString()}
              </motion.div>
            </div>

            {/* Right Stat */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-0.5 h-5 rounded-full"
                  style={{ backgroundColor: rightDotColor }}
                  initial={shouldAnimate ? { opacity: 0, scaleY: 0 } : {}}
                  animate={shouldAnimate ? { opacity: 1, scaleY: 1 } : {}}
                  transition={{ delay: 0.8, type: "spring" }}
                />
                <motion.div
                  className="text-xs font-semibold text-gray-600"
                  initial={shouldAnimate ? { opacity: 0, x: -20 } : {}}
                  animate={shouldAnimate ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.9 }}
                >
                  {rightLabel}
                </motion.div>
              </div>
              <motion.div
                className="text-2xl font-black text-gray-900 pl-3"
                initial={shouldAnimate ? { opacity: 0, y: -10 } : {}}
                animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.0 }}
              >
                {rightValue!.toLocaleString()}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
