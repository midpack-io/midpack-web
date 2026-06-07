import { CfChip, CfChipAdd } from "./cf-chip";
import { cn } from "../lib/utils";
import type { CustomField } from "../lib/types";

type CustomFieldRowProps = {
  fields: CustomField[];
  onAddField?: () => void;
  className?: string;
};

// Flex-wrap row of custom-field chips followed by a persistent `+ FIELD` button.
// Renders even with zero fields — the add button is always the trailing item.
export function CustomFieldRow({
  fields,
  onAddField,
  className,
}: CustomFieldRowProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-[6px]",
        className,
      )}
    >
      {fields.map((cf) => (
        <CfChip
          key={cf.key}
          k={cf.key}
          v={
            cf.unset || !cf.value ? (
              <span className="text-zinc-400">— set {cf.key.toLowerCase()}</span>
            ) : (
              cf.value
            )
          }
        />
      ))}
      <CfChipAdd onClick={onAddField} />
    </div>
  );
}
