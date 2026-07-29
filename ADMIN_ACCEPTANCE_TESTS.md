# Admin Dashboard Pre-Delivery Test Plan

Use this checklist on **localhost first**, then repeat the release-critical checks on the deployed Vercel site. Test with temporary records prefixed `QA -` so they are easy to find and remove.

## 1. Required Automated Checks

Run from the project root after applying every Supabase migration:

```bash
npm run test:cms
npm run lint
npm run build
```

Expected result:

- Unit tests pass.
- Supabase CMS contract checks pass.
- Lint has no errors.
- Production build completes.

Apply this migration before running the checks:

```text
supabase/migrations/20260731000000_owner_only_admins.sql
```

## 2. Test Accounts And Browsers

Prepare:

- One active owner account listed in `admin_users`.
- One normal Supabase Auth user that is **not** in `admin_users`.
- One signed-out/incognito browser.
- Chrome or Safari desktop.
- A real phone or a 390px mobile viewport.

Never run these tests with a service-role key in the browser.

## 3. Authentication And Authorization

| Test              | Steps                                                                         | Expected                                                                                              |
| ----------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Signed-out access | Open `/admin` in incognito.                                                   | Redirected to `/admin/login`; no dashboard data is visible.                                           |
| Invalid login     | Submit an incorrect email/password repeatedly.                                | Generic login failure; no account details or stack trace are exposed.                                 |
| Non-admin user    | Sign in with the Auth user not present in `admin_users`.                      | Dashboard is denied and no CMS records can be changed.                                                |
| Active owner      | Sign in with the owner account.                                               | Dashboard loads all permitted sections.                                                               |
| Unsupported role  | Try inserting an `admin_users` row with `role='editor'` in SQL Editor.        | The database rejects the row; editor accounts are not supported.                                      |
| Disabled admin    | Set `admin_users.is_active=false`, refresh, then restore it through Supabase. | Access is denied while disabled.                                                                      |
| Sign out          | Click Sign out, then use Back and refresh.                                    | Protected dashboard content does not return.                                                          |
| Direct API access | Run `npm run supabase:check`.                                                 | Anonymous writes and private-table reads are rejected.                                                |
| Browser secrets   | Inspect the production JS and Network panel.                                  | Only the Supabase URL and anon key exist; no service-role key, password, or private token is shipped. |

## 4. Shared Admin Behaviour

Run these checks in Gallery, Cases, Services, Products, FAQ, and Google Reviews.

- [ ] Add form shows clear required-field markers and realistic placeholders.
- [ ] Invalid fields show a useful message, red border, and red focus state.
- [ ] Submit button shows progress and prevents duplicate submissions.
- [ ] Saving does not reload the whole dashboard.
- [ ] Navigation remains usable while a background mutation is running where safe.
- [ ] New published records appear on the public site after refresh.
- [ ] New unpublished records remain hidden publicly.
- [ ] Published records cannot be edited until they are unpublished.
- [ ] Edit scrolls to the form and Cancel restores the normal state.
- [ ] Archive removes the item from the public site.
- [ ] Archived filter contains the archived item and Restore works within seven days.
- [ ] Permanent delete is available only for archived records.
- [ ] Bulk Publish, Unpublish, Archive, and Permanent delete affect only selected records.
- [ ] Search works for complete and partial titles without hiding typed characters.
- [ ] Status and multi-category filters combine correctly; Reset clears all filters.
- [ ] Filter/dropdown menus close on outside click and Escape.
- [ ] Pagination preserves filters and does not duplicate or skip records.
- [ ] Reordering persists after refresh and matches the public page exactly.
- [ ] Category groups contain the correct items in both dashboard and public page.
- [ ] Empty states are clear and do not restore deleted static content after loading.
- [ ] Success and error messages remain readable on mobile.

## 5. Gallery

1. Create `QA - Gallery album` with no description and two valid images.
2. Publish it.
3. Confirm the cover appears on the homepage and `/gallery` in dashboard order.
4. Open it and move through both images in the modal.
5. Confirm title, optional description behavior, alt text, close button, Escape, and focus handling.
6. Try to save a gallery item without an image.
7. Upload JPG, PNG, and WebP files under 10MB.
8. Try SVG, PDF, and an image over 10MB.

Expected:

- Multiple images work; unsupported/oversized uploads are rejected before storage.
- Gallery cannot publish without at least one image.
- Modal does not stretch images or shift the page layout.

## 6. Cases

1. Create `QA - Case without photo` with no description or image.
2. Create `QA - Sensitive case` with two images and Sensitive enabled.
3. Publish both and confirm category grouping/order on `/cases`.
4. Open `/cases` in a browser where the warning has never been accepted.
5. Confirm the five-second gate, scroll lock, Stay/Leave actions, and mobile layout.
6. Confirm sensitive images remain blurred until each image is explicitly revealed.
7. Reset the warning with DevTools:

```js
localStorage.removeItem("healthy-pet-cases-sensitive-consent");
```

Expected:

- Image-less cases render a deliberate text-only state.
- No nested-button or hydration warnings appear in the console.
- Accepting the page warning does not automatically reveal individual images.

## 7. Services

1. Create a category `QA Diagnostics`.
2. Add two services with images and different descriptions.
3. Reorder them and publish them.
4. Confirm the homepage preview uses the expected limited number of services.
5. Confirm `/services` groups them under `QA Diagnostics` and follows dashboard order.
6. Rename the category and verify all linked services update.
7. Attempt to delete the category while it still has items, then after moving/removing them.

Expected:

- Service image, title, detail, and category are required.
- Homepage brief copy is derived cleanly from the detail.
- A category containing items cannot be deleted.

## 8. Products

1. Add a product with an image and no description.
2. Test a valid Wolt URL and valid Foody URL.
3. Try `http://`, `javascript:`, `https://example.com`, and `https://wolt.com.example.com` links.
4. Publish, reorder, unpublish, archive, restore, and permanently delete the QA product.

Expected:

- Product image and category are required; description is optional.
- Only HTTPS Wolt/Foody hosts are accepted by both the form and database.
- External links open safely in a new tab.

## 9. FAQ, About Us, And Google Reviews

### FAQ

- [ ] Add, publish, reorder, unpublish, edit, archive, and restore a QA question.
- [ ] Duplicate questions are rejected.
- [ ] Homepage first FAQ opens by default and accordion motion remains smooth.
- [ ] FAQ structured data contains only published questions.

### About Us

- [ ] Save each text field and confirm the homepage updates.
- [ ] Leave the optional second paragraph empty.
- [ ] Test zero, normal, negative, and excessively large counters.
- [ ] Confirm counters remain in one row on mobile and animate once.

### Google Reviews

- [ ] Add ratings 1 and 5; reject 0 and 6.
- [ ] Publish and confirm reviewer name, stars, and full text appear.
- [ ] Verify carousel height stays stable for short and long reviews.
- [ ] Confirm only reviews the clinic is permitted to republish are entered.

## 10. Contact

Test each independent Save container so one change does not overwrite another.

### Address And Map

- [ ] Save street, city, postal code, country, and a valid Google Maps URL.
- [ ] Reject an unrelated or malformed map URL.
- [ ] Confirm the public map and address update together.

### Contact Methods

- [ ] Save one, two, and three phone numbers in international format.
- [ ] Reject a fourth number, duplicate/invalid numbers, malformed email, and malformed WhatsApp.
- [ ] Confirm each phone calls its own number, email opens the mail app, and WhatsApp opens the correct chat.
- [ ] Confirm at least one contact method is required.

### Opening Hours

- [ ] Save all seven days.
- [ ] Test closed days, one time range, and two non-overlapping ranges.
- [ ] Reject missing days, closing before opening, incomplete second periods, and overlapping periods.
- [ ] Confirm the public hours match exactly and remain readable on mobile.

## 11. Failure And Recovery

- [ ] Turn Network offline before submitting; show an error and keep entered form data.
- [ ] Use Slow 3G; progress state remains visible and no duplicate record is created.
- [ ] Interrupt a multi-image upload; confirm no broken published album appears.
- [ ] Open two admin tabs, edit the same draft, and verify the final result is understandable after refresh.
- [ ] Temporarily use an invalid Supabase URL locally; public pages show their safe static fallback without crashing.
- [ ] Restore the correct URL; CMS data replaces fallback without flashing old records.
- [ ] Refresh every public route directly: `/`, `/services`, `/gallery`, `/cases`, `/admin/login`.

## 12. Responsive, Accessibility, And Visual QA

Check `/admin`, homepage, Services, Gallery, and Cases at 390px, 768px, and 1440px.

- [ ] No horizontal overflow, clipped controls, overlapping labels, or off-screen dropdowns.
- [ ] Sidebar/navigation remains usable on mobile.
- [ ] Buttons and icon controls have visible focus and clear accessible labels.
- [ ] Forms are usable using keyboard only.
- [ ] Modal focus stays inside the modal and returns to the trigger after close.
- [ ] Text and controls meet contrast requirements.
- [ ] Images reserve space and do not cause layout shift.
- [ ] `prefers-reduced-motion` removes non-essential motion.
- [ ] Browser console has no hydration, nesting, network, or React key errors.

## 13. Production Sign-Off

Before customer delivery:

- [ ] All migrations are applied in production in filename order.
- [ ] `npm run test:cms`, lint, and build pass against production configuration.
- [ ] Vercel environment variables point to the intended Supabase project.
- [ ] Email confirmation/reset URLs use the production domain.
- [ ] Public registration remains disabled unless explicitly required.
- [ ] The owner uses a unique strong password and MFA if enabled for the project.
- [ ] Database backups and Supabase point-in-time recovery policy are confirmed.
- [ ] A database export and Storage backup procedure has been tested.
- [ ] QA records and uploaded QA files are permanently removed.
- [ ] Customer performs one final add/edit/publish/archive flow while supervised.

Delivery is approved only when every release-critical item passes on the deployed site, not only on localhost.
