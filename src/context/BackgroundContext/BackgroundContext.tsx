import React, { createContext, useContext, useState } from "react";

type BackgroundContextType = {
  image: string | undefined;
  setImage: (src: string | undefined) => void;
};

const BackgroundContext = createContext<BackgroundContextType>({
  image: undefined,
  setImage: () => {},
});

export const useBackground = () => useContext(BackgroundContext);

export const BackgroundProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [image, setImage] = useState<string | undefined>(undefined);

  return (
    <BackgroundContext.Provider value={{ image, setImage }}>
      {children}
    </BackgroundContext.Provider>
  );
};
