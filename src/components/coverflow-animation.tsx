import { PropsWithChildren, useEffect, useState } from "react";
import { Container } from "./container";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { range } from "@/lib/utils/range";

const IMAGES = [
  {
    id: 1,
    url: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg",
  },
  {
    id: 2,
    url: "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg",
  },
  {
    id: 3,
    url: "https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg",
  },
  {
    id: 4,
    url: "https://images.pexels.com/photos/1470405/pexels-photo-1470405.jpeg",
  },
  {
    id: 5,
    url: "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg",
  },
  {
    id: 6,
    url: "https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg",
  },
  {
    id: 7,
    url: "https://images.pexels.com/photos/1486974/pexels-photo-1486974.jpeg",
  },
  {
    id: 8,
    url: "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg",
  },
  {
    id: 9,
    url: "https://images.pexels.com/photos/1366630/pexels-photo-1366630.jpeg",
  },
  {
    id: 10,
    url: "https://images.pexels.com/photos/2486168/pexels-photo-2486168.jpeg",
  },
];

const MAX_ITEMS = 4;

export default function Carousel() {
  const [images, setImages] = useState(IMAGES);
  const [activeItemWidth, setActiveItemWidth] = useState<number>(60);
  const [currentIndex, setCurrentIndex] = useState(MAX_ITEMS);

  const scaleStep = 1 / MAX_ITEMS;
  const offsetStep = range(-3, MAX_ITEMS * 2 - 1).reduce(
    (acc: Record<number, number>, currentValue) => {
      acc[currentValue] =
        Math.sign(currentValue) * MAX_ITEMS - Math.abs(currentValue);
      return acc;
    },
    {}
  );

  function isBetween(value: number, start: number, stop: number) {
    return start <= value && value >= stop;
  }

  function isValidInterval(position: number) {
    return isBetween(position, -3, -1) || isBetween(position, 1, 3);
  }

  function computedOffset(position: number) {
    if (position !== 0 && position !== -1 && position !== 1) {
      return (
        (Math.abs(position) === MAX_ITEMS - 1 ? Math.abs(position) : 0) +
        range(1, Math.abs(position) + 1).reduce((acc, currentValue) => {
          if (offsetStep[currentValue]) {
            return acc + offsetStep[currentValue];
          }
          return acc;
        }, 0)
      );
    }

    return 0;
  }

  function computedWidth(position: number) {
    return MAX_ITEMS - Math.abs(position) + 1;
  }

  function computedScale(position: number) {
    if (position === 0) {
      return 1;
    } else if (
      isValidInterval(position) ||
      position === -3 ||
      position === -2
    ) {
      return 1 - scaleStep * Math.abs(position) + 0.1;
    }
    return 0;
  }

  function computedOpacity(position: number) {
    if (
      position === 0 ||
      position === -3 ||
      position === -2 ||
      isBetween(position, -3, -1)
    ) {
      return 1;
    }
    return 0;
  }

  function computedZIndex(position: number) {
    if (position !== 0) {
      return images.length - Math.abs(position);
    }
    return images.length + 1;
  }

  function onNext() {
    const imagesCopy = [...images];
    const firstItem = imagesCopy.shift();
    if (firstItem) {
      imagesCopy.push({ id: Date.now(), url: firstItem.url });
    }
    setImages(imagesCopy);
  }

  function onPrev() {
    const imagesCopy = [...images];
    const lastItem = imagesCopy.pop();
    if (lastItem) {
      imagesCopy.unshift({ id: Date.now(), url: lastItem.url });
    }
    setImages(imagesCopy);
  }

  return (
    <Container>
      <div className="relative h-screen w-full ">
        <Button onClick={onPrev} position="left">
          <ArrowLeft className="size-6 stroke-gray-900" />
        </Button>
        <Button onClick={onNext} position="right">
          <ArrowRight className="size-6 stroke-gray-900" />
        </Button>
        {images.map(({ url, id }, index) => {
          const shift = index - currentIndex;

          const width =
            shift === 0
              ? activeItemWidth + "rem"
              : Math.abs(shift) === MAX_ITEMS
              ? 0
              : computedWidth(shift) + "rem";

          return (
            <div
              key={id}
              style={
                {
                  "--width": width,
                  "--z-index": computedZIndex(shift),
                  "--shift": shift,
                  "--scale": computedScale(shift),
                  "--opacity": computedOpacity(shift),
                  "--skip":
                    shift === 0
                      ? "0rem"
                      : Math.sign(shift) *
                          (activeItemWidth / 2 +
                            computedWidth(shift) +
                            computedOffset(shift)) +
                        "rem",
                  "--height": "30rem",
                  width: "var(--width)",
                  zIndex: "var(--z-index)",
                  transform:
                    "translate(calc(-50% + var(--skip)), -50%) scale(var(--scale)",
                  opacity: "var(--opacity)",
                } as any
              }
              className="inline-block flex-none w-[--width] h-[--height] inset-1/2 aspect-video absolute transition-all  ease-in-out rounded-3xl overflow-hidden duration-700"
            >
              <img
                src={url}
                className="w-full h-full object-cover"
                // loading="lazy"
              />
            </div>
          );
        })}
      </div>
    </Container>
  );
}

function Button({
  children,
  position,
  onClick,
}: PropsWithChildren<{ position: "left" | "right"; onClick: () => void }>) {
  return (
    <button
      data-position={position}
      onClick={onClick}
      className="bg-white rounded-full p-1.5 shadow-gray-800 shadow-sm absolute data-[position=left]:left-2 data-[position=right]:right-2 bottom-1/2 translate-y-1/2 z-10"
    >
      {children}
    </button>
  );
}