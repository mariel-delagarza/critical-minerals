// +page.js
import { getData } from '$lib/data.js';

export const ssr = false; // Disable server-side rendering (required for browser-only fetch)
export const prerender = true;  // Optional: prebuild the page as static HTML (useful for GH Pages)

export async function load() {
  const data = await getData(); // Fetch data from the data.js module
  return { data };
}
