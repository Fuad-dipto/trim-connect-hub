## Trimgo — Customer-first Entry + Owner Portal Gating

### 1. Remove role toggle from app shell
- Delete `RoleToggle` usage in `src/routes/__root.tsx` (keep `RoleProvider` for state; remove the floating toggle component from layout).
- Remove the Customer/Owner picker from `src/routes/login.tsx` so login is generic.
- App launches straight into Customer experience (`/` → splash → `/home`). No role UI visible anywhere.

### 2. Profile page → Owner Portal entry
- Replace the existing "Own a salon?" link in `src/routes/profile.tsx` with a polished **Owner Portal** business card section, shown to all users.
- Tapping it routes to `/owner-portal` (new gateway route) instead of jumping directly into `/owner`.
- Add the profile menu items listed (My Bookings, Payment History, Saved Salons, Notifications, Settings, Help & Support, Owner Portal).

### 3. Owner Portal gateway (`src/routes/owner-portal.tsx`)
Reads owner status from `localStorage` (`tg.ownerAccount`):
- **Not registered** → "Become a Salon Owner" marketing card with benefits + buttons: **Register Salon**, **Learn More**.
- **Registered but not logged in** → Owner Login screen (email, password, Remember Me, Forgot Password, Continue with Google). On success → `/owner`.
- **Registered + logged in** → redirect to `/owner`.

State stored client-side:
- `tg.ownerAccount` = `{ email, registeredAt, ...profile }`
- `tg.ownerSession` = boolean (set on successful "login")

### 4. Owner Registration Wizard (`src/routes/owner-register.tsx`)
5-step wizard with progress indicator:
1. Owner Info (name, email, phone, password)
2. Salon Info (name, description, category)
3. Media (logo, cover, gallery via existing `ImageDrop`)
4. Location (address, map placeholder, business hours)
5. Review & Submit → writes `tg.ownerAccount`, sets `tg.ownerSession`, navigates to `/owner`.

### 5. Owner Dashboard enrichment
Update `src/routes/owner.index.tsx` so the landing dashboard shows the full overview cards:
Total Bookings, Today's Revenue, Monthly Revenue, Active Barbers, Customer Reviews, Pending Appointments, Earnings Overview chart, Job Applications. Use existing `owner-store` + `jobs-store` data; add a simple Recharts area chart for earnings.

### 6. Keep existing owner sub-pages intact
Settings / Services / Barbers / Bookings / Jobs already exist — just ensure sidebar links work and dashboard is the new overview.

### Out of scope for this pass
- Real backend auth (using local state, matches the rest of the app's mock data pattern).
- Real-time chat, push notifications, PDF/Excel export, map integration — UI placeholders only where mentioned, no new infra.

### Files
- edit: `src/routes/__root.tsx`, `src/routes/login.tsx`, `src/routes/profile.tsx`, `src/routes/owner.index.tsx`
- add: `src/routes/owner-portal.tsx`, `src/routes/owner-register.tsx`, `src/lib/owner-account.ts`
- delete usage of: `src/components/role-toggle.tsx` (file kept but unused)
