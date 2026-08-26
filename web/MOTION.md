# Shipfront motion spec

Easing
- Enter: cubic-bezier(0.22, 1, 0.36, 1)
- Standard: cubic-bezier(0.16, 1, 0.3, 1)

Timing
- Micro (buttons, chips, tooltips): 120-220ms
- Component (cards, panels, tabs): 260-450ms
- Section choreography: 600-1000ms
- Hero sequence: 0.15s to 2.2s staggered, then idle pulse

Hero
1. Horizon glow is present at rest
2. Eyebrow, then two headline lines, then lede
3. Route arcs draw, then nodes light
4. Shipment panel springs in
5. Event lines arrive
6. CTAs rise last
7. Idle: low-amplitude node pulse

Elsewhere
- Why cards: 4-8px lift, border brightens, mini visuals run on viewport entry
- Capability blocks: fade-up 0.7s on enter
- Intelligence: typed query, then response fade
- Journey crate: left to right along the thread
- Nav: transparent to floating shell after 28px scroll
- Buttons: 1px lift, soft blue glow
- prefers-reduced-motion: no draw, no pulse, no typewriter, content visible at rest
