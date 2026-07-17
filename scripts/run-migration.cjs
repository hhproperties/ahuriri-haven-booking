const https = require('https');
const fs = require('fs');

const sql = fs.readFileSync('supabase/migrations/20260717220000_blog_variants.sql', 'utf8');
const key = (fs.readFileSync('.env', 'utf8').match(/PUBLISHABLE_KEY="([^"]+)/) || [])[1];
const url = (fs.readFileSync('.env', 'utf8').match(/VITE_SUPABASE_URL="([^"]+)/) || [])[1];

const payload = JSON.stringify({ query: sql });

const req = https.request(
  url + '/rest/v1/rpc/',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': key,
      'Authorization': 'Bearer ' + key,
    },
  },
  (res) => {
    let data = '';
    res.on('data', (c) => (data += c));
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      console.log('Response:', data.slice(0, 500));
    });
  }
);
req.on('error', (e) => console.error('Error:', e.message));
req.end(payload);
