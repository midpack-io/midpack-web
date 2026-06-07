"use client";

import { createContext, useContext, type ReactNode } from "react";

// Navigation is injected so the row stays free of any router. The customer app
// passes `router.push`; the marketing site passes a cross-app link to sign-up.
// Default is a no-op, so a row rendered without a provider simply doesn't navigate.
type OpenProduct = (href: string) => void;

const NavContext = createContext<OpenProduct>(() => {});

export function ProductNavProvider({
  onOpenProduct,
  children,
}: {
  onOpenProduct: OpenProduct;
  children: ReactNode;
}) {
  return <NavContext.Provider value={onOpenProduct}>{children}</NavContext.Provider>;
}

export function useProductNav(): OpenProduct {
  return useContext(NavContext);
}
