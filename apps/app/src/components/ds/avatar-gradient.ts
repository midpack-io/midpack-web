import type { AvatarKey } from "@/lib/api/types";

// Per-person gradient classes used by every avatar surface in the app.
// Mirrors the .av-* gradients in design_handoff_midpack/prototypes/.
export const AVATAR_GRADIENT: Record<AvatarKey, string> = {
  anna: "bg-gradient-to-br from-[#c08a9a] to-[#8a4e64]",
  olena: "bg-gradient-to-br from-[#6a8eb5] to-[#3d5d86]",
  lina: "bg-gradient-to-br from-[#d1b8a3] to-[#a18062]",
  pavlo: "bg-gradient-to-br from-[#a37cd1] to-[#6b4ba1]",
  yuri: "bg-gradient-to-br from-[#c4955a] to-[#87622f]",
  marta: "bg-gradient-to-br from-[#b69b85] to-[#7a5e44]",
  roma: "bg-gradient-to-br from-[#6e9b8a] to-[#3f6a5a]",
  yulia: "bg-gradient-to-br from-[#c08aaf] to-[#7a4769]",
  founder: "bg-gradient-to-br from-[#a37cd1] to-[#6b4ba1]",
};
