import { memo, useState, useRef, useEffect } from "react";
import SearchProducts from "../SearchProducts/SearchProducts";
import s from "./SearchProductWrapper.module.scss";

const SearchProductWrapper = memo(({ product, index = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  // Safety check
  if (!product) {
    return null;
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <div
      ref={elementRef}
      className={`${s.wrapper} ${isVisible ? s.visible : s.hidden}`}
      style={{
        animationDelay: `${index * 0.1}s`,
        transitionDelay: `${index * 0.05}s`,
      }}
    >
      {isVisible && <SearchProducts product={product} />}
    </div>
  );
});

SearchProductWrapper.displayName = "SearchProductWrapper";

export default SearchProductWrapper;
