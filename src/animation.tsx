import * as motion from "motion/react-client";
import { useEffect, useRef, useState } from "react";

const appendNulls = (arr: (number | null)[]) => {
  const ret: (number | null)[] = [];
  arr.forEach((item, i) => {
    if (i > 1) {
      ret.push(null);
    }
    ret.push(item);
  });
  return ret;
};

interface AnimationProps {
  words: string[];
  duration: number;
  inactiveBoxColor: string;
  activeBoxColor: string;
  backgroundColor: string;
  lineColor: string;
  linePadding: number;
}

export const Animation = ({
  words,
  duration,
  inactiveBoxColor,
  activeBoxColor,
  backgroundColor,
  lineColor,
  linePadding,
}: AnimationProps) => {
  const refs = useRef<HTMLDivElement[]>([]);
  const [lines, setLines] = useState(
    Array.from(Array(words.length - 1)).map(() => {
      return {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        opacity: 0,
      };
    })
  );
  const backgroundColorAnimation = [
    inactiveBoxColor,
    activeBoxColor,
    activeBoxColor,
    inactiveBoxColor,
  ];

  const config = [
    {
      x: [0, -100, -200, -280, -300],
      y: [0, null, -100, -120, -140],
    },
    {
      x: [null, -20, 200, 250, 330],
      y: [null, null, -70, -100, -140],
    },
    {
      x: [null, null, -50, -100, -200],
      y: [null, null, null, 50, 40],
    },
    {
      x: [null, null, null, 170, 150],
      y: [null, null, null, 80, 120],
    },
  ];
  const boxes = words.map((word, index) => {
    const xArray = config[index].x.slice(0, words.length + 1);
    const yArray = config[index].y.slice(0, words.length + 1);
    return {
      path: {
        x: appendNulls(xArray),
        y: appendNulls(yArray),
        opacity: Array.from(Array(words.length * 2)).map((_x, i) =>
          i === index * 2 + 1 ? 1 : null
        ),
        backgroundColor: [
          ...Array.from(Array(index * 2)),
          ...backgroundColorAnimation,
          ...Array.from(Array((words.length - index) * 2)),
        ]
          .slice(0, -4)
          .map((x) => (!x ? null : x)),
      },
      text: word,
    };
  });
  console.log(boxes);
  // Update line coordinates on every animation frame
  useEffect(() => {
    function updateLine() {
      const updateLine2 = (
        refA: HTMLDivElement,
        refB: HTMLDivElement,
        lineIndex: number
      ) => {
        const opacityB = window
          .getComputedStyle(refB)
          .getPropertyValue("opacity");

        const opacityA = window
          .getComputedStyle(refB)
          .getPropertyValue("opacity");

        const rectA = refA.getBoundingClientRect();
        const rectB = refB.getBoundingClientRect();
        const isBothVisible =
          parseFloat(opacityA) > 0 && parseFloat(opacityB) > 0;

        setLines((prevValue) => {
          return prevValue.map((item, prevIndex) => {
            return prevIndex === lineIndex
              ? {
                  x1: rectA.left + rectA.width + linePadding,
                  y1: rectA.top + rectA.height + linePadding,
                  x2: rectB.left - linePadding,
                  y2: rectB.top - linePadding,
                  opacity: isBothVisible ? 1 : 0,
                }
              : item;
          });
        });
      };

      lines.forEach((_l, i) =>
        updateLine2(refs.current[i], refs.current[i + 1], i)
      );

      requestAnimationFrame(updateLine);
    }
    updateLine();
    // Cleanup not strictly needed since animation runs for app lifetime
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
      <svg
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
        }}
      >
        {lines.map((item, i) => {
          return (
            <line
              key={i}
              x1={item.x1}
              y1={item.y1}
              x2={item.x2}
              y2={item.y2}
              opacity={item.opacity}
              stroke={lineColor}
              strokeWidth={2}
            />
          );
        })}
      </svg>
      {boxes.map((x) => {
        return (
          <motion.div
            key={x.text}
            ref={(el) => {
              refs.current.push(el as HTMLDivElement);
            }}
            animate={x.path}
            initial={{ opacity: 0 }}
            transition={{
              duration: duration,
              ease: "linear",
            }}
            style={boxStyle}
          >
            {x.text}
          </motion.div>
        );
      })}
    </div>
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
