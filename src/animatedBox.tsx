import React, { useEffect, type RefObject } from "react";
import { useAnimation } from "motion/react";
import * as motion from "motion/react-client";

interface Coord {
  x: number;
  y: number;
}

interface AnimatedBoxProps {
  boxRef: RefObject<HTMLDivElement | null>;
  startPosition: Coord;
  toPosition: Coord;
  nextPositions: Coord[];
  inactiveBoxColor: string;
  activeBoxColor: string;
  delay: number;
  duration: number;
  pauseDuration: number;
  text: string;
}

export const AnimatedBox = ({
  boxRef,
  startPosition,
  toPosition,
  nextPositions,
  inactiveBoxColor,
  activeBoxColor,
  delay,
  duration,
  pauseDuration,
  text,
}: AnimatedBoxProps) => {
  const controls = useAnimation();

  useEffect(() => {
    async function sequence() {
      await controls.start({
        x: toPosition.x,
        y: toPosition.y,
        opacity: 1,
        transition: {
          duration: duration,
          delay: delay,
          ease: "easeOut",
        },
      });
      for (let i = 0; i < nextPositions.length; i++) {
        await controls.start({
          backgroundColor: inactiveBoxColor,
          x: nextPositions[i].x,
          y: nextPositions[i].y,
          transition: {
            delay: pauseDuration,
            duration: duration,
            ease: "easeOut",
          },
        });
      }
    }
    sequence();
  }, [
    controls,
    toPosition,
    nextPositions,
    duration,
    pauseDuration,
    inactiveBoxColor,
    delay,
  ]);

  return (
    <motion.div
      ref={boxRef}
      style={boxStyle}
      animate={controls}
      initial={{
        opacity: 0,
        x: startPosition.x,
        y: startPosition.y,
        backgroundColor: activeBoxColor,
      }}
    >
      {text}
    </motion.div>
  );
};

const boxStyle = {
  position: "absolute" as const,
  fontSize: "40px",
  left: "50%",
  top: "50%",
  padding: "4px 12px",
  borderRadius: "4px",
};
