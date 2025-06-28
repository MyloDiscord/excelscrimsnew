"use client";

import React, { createContext, useContext, useState } from "react";

type TopbarContextType = {
  content: React.ReactNode;
  setContent: (content: React.ReactNode) => void;
};

const TopbarContext = createContext<TopbarContextType>({
  content: null,
  setContent: () => {},
});

export function TopbarProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<React.ReactNode>(null);
  return (
    <TopbarContext.Provider value={{ content, setContent }}>
      {children}
    </TopbarContext.Provider>
  );
}

export function useTopbar() {
  return useContext(TopbarContext);
}
