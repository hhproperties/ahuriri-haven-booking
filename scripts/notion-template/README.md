# AirbnbHost Notion template builder

A single Node.js script that builds the **AirBnB-host style Notion template**
(pictured in the reference images) inside your own Notion workspace, using
Notion's official SDK.

It creates a fresh top-level **AirbnbHost** dashboard plus the related
**Properties**, **Booking**, **Guest**, **Task**, **Inventory**, **Finance** and
**Vendor** databases, wired together with relations, and seeds your property
**"1 Vulcan Lane, Ahuriri, Napier"** as the first property card.

---

## What gets created

```
AirbnbHost                     ← dashboard page (top level, or under --parent)
├─ 🏠 Properties               ← inline gallery on the dashboard
│     Name · Property Type · Regular Booking Rate · Discount (%) · Current Booking Rate (formula)
├─ 📅 Booking                  ← page
│     Booking Gallery (database) + "Today's Check-In" / "Today's Check-Out" headings
│     Name · Guest · Property · Check-in Date · Check-out Date · Booking Payment · Total Bill · Amount Paid
├─ 👤 Guest                    ← page
│     Guest List (database) + auto-sync callout
│     Name · Booking · Check-in · Check-out · Guest Type · Phone · Email · Files & media
├─ ✅ Task                     ← page
│     Task Manager (database)
│     Name · Properties · Date · Priority · Note · Done
├─ 📦 Inventory                ← page + database (Property · Category · Quantity · Unit Cost)
├─ 💰 Finance                  ← page + database (Property · Type · Amount · Date)
├─ 🧰 Vendor                   ← page + database (Property · Category · Email · Phone)
└─ 📝 Online Form              ← page (link your enquiry form here)
```

**Relations** created automatically:

- `Booking.Guest` → `Guest` (the inverse "Booking" relation appears on Guest)
- `Booking.Property` → `Properties`
- `Task.Properties` → `Properties`
- `Inventory / Finance / Vendor .Property` → `Properties`

> The "Current Booking Rate" is a Notion **formula** that computes
> `Regular Rate × (1 − Discount %)`, so it stays in sync when you change the
> regular rate or discount.

---

## 1. Get a Notion token

1. Go to <https://www.notion.so/my-integrations> → **New integration**.
2. Give it a name and pick the workspace you want to build into.
3. Copy the **Internal Integration Secret** (starts with `ntn_`).
4. **Share access**: open the page you want to build under (for a brand-new
   top-level page, share access with the integration at the workspace level),
   then click **⋮ → Connections → Add** and select your integration.

## 2. Install + configure

You need **Node.js 18+** (any recent version works). From this folder:

```bash
cd scripts/notion-template
npm install
cp .env.example .env      # then edit .env, filling in NOTION_TOKEN
```

Or skip the file and pass everything on the command line:

```bash
node build-template.mjs --token ntn_xxxx --name "AirbnbHost" \
  --parent <page_id> --property "1 Vulcan Lane, Ahuriri, Napier" \
  --property-type House --rate 0 --discount 0
```

## 3. Preview, then build

```bash
npm run dry-run      # prints the plan, makes no changes
npm run build        # creates everything in your workspace
```

---

## 4. Finishing touches in the Notion UI

The Notion API can create databases and pages, but it **cannot** set a
database's **view** type or create **filtered/sorted views**. After the build,
switch the views yourself:

- **Properties** → switch the inline database to **Gallery** view. Add a
  **cover image** to your property card (click the card → **⋮ → Add cover**).
  Turn on the gallery card preview to show the image.
- **Booking** → **Gallery** view; then create two extra views named
  **"Today's Check-In"** (filter `Check-in Date` = Today) and
  **"Today's Check-Out"** (filter `Check-out Date` = Today), and drag them under
  the matching headings on the Booking page.
- **Task** → create the views **Task by Properties** (Group by `Properties`),
  **Incomplete Task** (filter `Done` uncheck), and **Completed Task**
  (filter `Done` checked). The Task page already has the columns
  Name / Properties / Date / Priority / Note / Done.
- **Guest** → **List/Table** view.
- Optional: **Add cover photos** and an icon to every page to match the look.

---

## Configuration reference

| CLI flag / env var            | Purpose                                                      | Default |
| ----------------------------- | ------------------------------------------------------------ | ------- |
| `--token` / `NOTION_TOKEN`    | Notion integration token (required)                          | —       |
| `--parent` / `NOTION_PARENT_PAGE_ID` | Build under an existing page ID (optional)             | new top-level page |
| `--name` / `NOTION_PAGE_NAME` | Dashboard page name                                          | `AirbnbHost` |
| `--property` / `NOTION_PROPERTY_NAME` | Property card title                                   | `1 Vulcan Lane, Ahuriri, Napier` |
| `--property-type` / `NOTION_PROPERTY_TYPE` | Select value (e.g. House)                        | `House` |
| `--rate` / `NOTION_REGULAR_RATE` | Regular booking rate (number)                            | `0` |
| `--discount` / `NOTION_DISCOUNT_PERCENT` | Discount % (number)                             | `0` |
| `--cover` / `NOTION_PROPERTY_COVER_URL` | External image URL for the card                    | —       |

---

## Notes & troubleshooting

- **Re-running** creates a *second* copy. Delete the previous `AirbnbHost`
  page first if you want a fresh build.
- **Giving the integration access** is the most common failure. If a build
  fails with `Could not find database/page` or `unauthorized`, confirm the
  integration was added as a **connection** to the target workspace/page.
- The `renameRelation` step (inverse relation naming) is best-effort. If it
  silently skips, the relation still works — just rename the auto-created
  relation property in the UI if you want it to read exactly `Booking`.
- Inverse relations on **Properties** (e.g. `Property (2)`, `Properties`) are
  auto-added by Notion. They're harmless and power the per-property lookup; feel
  free to rename or delete them in the UI.
