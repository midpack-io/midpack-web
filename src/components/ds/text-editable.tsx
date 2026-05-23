"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type TextEditableProps = {
  value: string;
  onChange?: (next: string) => void;
  className?: string;
  ariaLabel?: string;
};

export function TextEditable({
  value,
  onChange,
  className,
  ariaLabel,
}: TextEditableProps) {
  const [draft, setDraft] = useState(value);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    const next = draft.trim();
    if (next.length > 0 && next !== value) {
      onChange?.(next);
    } else {
      setDraft(value);
    }
    setEditing(false);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  };

  // Both idle and edit modes share the same outer box (px-[6px] py-[3px])
  // so toggling between them never changes height — vertical neighbors stay
  // put. No border or ring; the only delta on entering edit mode is the
  // background color.
  const frame = "m-0 -mx-[6px] -my-[3px] rounded-[6px] px-[6px] py-[3px]";

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        aria-label={ariaLabel ?? "Edit text"}
        className={cn(
          frame,
          "w-[calc(100%+12px)] bg-accent-soft",
          "border-0 outline-none ring-0",
          className,
        )}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
      aria-label={ariaLabel ?? `Edit ${value}`}
      className={cn(
        "group/text-editable inline-flex items-center self-start text-left cursor-text",
        frame,
        "transition-colors duration-150",
        "hover:bg-surface-2",
        "focus-visible:outline-none",
      )}
    >
      <span
        className={cn(
          "decoration-zinc-300 decoration-dotted underline-offset-[5px] transition-[text-decoration]",
          "group-hover/text-editable:underline",
          className,
        )}
      >
        {value}
      </span>
    </button>
  );
}
