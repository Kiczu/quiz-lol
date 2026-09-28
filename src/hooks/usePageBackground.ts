import { useEffect } from "react";

import { useBackground } from "../context/BackgroundContext/BackgroundContext";

const usePageBackground = (image: string) => {
  const { setImage } = useBackground();

  useEffect(() => {
    setImage(image);
    return () => setImage(undefined);
  }, [image, setImage]);
};

export default usePageBackground;
