import { useState, useEffect } from 'react';

export const useWindowSize = () => {
  const isClient = typeof window === 'object';

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

let size = useWindowSize();
export const clientWidth = () => {
  let temp = {
    width: 700,
    height: 700,
  }
  if (!size) {
    return temp;
  } else if(size) {
    return size.width < 550 ? 'column' : 'row';
  }
};