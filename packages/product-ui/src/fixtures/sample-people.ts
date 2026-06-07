import type { Person, PersonId } from "../lib/types";

// Static roster for showcases (the marketing hero). Mirrors the app's demo
// people so the avatars on the shared product row look real. This is plain
// exported data — no data layer.
export const SAMPLE_PEOPLE: Person[] = [
  { id: "p-anna" as PersonId, name: "Anna Kovalenko", initial: "AK", avatarKey: "anna", role: "manager" },
  { id: "p-olena" as PersonId, name: "Olena Kravchuk", initial: "OK", avatarKey: "olena", role: "approver" },
  { id: "p-lina" as PersonId, name: "Lina Voloshyn", initial: "LV", avatarKey: "lina", role: "performer" },
  { id: "p-pavlo" as PersonId, name: "Pavlo Sydorenko", initial: "PS", avatarKey: "pavlo", role: "performer" },
  { id: "p-yuri" as PersonId, name: "Yuri Bondar", initial: "YB", avatarKey: "yuri", role: "performer" },
  { id: "p-marta" as PersonId, name: "Marta Lysenko", initial: "M", avatarKey: "marta", role: "performer" },
  { id: "p-yulia" as PersonId, name: "Yulia Marchenko", initial: "Y", avatarKey: "yulia", role: "performer" },
  { id: "p-founder" as PersonId, name: "Brand owner", initial: "B", avatarKey: "founder", role: "approver" },
];

export function indexSamplePeople(): Map<PersonId, Person> {
  return new Map(SAMPLE_PEOPLE.map((p) => [p.id, p]));
}
