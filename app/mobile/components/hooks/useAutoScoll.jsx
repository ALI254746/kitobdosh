import { useEffect, useRef } from "react";

export default function useAutoScroll(speed = 0.1) {
  const ref = useRef(null);
  const paused = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId;

    const scroll = () => {
      if (!paused.current) {
        // RIGHT TO LEFT scroll
        el.scrollLeft -= speed;

        // cheksiz scroll
        if (el.scrollLeft <= 0) {
          el.scrollLeft = el.scrollWidth - el.clientWidth;
        }
      }
      rafId = requestAnimationFrame(scroll);
    };

    rafId = requestAnimationFrame(scroll);

    // 🖱 Desktop — hover pause
    const onMouseEnter = () => (paused.current = true);
    const onMouseLeave = () => (paused.current = false);

    // 📱 Mobile — tap / touch pause
    const onTouchStart = () => (paused.current = true);
    const onTouchEnd = () => {
      setTimeout(() => (paused.current = false), 1500);
    };

    el.addEventListener("mouseenter", onMouseEnter);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("mouseenter", onMouseEnter);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [speed]);

  return ref;
}
