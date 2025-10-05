import { createRef, useEffect, useRef } from "react";
import { AnimatedBox } from "./animatedBox";

interface AnimationProps {
  words: string[];
  duration: number;
  pauseDuration: number;
  inactiveBoxColor: string;
  activeBoxColor: string;
  backgroundColor: string;
  lineColor: string;
  linePadding: number;
}

export const Animation = ({
  words,
  duration,
  pauseDuration,
  inactiveBoxColor,
  activeBoxColor,
  backgroundColor,
  lineColor,
  linePadding,
}: AnimationProps) => {
  const refs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  if (refs.current.length !== words.length) {
    // Initialize refs array only once
    refs.current = Array(words.length)
      .fill(null)
      .map(() => createRef<HTMLDivElement>());
  }

  const lineRefs = useRef<React.RefObject<SVGLineElement>[]>([]);
  if (lineRefs.current.length !== words.length - 1) {
    // Initialize refs array only once
    lineRefs.current = Array(words.length - 1)
      .fill(null)
      .map(() => createRef<SVGLineElement>());
  }

  const config = [
    {
      startPosition: { x: 0, y: 0 },
      toPosition: { x: -100, y: 0 },
      nextPositions: [
        { x: -200, y: -100 },
        { x: -280, y: -120 },
        { x: -300, y: -140 },
      ].slice(0, words.length - 1),
      word: words[0],
    },
    {
      startPosition: { x: -20, y: 0 },
      toPosition: { x: 200, y: -70 },
      nextPositions: [
        { x: 250, y: -100 },
        { x: 330, y: -140 },
      ].slice(0, words.length - 2),
      word: words[1],
    },
    {
      startPosition: { x: -50, y: 0 },
      toPosition: { x: -100, y: 50 },
      nextPositions: [{ x: -200, y: 40 }].slice(0, words.length - 3),
      word: words[2],
    },
    {
      startPosition: { x: 180, y: 80 },
      toPosition: { x: 150, y: 120 },
      nextPositions: [],
      word: words[3],
    },
  ];

  useEffect(() => {
    let frameId: number;
    const updateLine = () => {
      lineRefs.current.map((item, i) => {
        const refA = refs.current[i]?.current;
        const refB = refs.current[i + 1]?.current;
        if (!(refA instanceof Element) || !(refB instanceof Element)) {
          return item;
        }
        const line = item.current;
        const opacityA = window
          .getComputedStyle(refA)
          .getPropertyValue("opacity");
        const opacityB = window
          .getComputedStyle(refB)
          .getPropertyValue("opacity");
        const rectA = refA.getBoundingClientRect();
        const rectB = refB.getBoundingClientRect();
        const isBothVisible =
          parseFloat(opacityA) > 0 && parseFloat(opacityB) > 0;

        const x1 = rectA.left + rectA.width + linePadding;
        const y1 = rectA.top + rectA.height + linePadding;
        const x2 = rectB.left - linePadding;
        const y2 = rectB.top - linePadding;
        const opacity = isBothVisible ? 1 : 0;
        line.setAttribute("x1", x1.toString());
        line.setAttribute("y1", y1.toString());
        line.setAttribute("x2", x2.toString());
        line.setAttribute("y2", y2.toString());
        line.setAttribute("stroke", lineColor);
        line.setAttribute("stroke-width", "2");
        line.setAttribute("opacity", opacity.toString());
      });
      frameId = requestAnimationFrame(updateLine);
    };
    updateLine();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        background: backgroundColor,
      }}
    >
      <svg style={svgStyle}>
        {lineRefs.current.map((_line, i) => {
          return <line key={i} ref={lineRefs.current[i]} />;
        })}
      </svg>
      {refs.current.map((ref, i) => {
        return (
          <AnimatedBox
            key={config[i].word}
            boxRef={ref}
            startPosition={config[i].startPosition}
            toPosition={config[i].toPosition}
            nextPositions={config[i].nextPositions}
            inactiveBoxColor={inactiveBoxColor}
            activeBoxColor={activeBoxColor}
            delay={(duration + pauseDuration) * i}
            pauseDuration={pauseDuration}
            duration={duration}
            text={config[i].word}
          />
        );
      })}
    </div>
  );
};

const svgStyle = {
  position: "absolute" as const,
  left: 0,
  top: 0,
  width: "100vw",
  height: "100vh",
  pointerEvents: "none" as const,
};
