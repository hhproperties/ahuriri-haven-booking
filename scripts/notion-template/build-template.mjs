#!/usr/bin/env node
// build-template.mjs
// -----------------------------------------------------------------------------
// Builds the "AirbnbHost" Notion template (as described in the reference images)
// inside your Notion workspace using Notion's official SDK.
//
//   Properties  -> gallery of property cards (Regular/Current rate, discount)
//   Booking     -> booking gallery (Guest, Property, Check-in/out, Payment)
//   Guest       -> guest list (auto-synced check-in/out note)
//   Task        -> task manager (Properties, Date, Priority, Done)
//   Inventory / Finance / Vendor
//
// Requires the official SDK (install with `npm install` in this folder).
// The integration token is read from NOTION_TOKEN env var or a local .env file.
//
// Usage:
//   npm install
//   node build-template.mjs                     # create everything live
//   node build-template.mjs --dry-run           # print the plan, do nothing
//   node build-template.mjs --token ntn_... --name "AirbnbHost"
//   node build-template.mjs --parent <page_id>  # build under an existing page
// -----------------------------------------------------------------------------

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Allow top-level await for the guarded dynamic import of the SDK.
let Client = null;
try {
  ({ Client } = await import('@notionhq/client'));
} catch (e) {
  Client = null;
}

// ---------------------------------------------------------------------------
// Argument + environment parsing
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);

function readArg(name) {
  const i = args.indexOf(name);
  if (i === -1) return undefined;
  return args[i + 1];
}
function hasFlag(name) {
  return args.includes(name);
}

function readEnvFile(p) {
  const out = {};
  try {
    const txt = fs.readFileSync(p, 'utf8');
    for (const line of txt.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      let val = m[2];
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      out[m[1]] = val;
    }
  } catch (e) {
    /* ignore missing file */
  }
  return out;
}

const env = { ...readEnvFile(path.join(__dirname, '.env')), ...process.env };

const config = {
  token: readArg('--token') || env.NOTION_TOKEN,
  name: readArg('--name') || env.NOTION_PAGE_NAME || 'AirbnbHost',
  parentPageId: readArg('--parent') || env.NOTION_PARENT_PAGE_ID || null,
  propertyName: readArg('--property') || env.NOTION_PROPERTY_NAME || '1 Vulcan Lane, Ahuriri, Napier',
  propertyType: readArg('--property-type') || env.NOTION_PROPERTY_TYPE || 'House',
  regularRate: parseFloat(readArg('--rate') ?? env.NOTION_REGULAR_RATE ?? '') || 0,
  discountPct: parseFloat(readArg('--discount') ?? env.NOTION_DISCOUNT_PERCENT ?? '') || 0,
  propertyCover: readArg('--cover') || env.NOTION_PROPERTY_COVER_URL || '',
  dryRun: hasFlag('--dry-run'),
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const rt = (content) => [{ type: 'text', text: { content } }];

function selectProps(options) {
  return options.map(([name, color]) => ({ name, color }));
}

// Rich text building blocks ---------------------------------------------------
function h2(content) {
  return { object: 'block', type: 'heading_2', heading_2: { rich_text: rt(content) } };
}
function para(content) {
  return { object: 'block', type: 'paragraph', paragraph: { rich_text: rt(content) } };
}
function callout(content, emoji = '💡') {
  return {
    object: 'block',
    type: 'callout',
    callout: { rich_text: rt(content), icon: { type: 'emoji', emoji } },
  };
}
function bullet(content) {
  return { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: rt(content) } };
}

// Sleep helper for rate-limit backoff / ordering safety
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Notion page title value (used by pages and database rows)
function titleValue(text) {
  return { title: rt(text) };
}

function log(...a) {
  console.log(...a);
}

function ensure(client) {
  if (!client) {
    log(
      '\n[!] The official Notion SDK is not installed.\n' +
        '    Run:  npm install   (in the scripts/notion-template folder)\n' +
        '    then re-run this script.\n'
    );
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Database property definitions
// ---------------------------------------------------------------------------
const PROPERTY_TYPES = [
  ['House', 'blue'],
  ['Apartment', 'green'],
  ['Cottage', 'brown'],
  ['Villa', 'orange'],
  ['Loft', 'purple'],
  ['Studio', 'gray'],
];

const BOOKING_PAYMENTS = [
  ['Pending', 'gray'],
  ['Paid', 'green'],
];

const GUEST_TYPES = [
  ['New', 'green'],
  ['Repeat', 'blue'],
  ['VIP', 'red'],
];

const PRIORITIES = [
  ['High', 'red'],
  ['Medium', 'blue'],
  ['Low', 'gray'],
];

const CATEGORIES_INVENTORY = [
  ['Linen', 'blue'],
  ['Amenities', 'green'],
  ['Cleaning', 'yellow'],
  ['Appliances', 'orange'],
  ['Furniture', 'purple'],
];

const CATEGORIES_FINANCE = [
  ['Income', 'green'],
  ['Expense', 'red'],
];

const CATEGORIES_VENDOR = [
  ['Cleaning', 'blue'],
  ['Maintenance', 'orange'],
  ['Gardening', 'green'],
  ['Supplies', 'yellow'],
];

// Current Booking Rate = Regular *(1 - Discount%). A Notion formula so it
// updates automatically; the "% Discount" text in the header is the Display.
const CURRENT_RATE_FORMULA =
  'if(prop("Discount (%)") > 0, round(prop("Regular Booking Rate") * (1 - prop("Discount (%)") / 100) * 100) / 100, prop("Regular Booking Rate"))';

// ---------------------------------------------------------------------------
// Dry-run: print the plan without calling the API
// ---------------------------------------------------------------------------
function printPlan() {
  const where = config.parentPageId ? `page ${config.parentPageId}` : 'workspace root (new top-level page)';
  log('\n=== Notion template build plan (dry-run) ===');
  log(`Template page       : ${config.name}`);
  log(`Created under       : ${where}`);
  log(`Integration token   : ${config.token ? 'provided (hidden)' : 'MISSING'}`);
  log(`Seed property       : "${config.propertyName}" (${config.propertyType})`);
  log(`Regular rate        : $${config.regularRate}`);
  log(`Discount            : ${config.discountPct}%`);
  log(`Cover image         : ${config.propertyCover || '(none)'}`);
  log('\nPages & databases to create:');
  log('  - AirbnbHost  (dashboard): callout, toolbar, [Properties database inline]');
  log('  - Booking  (page): callout, [Booking database] + Today check-in/out headings');
  log('  - Guest    (page): auto-sync callout, [Guest database]');
  log('  - Task     (page): [Task database]');
  log('  - Inventory/page: [Inventory database]');
  log('  - Finance  (page): [Finance database]');
  log('  - Vendor   (page): [Vendor database]');
  log('  - Online Form (page)');
  log('\nRelations:');
  log('  Booking.Guest    -> Guest');
  log('  Booking.Property -> Properties');
  log('  Task.Properties  -> Properties');
  log('  Inventory/Finance/Vendor.Property -> Properties');
  log('\nViews (not creatable via API — set these in the Notion UI):');
  log('  Properties: Gallery card view; Booking: Gallery + Today Check-In/Out filtered views;');
  log('  Task: Task by Properties / Incomplete / Completed; Guest: List view.');
  log('\n(dry-run only — no changes made.)\n');
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------
async function build() {
  ensure(Client);
  const client = new Client({ auth: config.token });

  // --- parent for the template page -----------------------------------------
  const parent = config.parentPageId
    ? { type: 'page_id', page_id: config.parentPageId }
    : { type: 'workspace', workspace: true };

  // -------------------------------------------------------------------------
  // 1) The main dashboard page
  // -------------------------------------------------------------------------
  log('\n[1/11] Creating dashboard page "' + config.name + '" ...');
  const dashboard = await client.pages.create({
    parent,
    icon: { type: 'emoji', emoji: '🏠' },
    properties: { title: titleValue(config.name) },
    children: [
      callout(
        'Instruction: Use this AirBnB host template to manage your property, bookings, guests and tasks. ' +
          'Add your property once, then create bookings and guests. Check-in / check-out dates sync from the Booking database.'
      ),
      para(
        '+ Add New Task        + Add New Property        + Add New Guest        + Add New Booking        + Add New Inventory'
      ),
      h2('🏠 Properties'),
    ],
  });
  const dashId = dashboard.id;

  // -------------------------------------------------------------------------
  // 2) Properties database (inline on the dashboard -> gallery in the UI)
  // -------------------------------------------------------------------------
  log('[2/11] Creating Properties database ...');
  const propertiesDb = await client.databases.create({
    parent: { type: 'page_id', page_id: dashId },
    icon: { type: 'emoji', emoji: '🏠' },
    title: rt('Properties'),
    properties: {
      Name: { title: {} },
      'Property Type': { select: { options: selectProps(PROPERTY_TYPES) } },
      'Regular Booking Rate': { number: { format: 'dollar' } },
      'Discount (%)': { number: { format: 'percent' } },
      'Current Booking Rate': { formula: { expression: CURRENT_RATE_FORMULA } },
    },
  });
  const propDbId = propertiesDb.id;

  // -------------------------------------------------------------------------
  // 3) Booking page + Booking database (Guest table comes later)
  // -------------------------------------------------------------------------
  log('[3/11] Creating Booking page + Booking database ...');
  const bookingPage = await client.pages.create({
    parent: { type: 'page_id', page_id: dashId },
    icon: { type: 'emoji', emoji: '📅' },
    properties: { title: titleValue('Booking') },
    children: [
      callout('Booking Payment System — How It Works: Track payment status and totals per booking.', '▶️'),
      h2('🏷️ Booking Gallery'),
    ],
  });
  const bookingDb = await client.databases.create({
    parent: { type: 'page_id', page_id: bookingPage.id },
    icon: { type: 'emoji', emoji: '📅' },
    title: rt('Booking'),
    properties: {
      Name: { title: {} },
      Property: { relation: { database_id: propDbId, type: 'single_property', single_property: {} } },
      'Check-in Date': { date: {} },
      'Check-out Date': { date: {} },
      'Booking Payment': { select: { options: selectProps(BOOKING_PAYMENTS) } },
      'Total Bill': { number: { format: 'dollar' } },
      'Amount Paid': { number: { format: 'dollar' } },
    },
  });
  const bookingDbId = bookingDb.id;

  // ---- "Today's Check-In / Check-Out" headings (views added in UI) ---------
  await client.blocks.children.append({
    block_id: bookingPage.id,
    children: [
      h2('🛬 Today\u2019s Check-In'),
      callout('Add a Booking database view filtered to Check-in Date = Today, then attach it here.', '📌'),
      h2('🚪 Today\u2019s Check-Out'),
      callout('Add a Booking database view filtered to Check-out Date = Today, then attach it here.', '📌'),
    ],
  });

  // -------------------------------------------------------------------------
  // 4) Guest page + Guest database
  // -------------------------------------------------------------------------
  log('[4/11] Creating Guest page + Guest database ...');
  const guestPage = await client.pages.create({
    parent: { type: 'page_id', page_id: dashId },
    icon: { type: 'emoji', emoji: '👤' },
    properties: { title: titleValue('Guest') },
    children: [
      callout(
        'Check-In and Check-out dates are automatically synced from the 📅 Booking database. ' +
          'Once you enter the dates in the Booking database, they\u2019ll appear here automatically — no need to fill them in again on the Guest page.'
      ),
      h2('👥 Guest List'),
    ],
  });
  const guestDb = await client.databases.create({
    parent: { type: 'page_id', page_id: guestPage.id },
    icon: { type: 'emoji', emoji: '👤' },
    title: rt('Guest'),
    properties: {
      Name: { title: {} },
      'Check-in': { date: {} },
      'Check-out': { date: {} },
      'Guest Type': { select: { options: selectProps(GUEST_TYPES) } },
      Phone: { phone_number: {} },
      Email: { email: {} },
      'Files & media': { files: {} },
    },
  });
  const guestDbId = guestDb.id;

  // -------------------------------------------------------------------------
  // 4b) Link Booking -> Guest (creates the Booking<->Guest relation pair)
  // -------------------------------------------------------------------------
  log('[5/11] Linking Booking \<-> Guest ...');
  await client.databases.update({
    database_id: bookingDbId,
    properties: {
      Guest: { relation: { database_id: guestDbId, type: 'single_property', single_property: {} } },
    },
  });
  await sleep(400); // let Notion create the inverse relation property
  // Rename the auto-created inverse relation on Guest -> "Booking"
  await renameRelation(client, guestDbId, bookingDbId, 'Booking');

  // -------------------------------------------------------------------------
  // 5) Task page + Task database
  // -------------------------------------------------------------------------
  log('[6/11] Creating Task page + Task database ...');
  const taskPage = await client.pages.create({
    parent: { type: 'page_id', page_id: dashId },
    icon: { type: 'emoji', emoji: '✅' },
    properties: { title: titleValue('Task') },
    children: [
      callout('Manage prep tasks per property. View options: Task by Properties / Incomplete / Completed.', '🧹'),
      h2('📝 Task Manager'),
    ],
  });
  await client.databases.create({
    parent: { type: 'page_id', page_id: taskPage.id },
    icon: { type: 'emoji', emoji: '✅' },
    title: rt('Task'),
    properties: {
      Name: { title: {} },
      Properties: { relation: { database_id: propDbId, type: 'single_property', single_property: {} } },
      Date: { date: {} },
      Priority: { select: { options: selectProps(PRIORITIES) } },
      Note: { rich_text: {} },
      Done: { checkbox: {} },
    },
  });

  // -------------------------------------------------------------------------
  // 6/7/8) Inventory, Finance, Vendor pages + databases
  // -------------------------------------------------------------------------
  await createSimpleDb(client, dashId, {
    pageIcon: '📦',
    pageTitle: 'Inventory',
    dbTitle: 'Inventory',
    dbIcon: '📦',
    intro: 'Track household stock and consumables per property.',
    properties: {
      Name: { title: {} },
      Property: { relation: { database_id: propDbId, type: 'single_property', single_property: {} } },
      Category: { select: { options: selectProps(CATEGORIES_INVENTORY) } },
      Quantity: { number: {} },
      'Unit Cost': { number: { format: 'dollar' } },
    },
  });
  await createSimpleDb(client, dashId, {
    pageIcon: '💰',
    pageTitle: 'Finance',
    dbTitle: 'Finance',
    dbIcon: '💰',
    intro: 'Track income and expenses per property.',
    properties: {
      Name: { title: {} },
      Property: { relation: { database_id: propDbId, type: 'single_property', single_property: {} } },
      Type: { select: { options: selectProps(CATEGORIES_FINANCE) } },
      Amount: { number: { format: 'dollar' } },
      Date: { date: {} },
    },
  });
  await createSimpleDb(client, dashId, {
    pageIcon: '🧰',
    pageTitle: 'Vendor',
    dbTitle: 'Vendor',
    dbIcon: '🧰',
    intro: 'Keep a directory of service providers per property.',
    properties: {
      Name: { title: {} },
      Property: { relation: { database_id: propDbId, type: 'single_property', single_property: {} } },
      Category: { select: { options: selectProps(CATEGORIES_VENDOR) } },
      Email: { email: {} },
      Phone: { phone_number: {} },
    },
  });

  log('[7/11] Creating Online Form page ...');
  await client.pages.create({
    parent: { type: 'page_id', page_id: dashId },
    icon: { type: 'emoji', emoji: '📝' },
    properties: { title: titleValue('Online Form') },
    children: [
      callout('Link your booking / enquiry form here (e.g. a Notion Form or external form URL).', '🔗'),
      bullet('Paste your form URL below.'),
      para('(form link)'),
    ],
  });

  // -------------------------------------------------------------------------
  // 9) Seed the single property
  // -------------------------------------------------------------------------
  log('[8/11] Seeding property "' + config.propertyName + '" ...');
  const pageProps = {
    Name: titleValue(config.propertyName),
    'Property Type': { select: { name: config.propertyType } },
    'Regular Booking Rate': { number: config.regularRate },
    'Discount (%)': { number: config.discountPct },
  };
  await client.pages.create({
    parent: { type: 'database_id', database_id: propDbId },
    ...(config.propertyCover ? { cover: { type: 'external', external: { url: config.propertyCover } } } : {}),
    properties: pageProps,
  });

  await sleep(300);

  log('\n✅ Done. Template created in workspace.');
  log('   Dashboard page : ' + dashId);
  log('   Properties DB  : ' + propDbId);
  log('   Booking DB     : ' + bookingDbId);
  log('   Guest DB       : ' + guestDbId);
  log('\nNext: open the pages in Notion, switch the view types (gallery/board/list),');
  log('      add the filtered "Today\u2019s Check-In / Check-Out" views, and set each');
  log('      property\u2019s cover photo + link it to your listing. See README.md.\n');
}

// Create a database + its owning page, with an intro callout, under the dashboard.
async function createSimpleDb(client, dashId, spec) {
  log(`[?] Creating ${spec.pageTitle} page + ${spec.dbTitle} database ...`);
  const page = await client.pages.create({
    parent: { type: 'page_id', page_id: dashId },
    icon: { type: 'emoji', emoji: spec.pageIcon },
    properties: { title: titleValue(spec.pageTitle) },
    children: [h2(`${spec.pageIcon} ${spec.dbTitle}`), callout(spec.intro)],
  });
  return client.databases.create({
    parent: { type: 'page_id', page_id: page.id },
    icon: { type: 'emoji', emoji: spec.dbIcon },
    title: rt(spec.dbTitle),
    properties: spec.properties,
  });
}

// Find auto-created inverse relation properties on a database that point to a
// given target database and rename them (best-effort, non-fatal).
async function renameRelation(client, dbId, targetDbId, newName) {
  try {
    const db = await client.databases.retrieve({ database_id: dbId });
    const patch = {};
    for (const [propName, prop] of Object.entries(db.properties || {})) {
      if (prop.type === 'relation' && prop.relation?.database_id === targetDbId && propName !== newName) {
        patch[propName] = { name: newName };
      }
    }
    const keys = Object.keys(patch);
    if (keys.length === 0) return;
    await client.databases.update({ database_id: dbId, properties: patch });
    log('   (renamed inverse relation on @' + dbId.slice(0, 6) + ' to "' + newName + '")');
  } catch (e) {
    log('   (skip inverse-relation rename: ' + (e?.message || e) + ')');
  }
}

// ---------------------------------------------------------------------------
// Entry
// ---------------------------------------------------------------------------
if (config.dryRun) {
  printPlan();
  process.exit(0);
}

if (!config.token) {
  log('\n[!] No Notion integration token found.\n');
  log('    Create a Notion integration at https://www.notion.so/my-integrations,');
  log('    copy the token, then either:\n');
  log('      - set it in a .env file here:   NOTION_TOKEN=ntn_...  (see .env.example)');
  log('      - pass it on the CLI:           node build-template.mjs --token ntn_...\n');
  log('    You must also give that integration access to the target page/workspace.\n');
  process.exit(1);
}

build()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    log('\n[!] Build failed:');
    log('    ' + (err?.message || err));
    if (err?.code) log('    code: ' + err.code);
    if (err?.body) log('    body: ' + JSON.stringify(err.body));
    log('\nTip: pass --dry-run to preview. Make sure the integration has access to the');
    log('     workspace/page and that NOTION_TOKEN is correct.\n');
    process.exit(1);
  });
