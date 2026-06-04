# TrimGo Marketplace Expansion Plan

Turn TrimGo from a male-salon booking app into a 5-category beauty & service marketplace. This is a frontend/UX expansion on the existing mock-data architecture — no backend changes.

## 1. Category model

Add a shared `Category` type in `src/lib/mock-data.ts`:

- `male` — Male Grooming
- `female` — Female Beauty & Parlour
- `home` — Home Services
- `bridal` — Bridal Services
- `wedding` — Wedding & Event Services

Tag every existing salon with `category: "male"`. Seed ~12 new providers across the other 4 categories (each with name, hue, area, distance, price range, rating, sample services, portfolio images for bridal/wedding, travel charge + coverage area for home).

Persist user's chosen category in `localStorage` (`tg.category`) via a small `useCategory()` hook in `src/lib/category.tsx`.

## 2. Category selection screen

New route `src/routes/categories.tsx`:

- Title: "Choose Your Service Category"
- 5 large gradient cards with icon, title, short description, sample services
- Tap → save category → navigate to `/home`
- Accessible later from a "Switch category" chip in the home header

Flow update in `src/routes/index.tsx` (splash) and `src/routes/login.tsx`:
- After splash/login → if no category in localStorage → `/categories`, else `/home`.

## 3. Filtered Home

Update `src/routes/home.tsx`:
- Read active category; filter the salons/providers list accordingly
- Show category name + "Switch" button in header
- Category-specific quick filters:
  - Home → show travel charge + coverage area badges
  - Bridal → show "Portfolio" preview strip
  - Wedding → show team/specialist badges
  - Male/Female → existing price-range filters
- Add gender, home-service-availability, and rating filters to the existing search/sort row

## 4. Provider detail pages

Reuse `src/routes/salons.$id.tsx`; extend rendering based on `category`:
- Bridal/Wedding: portfolio gallery grid + "Package pricing" section
- Home: travel charge, coverage area, available time slots
- Male/Female: existing barber/service layout

## 5. Booking variants

Extend `src/routes/book.$barberId.tsx` (or add `book-home`, `book-bridal` thin wrappers) to support:
- Instant vs Scheduled toggle
- Home Visit address field (Home category)
- Event date + venue (Bridal / Wedding)

Payment screen (`src/routes/payment.tsx`): add bKash / Nagad / Rocket / Card / Cash-on-Service options (UI only, mock).

## 6. Provider registration (owner side)

Extend `src/routes/owner-register.tsx` step 2 ("Salon Info") to ask:
- Business category (Male/Female/Home/Bridal/Wedding)
- For Home: service area + travel charge
- For Bridal/Wedding: portfolio uploads + package pricing

Store on `OwnerAccount` in `src/lib/owner-account.ts`.

## 7. i18n

Add translation keys for all new strings to `src/lib/i18n.tsx` (English + Bengali).

## Out of scope

- Real payment gateways (bKash/Nagad/Rocket) — UI mock only
- Real chat with providers — reuse existing mock chat
- Maps for coverage area — show as text/radius badge
- Calendar availability — show as static slot list

## Files

**Created**
- `src/lib/category.tsx`
- `src/routes/categories.tsx`

**Edited**
- `src/lib/mock-data.ts` (category field, new seed providers)
- `src/lib/i18n.tsx`
- `src/lib/owner-account.ts`
- `src/routes/index.tsx`, `src/routes/login.tsx` (flow gating)
- `src/routes/home.tsx` (category filter, switch chip)
- `src/routes/salons.$id.tsx` (category-aware sections)
- `src/routes/book.$barberId.tsx` (booking variants)
- `src/routes/payment.tsx` (BD payment methods)
- `src/routes/owner-register.tsx` (category + category-specific fields)
- `src/components/mobile-shell.tsx` (optional: category chip in header)
