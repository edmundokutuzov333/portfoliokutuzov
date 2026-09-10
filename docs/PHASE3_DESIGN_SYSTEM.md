# Phase 3 Design System Contract

The portfolio follows this dependency direction:

`tokens -> primitives -> components -> sections -> pages`

New work must reuse the canonical primitives and components before introducing a new abstraction.

## Tokens

Color, typography, spacing, motion/easing, content widths, borders and z-index live in the existing global token layer in `src/styles.css`.

## Canonical primitives

- Typography
- Button
- Tag
- MonoLabel
- Divider
- MediaFrame

## Canonical components

- GlassNav
- SectionHeader
- StatusIndicator
- CaseMeta
- CaseNavigation
- ProjectCard

## Canonical sections

- Hero
- FeaturedWork
- ClientLogos
- CaseStudy
- ContactBrief

## Rules

Prefer semantic HTML and existing tokens over local visual constants. A new component is justified only when the interaction or semantic responsibility is reused or is materially clearer in isolation. Pages should compose sections and components rather than inventing one-off UI systems.
