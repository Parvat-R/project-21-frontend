# Progress Log

Last updated: 2026-03-10
Workspace: `S:\Python\JMAN Prep\Project`

## Project Structure
- Backend: `Project-21` (Next.js + Prisma + PostgreSQL)
- Frontend: `project-21-frontend` (Next.js + shadcn/ui)

## Goal Summary
Build an event management workflow where:
- Organiser can create and edit events.
- Edited events must go back to `PENDING` for admin review.
- Admin can approve/reject from dashboard.
- Role-based sidebar navigation exists for organiser and user.
- Root role routes should not 404.

## Completed Work

### 1. Organiser Event Creation
- Added organiser create page and form flow.
- Form supports multi-step wizard behavior.
- Image upload input supported (currently sent as base64 in payload).
- Creator ID currently sent as fixed value in body (temporary setup).

Key files:
- `project-21-frontend/src/components/organiser/EventForm.tsx`
- `project-21-frontend/src/app/organiser/events/create/page.tsx`

### 2. Sidebar-Only Role Navigation
- Added role-based left sidebar.
- Added role layouts for organiser and user.
- Moved toward sidebar-first experience (top nav removed from role pages).

Key files:
- `project-21-frontend/src/components/common/RoleSidebar.tsx`
- `project-21-frontend/src/app/organiser/layout.tsx`
- `project-21-frontend/src/app/user/layout.tsx`

### 3. Organiser Dashboard + Event Cards
- Organiser dashboard styled similarly to admin card style.
- Organiser cannot approve/reject events.
- Event cards include image rendering and status badges.
- Added `Edit Event` action per organiser-created event.

Key files:
- `project-21-frontend/src/app/organiser/dashboard/page.tsx`

### 4. Event Details + View More Fixes
- Dynamic event detail routes fetch real event data by ID.
- Organiser-scoped detail route added.
- Back button behavior made configurable and fixed to role-appropriate pages.
- Registered users tab loading optimized (lazy load).

Key files:
- `project-21-frontend/src/app/events/[id]/page.tsx`
- `project-21-frontend/src/app/organiser/events/[id]/page.tsx`
- `project-21-frontend/src/components/organiser/view-event.tsx`

### 5. Backend Event API Improvements
- `GET /api/event` supports filtering, pagination, and reduced select payload.
- Optional `includeImage` support added for list responses.
- `POST /api/event` stores parsed image bytes.
- `PATCH /api/event/[id]` now:
  - Updates safe mapped fields.
  - Detects content edits.
  - Resets `approvalStatus` to `PENDING` automatically on content edits unless explicitly set.
- Validation schema updated for optional `approvalStatus` and `imageData`.

Key files:
- `Project-21/src/app/api/event/route.ts`
- `Project-21/src/app/api/event/[id]/route.ts`
- `Project-21/src/lib/validation/event.ts`

### 6. Admin Approval Flow (Real API, no dummy state)
- Admin dashboard now fetches real events from backend.
- Dashboard status cards show real counts.
- Approve/Reject actions persist via `PATCH /api/event/[id]`.
- Approval card component converted from local-only state to controlled props + callback.

Key files:
- `project-21-frontend/src/app/admin/dashboard/page.tsx`
- `project-21-frontend/src/components/admin/EventApprovalCard.tsx`

### 7. CORS Centralization
- CORS headers centralized in backend Next config for API routes.
- Allowed frontend origin: `http://localhost:3001`.

Key file:
- `Project-21/next.config.ts`

### 8. Root Role Route 404 Fixes
- Added role index pages to avoid 404:
  - `/organiser` -> `/organiser/dashboard`
  - `/user` -> `/user/events`

Key files:
- `project-21-frontend/src/app/organiser/page.tsx`
- `project-21-frontend/src/app/user/page.tsx`

## Current Working State
- Organiser can create event.
- Organiser can edit event.
- Edit sends event back to `PENDING`.
- Admin can approve/reject from dashboard and updates are persisted.
- `/organiser` and `/user` root URLs now resolve via redirects.

## Known Limitations / Temporary Decisions
1. Creator ID handling is temporary in frontend (fixed string in create flow).
2. Image storage currently uses DB bytes (`imageData`), which can still slow larger list responses when images are included.
3. Authentication/authorization hardening still needed for production-grade role enforcement.

## Suggested Next Improvements
1. Replace temporary creator ID with authenticated session user ID.
2. Move image storage from DB bytes to URL/blob storage.
3. Add stricter backend authorization for event edit/approval endpoints.
4. Add pagination/search UI on admin dashboard for large event volumes.
5. Add end-to-end tests for organiser edit -> pending -> admin approve/reject lifecycle.

## Quick Resume Checklist
When continuing later:
1. Start backend (`Project-21`) and frontend (`project-21-frontend`).
2. Verify API base URL env in frontend points to backend (usually `http://localhost:3000`).
3. Open these URLs:
   - `http://localhost:3001/organiser`
   - `http://localhost:3001/admin/dashboard`
   - `http://localhost:3001/user`
4. Test flow:
   - Create/edit organiser event.
   - Confirm status becomes `PENDING`.
   - Approve/reject from admin dashboard.
   - Confirm organiser dashboard reflects updated status.

## Notes for Next Session
Use this file as source of truth. Continue from "Suggested Next Improvements" unless new requirements are provided.
