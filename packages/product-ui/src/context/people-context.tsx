"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Person, PersonId } from "../lib/types";

// People are injected by the consuming app rather than fetched here, so the
// product components stay free of any data layer (react-query / MSW). The app
// feeds this from its `usePeople` query; the marketing site feeds static data.
const EMPTY: Map<PersonId, Person> = new Map();
const PeopleMapContext = createContext<Map<PersonId, Person>>(EMPTY);

export function PeopleProvider({
  value,
  children,
}: {
  value: Map<PersonId, Person>;
  children: ReactNode;
}) {
  return <PeopleMapContext.Provider value={value}>{children}</PeopleMapContext.Provider>;
}

// Map lookups — used by the stepper pill's performer avatar (id → person).
export function usePeopleMap(): Map<PersonId, Person> {
  return useContext(PeopleMapContext);
}

// List form — used by the person picker, which renders the full roster.
export function usePeopleList(): Person[] {
  return Array.from(useContext(PeopleMapContext).values());
}
