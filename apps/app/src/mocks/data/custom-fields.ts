import type { CollectionId, CustomFieldDef } from "@/lib/api/types";

// Per-collection schema of custom fields. Each entry lists the field key, its
// display label, and the canonical set of values shown in the filter dropdown.
// Stage-2 backend should return this from GET /collections/:id/custom-fields,
// derived either from a workspace schema or from the union of values currently
// in use on products.

const SPRING_2026_FIELDS: CustomFieldDef[] = [
  {
    key: "Fabric",
    label: "Fabric",
    values: [
      "Cotton piqué 200gsm",
      "Cotton poplin 110gsm",
      "Cotton twill 220gsm",
      "Linen 180gsm",
      "Silk crêpe 19mm",
      "Tweed bouclé 320gsm",
      "Wool 240gsm",
      "Wool gabardine 280gsm",
    ],
  },
  {
    key: "MOQ",
    label: "MOQ",
    values: ["80", "90", "100", "120", "150"],
  },
  {
    key: "Cost",
    label: "Cost",
    values: ["€28", "€38", "€42", "€44", "€48", "€51", "€62"],
  },
  {
    key: "Trim",
    label: "Trim",
    values: ["Pearl btn ×6"],
  },
  {
    key: "Ship",
    label: "Ship",
    values: ["May 24"],
  },
];

export const CUSTOM_FIELDS_BY_COLLECTION: Map<CollectionId, CustomFieldDef[]> =
  new Map([["col-spring-2026" as CollectionId, SPRING_2026_FIELDS]]);
