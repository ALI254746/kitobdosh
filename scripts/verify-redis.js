const fs = require('fs');
const path = require('path');
const Redis = require('ioredis');

// 1. Manually parse .env.local to get config
const envPath = path.join(__dirname, '..', '.env.local');
let envContent = '';
try {
    envContent = fs.readFileSync(envPath, 'utf8');
} catch (e) {
    console.error('Could not read .env.local:', e.message);
    process.exit(1);
}

const envVars = {};

envContent.split('\n').forEach(line => {
    // Basic parsing, doesn't handle multiline or complex quotes perfectly but enough for simple config
    const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
    if (match) {
        let key = match[1];
        let value = match[2] || '';
        // Remove surrounding quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
            value = value.slice(1, -1);
        }
        envVars[key] = value;
    }
});

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = envVars;

console.log('------------------------------------------------');
console.log('Testing Redis Connection settings from .env.local:');
console.log('Host:', REDIS_HOST);
console.log('Port:', REDIS_PORT);
console.log('Password:', REDIS_PASSWORD ? '****** (Set)' : '(Not Set)');
console.log('------------------------------------------------');

if (!REDIS_HOST) {
    console.error('❌ Error: REDIS_HOST not found in .env.local');
    process.exit(1);
}

const redis = new Redis({
    host: REDIS_HOST,
    port: parseInt(REDIS_PORT || '6379'),
    password: REDIS_PASSWORD,
    connectTimeout: 5000, 
    maxRetriesPerRequest: 1
});

redis.on('connect', () => {
    console.log('✅ Connection Successful! Redis is responding.');
    redis.quit();
    process.exit(0);
});

redis.on('error', (err) => {
    console.error('❌ Connection Failed:', err.message);
    redis.disconnect(); // force disconnect
    process.exit(1);
});
