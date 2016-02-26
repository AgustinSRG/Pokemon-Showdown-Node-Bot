#!/usr/bin/env node

try {
	require('sugar');
	require('colors');
	require('websocket')
} catch (e) {
	console.log('Installing dependencies...');
	require('child_process').spawnSync('sh', ['-c', 'npm install --production'], {stdio: 'inherit'});
}

// Start the Bot

require('./index.js');
