# Career map path objects

Translucent chrome objects for the eight tiles orbiting the hub in "Every path
into tech, connected to you". The direction is Pelumi's: liquid-metal glass
objects on black, the look of the reference images he supplied on 2026-08-10.

**The set is incomplete.** One of eight is here. The rest are blocked on
Higgsfield credits, which ran out mid-generation — until they all exist the
section keeps the miniature product screens in `career-map-mocks.tsx`, because
one chrome object among seven app windows looks like a mistake rather than a
transition.

| File | Path | State |
|---|---|---|
| `cybersecurity.webp` | Cybersecurity | **Done.** 256×256, 4.3 KB |
| `data-analytics.webp` | Data analytics | Pending |
| `product-design.webp` | Product design | Pending |
| `software-engineering.webp` | Software engineering | Pending |
| `cloud-devops.webp` | Cloud & DevOps | Pending |
| `ai-machine-learning.webp` | AI & machine learning | Pending |
| `support-success.webp` | Support & success | Pending |
| `product-management.webp` | Product management | Pending |

## How the one that exists was made

Higgsfield, `nano_banana_pro`, 1:1, 1k, 2 credits. The prompt, which the
remaining seven should follow with only the object swapped:

> A single 3D icon of a **shield**, rendered in polished translucent chrome and
> liquid metal, floating on a pure black background. Smooth rounded bevelled
> edges, sharp specular highlights, soft studio reflections across the surface,
> subtle glassy transparency at the edges. Centred, symmetrical, minimal, high
> contrast, clean product render. No text, no logos, no background elements, no
> ground plane.

Then `cwebp -q 80 -resize 256 0`, which lands each one around 4 KB. All eight
together are roughly 35 KB, so the set is cheaper than a single photograph.

## Two things that matter when the rest land

**They arrive on pure black, and the section's ground is `ink` (#0B0F1A).** A
black square on a near-black ground is still a visible square. `mix-blend-mode:
screen` drops black to nothing and paints only the chrome, so no cut-out or
alpha channel is needed — and it is free.

**Check them at 68px before accepting them.** That is the tile's real size on a
phone; the desktop tile is 124px. A render with fine internal detail turns to
grey mush at 68. The shield survives because its silhouette carries it, which is
the property to prompt for: one clear shape, not a scene.
