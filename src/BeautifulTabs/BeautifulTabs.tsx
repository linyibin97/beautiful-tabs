import { useEffect, useMemo, useRef, useState } from "react";
import "./BeautifulTabs.css";

interface BeautifulTabsProps {
  list: string[];
  tabWidth?: number | string;
}

function BeautifulTabs({ list, tabWidth = "6rem" }: BeautifulTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setcontainerWidth] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const _tabWidth =
    typeof tabWidth === "string"
      ? parseInt(tabWidth) *
        parseInt(window.getComputedStyle(document.documentElement).fontSize)
      : tabWidth;
  const totalWidth = list.length * _tabWidth;
  const foldWidth = 0.1 * _tabWidth;
  const maxFoldNum = 4;

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    const newOffset = Math.max(
      0,
      Math.min(offset + e.deltaX, totalWidth - containerWidth)
    );
    setOffset(newOffset);
  };

  const tabStyle = useMemo<React.CSSProperties[]>(() => {
    const beforeEndIndex = Math.floor(offset / _tabWidth);
    const beforeStartIndex = Math.max(0, beforeEndIndex - maxFoldNum);

    const afterEndIndex =
      list.length -
      Math.floor((totalWidth - containerWidth - offset) / _tabWidth);
    const afterStartIndex = Math.min(
      afterEndIndex + maxFoldNum,
      list.length - 1
    );

    const res = list.map((_value, index) => {
      if (index < beforeStartIndex) {
        return {
          left: -foldWidth,
          width: foldWidth,
          color: "#fff",
        };
      }
      if (index > afterStartIndex) {
        return {
          left: containerWidth,
          width: foldWidth,
          color: "#fff",
        };
      }
      return {
        width: _tabWidth,
        left: index * _tabWidth - offset,
        color: "#fff",
      };
    });

    let left = 0;
    for (let i = beforeStartIndex; i < list.length; i++) {
      const width =
        i < beforeEndIndex
          ? foldWidth
          : Math.max(foldWidth, -left + res[i].left + _tabWidth);

      if (width >= _tabWidth) break;

      res[i] = {
        ...res[i],
        left,
        width,
        color: "red",
      };

      left += width;
    }

    let right = 0;
    for (let i = afterStartIndex; i >= 0; i--) {
      const width =
        i > afterEndIndex
          ? foldWidth
          : Math.max(
              foldWidth,
              -right - (res[i].left + _tabWidth - containerWidth) + _tabWidth
            );

      if (width >= _tabWidth) break;

      res[i] = {
        ...res[i],
        left: containerWidth - right - width,
        width,
        color: "red",
      };

      right += width;
    }

    return res;
  }, [_tabWidth, containerWidth, foldWidth, list, offset, totalWidth]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      setcontainerWidth(entries[0].contentRect.width);
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="tabs__container" onWheel={handleWheel}>
      {list.map((item, index) => {
        return (
          <div
            key={index}
            className="tabs__item"
            ref={(ref) => (itemRefs.current[index] = ref)}
            style={tabStyle[index]}
          >
            {`${index}_${item}`}
          </div>
        );
      })}
    </div>
  );
}

export default BeautifulTabs;
