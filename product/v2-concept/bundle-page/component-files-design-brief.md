# Component Files — Design Brief

Short brief for Claude Design.

## What I want

Design a dedicated section (or sections) on the bundle page for **component files** — and make it visually distinct from the regular stage file sections.

## What a "component file" is

A component file is a file that lives in one canonical place and is **linked** into a bundle (or a group/collection of bundles), not copied into it. When someone edits the source, every bundle that references it picks up the new version automatically.

Think of it the same way Figma treats components: instances are linked to a master, and editing the master updates every instance.

## Where they appear

Two contexts, both need this section:

1. **Linked to the workflow / bundle** — component files attached to this specific bundle's workflow.
2. **Linked to the group (collection)** — component files inherited from the parent group/collection the bundle belongs to.

These can be one section with two groupings, or two separate sections — your call.

## Visual direction

- Use a **distinct accent color** to mark these as "linked, not owned" — purple is the reference (matches the Figma component metaphor users already know).
- The section container itself should look **a bit different** from the regular stage file sections — different background tint, border treatment, or header style — so it reads as "this is a different kind of asset" at a glance.
- Each component-file card/row should carry a small **linked / instance** indicator (icon + label) so it's clear at the file level too, not only at the section level.
- Don't go heavy — the section should feel like a calmer, contextual sibling to the main stage sections, not a louder competitor for attention.

## Behavior cues to surface in the design

- Source location ("Edited in <group/collection name>") — read-only here.
- "Last updated" timestamp from the source.
- Affordance to **open the source** (jump to where it can be edited), but no edit controls inline.

## Out of scope for this pass

- The editing flow itself (lives elsewhere — at the source).
- Versioning / rollback UI.
- Permissions UI.
