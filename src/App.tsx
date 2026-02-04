import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CLICKS_TO_FILL = 10;
const HEART_PATH =
  "M 50 88 C 50 88 8 58 8 36 C 8 18 24 8 50 28 C 76 8 92 18 92 36 C 92 58 50 88 50 88 Z";
// Heart vertical extent in viewBox (path y from 8 to 88)
const HEART_TOP = 8;
const HEART_BOTTOM = 88;
const HEART_HEIGHT = HEART_BOTTOM - HEART_TOP;

const springFill = {
  type: "spring" as const,
  stiffness: 320,
  damping: 28,
};

const springTap = {
  type: "spring" as const,
  stiffness: 400,
  damping: 25,
};

function getVisibleFillPercent(linearPercent: number): number {
  const t = Math.min(1, linearPercent / 100);
  // Very aggressive early fill - red visible at first click
  return 100 * Math.pow(t, 0.25);
}

function App() {
  const [clicks, setClicks] = useState(0);
  const fillPercent = Math.min(100, (clicks / CLICKS_TO_FILL) * 100);
  const visibleFillPercent = getVisibleFillPercent(fillPercent);
  const isFullyFilled = fillPercent >= 100;

  const handleHeartClick = useCallback(() => {
    if (isFullyFilled) return;
    setClicks((c) => Math.min(CLICKS_TO_FILL, c + 1));
  }, [isFullyFilled]);

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 touch-manipulation select-none">
      <motion.div
        className="relative w-full max-w-[min(90vw,360px)] aspect-square flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.svg
          viewBox="0 0 100 100"
          className="relative w-full h-full drop-shadow-lg cursor-pointer z-10"
          style={{ touchAction: "manipulation" }}
          onClick={handleHeartClick}
          aria-label="Tap to fill the heart"
          whileTap={isFullyFilled ? undefined : { scale: 0.97 }}
          transition={springTap}
        >
          <defs>
            <clipPath id="heartClip">
              <path d={HEART_PATH} />
            </clipPath>
            <clipPath id="fillClip">
              <motion.rect
                x={0}
                y={HEART_BOTTOM - (HEART_HEIGHT * visibleFillPercent) / 100}
                width={100}
                height={(HEART_HEIGHT * visibleFillPercent) / 100}
                initial={false}
                animate={{
                  y: HEART_BOTTOM - (HEART_HEIGHT * visibleFillPercent) / 100,
                  height: (HEART_HEIGHT * visibleFillPercent) / 100,
                }}
                transition={springFill}
              />
            </clipPath>
          </defs>

          {/* Red fill: clipped from bottom to top (heart shape ∩ rect) */}
          {!isFullyFilled && (
            <motion.path
              d={HEART_PATH}
              fill="#dc2626"
              clipPath="url(#fillClip)"
              initial={false}
              transition={springFill}
            />
          )}

          {/* Fully filled red heart when at 100% */}
          {isFullyFilled && (
            <motion.path
              d={HEART_PATH}
              fill="#dc2626"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            />
          )}

          {/* Image inside heart: visible when fully filled, clipped to heart */}
          <AnimatePresence>
            {isFullyFilled && (
              <motion.g
                key="heartImage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.2,
                }}
                clipPath="url(#heartClip)"
              >
                <motion.image
                  href="/final.jpg"
                  x={0}
                  y={0}
                  width={100}
                  height={100}
                  preserveAspectRatio="xMidYMid slice"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 24,
                    delay: 0.35,
                  }}
                />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Outline: thick stroke on top so it’s always visible */}
          <motion.path
            d={HEART_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            className="text-stone-300"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </motion.svg>
      </motion.div>

      {!isFullyFilled && (
        <motion.p
          className="mt-6 text-stone-400 text-sm text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Trykk på hjertet · {clicks}/{CLICKS_TO_FILL}
        </motion.p>
      )}
    </main>
  );
}

export default App;
