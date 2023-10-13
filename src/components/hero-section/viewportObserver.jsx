import React, { useEffect, useRef } from 'react';

const ViewportObserver = ({ children, className }) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add your class when the element enters the viewport
          ref.current.classList.add(className);
        }
      });
    }, {
      rootMargin: '0px 0px -100px 0px', // Adjust the margin values as needed
    });

    // Start observing the target element
    observer.observe(ref.current);

    // Clean up the observer when the component unmounts
    return () => {
      observer.disconnect();
    };
  }, [className]);

  return <div ref={ref}>{children}</div>;
};

export default ViewportObserver;
