import { useEffect, useMemo, useRef, useState } from "react";
import "./BeautifulTabs.css";

interface BeautifulTabsProps {
  list: string[];
  tabWidth?: number | string;
  onClickTab?: (item: string, index: number) => void;
}

function BeautifulTabs({
  list,
  tabWidth = "6rem",
  onClickTab,
}: BeautifulTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setcontainerWidth] = useState<number>(0);
  const [currIndex, setCurrIndex] = useState<number>(0);
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

  const tabStyle = useMemo<React.CSSProperties[]>(() => {
    const beforeEndIndex = Math.floor(offset / _tabWidth);
    const beforeStartIndex = Math.max(0, beforeEndIndex - maxFoldNum);

    const afterEndIndex =
      list.length -
      1 -
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
        };
      }
      if (index > afterStartIndex) {
        return {
          left: containerWidth,
          width: foldWidth,
        };
      }
      return {
        width: _tabWidth,
        left: index * _tabWidth - offset,
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
      };

      right += width;
    }

    return res;
  }, [_tabWidth, containerWidth, foldWidth, list, offset, totalWidth]);

  const setOffsetSafely = (offset: number) => {
    setOffset(Math.max(0, Math.min(offset, totalWidth - containerWidth)));
  };

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = mergeWheelEvents(
    (e, deltaX, deltaY) => {
      const delta = deltaX || deltaY;
      setOffsetSafely(offset + delta);
    }
  );

  const handleClickTab = (item: string, index: number) => {
    setCurrIndex(index);

    if (index * _tabWidth - offset < 0) {
      setOffsetSafely(index * _tabWidth);
    }
    if ((index + 1) * _tabWidth - offset > containerWidth) {
      setOffsetSafely((index + 1) * _tabWidth - containerWidth);
    }

    onClickTab && onClickTab(item, index);
  };

  useEffect(() => {
    if (offset + containerWidth > totalWidth || offset < 0) {
      setOffsetSafely(offset);
    }
  }, [totalWidth, containerWidth]);

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
            className={[
              "tabs__item",
              index === currIndex ? "tabs__curr" : "",
            ].join(" ")}
            ref={(ref) => (itemRefs.current[index] = ref)}
            style={tabStyle[index]}
            onClick={() => handleClickTab(item, index)}
          >
            {`${item}`}
          </div>
        );
      })}
    </div>
  );
}

function mergeWheelEvents(
  handleWheelEvent: (
    event: React.WheelEvent<HTMLDivElement>,
    deltaX: number,
    deltaY: number
  ) => void
): React.WheelEventHandler<HTMLDivElement> {
  let rafId: number | null = null;
  let sumDeltaX = 0;
  let sumDeltaY = 0;

  return (event: React.WheelEvent<HTMLDivElement>) => {
    const wheelEvent = event;
    sumDeltaX += wheelEvent.deltaX;
    sumDeltaY += wheelEvent.deltaY;

    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        handleWheelEvent(wheelEvent, sumDeltaX, sumDeltaY);
        sumDeltaX = 0;
        sumDeltaY = 0;
        rafId = null;
      });
    }
  };
}

export default BeautifulTabs;
