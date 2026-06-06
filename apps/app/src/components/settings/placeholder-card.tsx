/** Empty-state card for settings sub-pages that are intentionally out of scope.
 *  Copy is identical to design_handoff_settings_redesign/settings.html. */
export function PlaceholderCard() {
  return (
    <div className="mb-[24px] flex max-w-[580px] items-center gap-[18px] rounded-[12px] border border-dashed border-border-strong bg-surface-2 px-[28px] py-[36px]">
      <div
        aria-hidden
        className="inline-flex size-[44px] shrink-0 items-center justify-center rounded-full bg-surface-3 text-[20px] text-zinc-500"
      >
        ↗
      </div>
      <div className="flex flex-col gap-[4px] text-[13px] text-zinc-500">
        <strong className="text-[14px] font-semibold text-foreground">
          Not part of this delivery
        </strong>
        <span>
          This Settings page is intentionally empty. The page chrome, sidebar nav
          entry, active state, and routing should all work — implement the actual
          page contents in a follow-up.
        </span>
      </div>
    </div>
  );
}
