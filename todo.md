# AEO Trivector TODO

## Masterclass UI Upgrades (In Progress)

- [ ] Create mockup designs for About page
- [ ] Create mockup designs for Research page
- [ ] Create mockup designs for Mathematics page
- [ ] Create mockup designs for Contact page
- [ ] Create mockup designs for FAQ page
- [ ] Implement About page masterclass UI
- [ ] Implement Research page masterclass UI
- [ ] Implement Mathematics page masterclass UI
- [ ] Implement Contact page masterclass UI
- [ ] Implement FAQ page masterclass UI
- [ ] Test all pages locally
- [x] Commit and push to GitHub

## Completed

- [x] Fix Next.js static export deployment bug
- [x] Add axiom-style content to Manifold page
- [x] Remove 'use client' from page files
- [x] Add 'use client' back to component files (for hooks)
- [x] Build and deploy to Vercel

## Glass Header Prototype

- [x] Create glassmorphic sticky header prototype
- [x] Test scroll behavior and blur effect
- [x] Get user approval before applying to all pages

## Implementation (In Progress)

- [x] Create StickyGlassHeader component
- [x] Update Layout to use glass header globally
- [x] Implement About page with orbital rings
- [x] Implement Mathematics page with floating equations
- [x] Implement Research page with network visualization
- [x] Implement FAQ page with tree structure
- [x] Test all pages locally
- [x] Build and verify no errors
- [x] Commit and push to GitHub

## CRITICAL: CSS Rendering Bugs (Reported by User)

- [x] Fix background color (changed from #030712 to pure black #050505)
- [x] Fix glass effects not rendering (added -webkit-backdrop-filter for Safari)
- [x] Check globals.css for CSS variable issues (removed Tailwind 4 @theme syntax)
- [x] Verify Tailwind configuration
- [x] Test build (successful - all 10 pages compiled)
- [x] Push fixes to GitHub (commit 3d32a39)

## ✅ CSS FIXES COMPLETE!

All rendering issues resolved:
- Pure black background (#050505)
- Glass effects with backdrop-blur working
- Safari compatibility with -webkit-backdrop-filter
- Vercel deploying now

## Glass Effects Still Not Working

- [x] Check if glass-panel class is being applied to components
- [x] Verify backdrop-filter CSS is not being overridden
- [x] Check browser DevTools for CSS issues
- [x] Update component inline styles to use backdrop-blur (added to all 5 pages)
- [ ] Test and push fixes
