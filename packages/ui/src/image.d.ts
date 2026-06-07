// Static image imports (e.g. `import hero from "./assets/x.jpg"`) resolve to
// Next.js image metadata. The apps get this declaration from their own
// `next-env.d.ts`, but `@midpack/ui` is typechecked on its own, so declare the
// modules here too.
declare module "*.jpg" {
  const content: import("next/image").StaticImageData;
  export default content;
}

declare module "*.jpeg" {
  const content: import("next/image").StaticImageData;
  export default content;
}

declare module "*.png" {
  const content: import("next/image").StaticImageData;
  export default content;
}

declare module "*.webp" {
  const content: import("next/image").StaticImageData;
  export default content;
}

declare module "*.svg" {
  const content: import("next/image").StaticImageData;
  export default content;
}
