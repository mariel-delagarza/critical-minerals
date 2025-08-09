import { writable } from 'svelte/store';

console.log("📦 Initializing portsData store...");
export const selectedElement = writable(null);
