const fs = require('fs');
const idx = fs.readFileSync('.git/index');

// Parse DIRC header
const sig = idx.slice(0,4).toString();
const ver = idx.readUInt32BE(4);
const count = idx.readUInt32BE(8);

let offset = 12;
const entries = [];

for (let i = 0; i < count; i++) {
  const ctime_sec = idx.readUInt32BE(offset);
  const ctime_ns  = idx.readUInt32BE(offset + 4);
  const mtime_sec = idx.readUInt32BE(offset + 8);
  const mtime_ns  = idx.readUInt32BE(offset + 12);
  const dev   = idx.readUInt32BE(offset + 16);
  const ino   = idx.readUInt32BE(offset + 20);
  const mode  = idx.readUInt32BE(offset + 24);
  const uid   = idx.readUInt32BE(offset + 28);
  const gid   = idx.readUInt32BE(offset + 32);
  const size  = idx.readUInt32BE(offset + 36);
  const sha   = idx.slice(offset + 40, offset + 60).toString('hex');
  const flags = idx.readUInt16BE(offset + 60);
  const namelen = flags & 0xFFF;
  
  let nameStart = offset + 62;
  let name;
  // If namelen < 0xFFF, name is null-terminated within that length
  // Find null terminator
  let j = nameStart;
  while (j < idx.length && idx[j] !== 0) j++;
  name = idx.slice(nameStart, j).toString('utf8');
  
  // Calculate actual entry size (aligned to 8 bytes)
  const entryEnd = j + 1;
  const paddedSize = ((entryEnd - offset) + 7) & ~7;
  const realEnd = offset + paddedSize;
  
  entries.push({ sha, name, offset, size: realEnd - offset });
  
  // Skip to next entry
  offset = realEnd;
}

console.log(`Found ${entries.length} entries in index`);
entries.forEach(e => console.log(`  ${e.sha}  ${e.name}`));

// Find the large PNG
const bad = entries.find(e => e.name === 'src/assets/hh-properties-logo-v2.png');
if (!bad) {
  console.log('File not in index - no fix needed');
  process.exit(0);
}
console.log(`\nRemoving: ${bad.name} at offset ${bad.offset}, size ${bad.size}`);

// Build new index without this entry
const newPieces = [
  idx.slice(0, 4), // DIRC
  Buffer.alloc(4),  // version placeholder
  Buffer.alloc(4),  // count placeholder
];

let newCount = 0;
let currentOffset = 12;

for (const e of entries) {
  if (e.name === bad.name) {
    currentOffset += e.size;
    continue;
  }
  newPieces.push(idx.slice(currentOffset, currentOffset + e.size));
  currentOffset += e.size;
  newCount++;
}

// Write header
const versionBuf = Buffer.alloc(4);
versionBuf.writeUInt32BE(2);
newPieces[1] = versionBuf;

const countBuf = Buffer.alloc(4);
countBuf.writeUInt32BE(newCount);
newPieces[2] = countBuf;

// Compute SHA-1 of index
const crypto = require('crypto');
const indexContent = Buffer.concat(newPieces);
const idxSha = crypto.createHash('sha1').update(indexContent).digest();
const withSha = Buffer.concat([indexContent, idxSha]);

fs.writeFileSync('.git/index', withSha);
console.log(`Written new index with ${newCount} entries (removed ${entries.length - newCount})`);

// Verify by trying to read it back
const verify = fs.readFileSync('.git/index');
console.log(`Verify: signature=${verify.slice(0,4).toString()} version=${verify.readUInt32BE(4)} entries=${verify.readUInt32BE(8)}`);
