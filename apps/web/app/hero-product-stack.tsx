"use client";

import * as React from "react";
import {
  PeopleProvider,
  ProductNavProvider,
  ProductRow,
  SAMPLE_PRODUCTS,
  TooltipProvider,
  indexSamplePeople,
} from "@midpack/product-ui";
import { getAppUrls } from "@midpack/ui";

// The hero centerpiece: the REAL product row (the same component the app
// renders), fed static sample data via context — no react-query, no MSW. The
// steppers animate on hover exactly as in the app; clicking a row sends the
// visitor into the app's sign-up (`interactive={false}` keeps the inline
// status/person editors off, so the row is a clean click-through).
export function HeroProductStack() {
  const peopleMap = React.useMemo(() => indexSamplePeople(), []);

  const openInApp = React.useCallback(() => {
    window.location.href = `${getAppUrls().app}/signup`;
  }, []);

  return (
    <TooltipProvider delayDuration={200}>
      <PeopleProvider value={peopleMap}>
        <ProductNavProvider onOpenProduct={openInApp}>
          <div className="flex min-w-0 flex-col">
            {SAMPLE_PRODUCTS.map((product, i) => (
              <div
                key={product.id}
                // The animated wrapper (transform) clips the row card's shadow at
                // its bounds. Pad all sides so the shadow has room; the negative
                // vertical margin reclaims the doubled spacing so the inter-card
                // gap stays 14px (the overlap is between transparent pad zones).
                className="animate-in fade-in-0 slide-in-from-bottom-4 fill-mode-both p-[14px] -my-[7px]"
                style={{ animationDuration: "700ms", animationDelay: `${i * 110}ms` }}
              >
                <ProductRow product={product} peopleMap={peopleMap} interactive={false} />
              </div>
            ))}
          </div>
        </ProductNavProvider>
      </PeopleProvider>
    </TooltipProvider>
  );
}
