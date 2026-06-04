"use client";

import { createContext, useContext, type ReactNode } from "react";

// Bridges a click on an inline file-mention chip (deep in the comments subtree)
// to the file panel (a sibling subtree). The chip emits; the workspace pane
// decides what to do (highlight a file in the left panel). Default is a no-op so
// FileChip keeps working on the /components reference route and anywhere without
// a provider.
type CiteFn = (fileName?: string) => void;

const FileCiteContext = createContext<CiteFn>(() => {});

export function FileCiteProvider({
  onCite,
  children,
}: {
  onCite: CiteFn;
  children: ReactNode;
}) {
  return (
    <FileCiteContext.Provider value={onCite}>
      {children}
    </FileCiteContext.Provider>
  );
}

export function useFileCite(): CiteFn {
  return useContext(FileCiteContext);
}
