import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

// Server-side streaming implementation
export const load: PageServerLoad = async ({ fetch }) => {
  // With streaming SSR, we return promises directly from the server
  // The server will start streaming the response immediately
  // and fill in the data as each promise resolves

  // Create timestamp for when the load function started
  const startedAt = new Date().toISOString()

  // In server-side streaming, we don't await these promises
  // The server will stream the HTML with placeholders, then fill them in as data arrives
  return {
    // The fast data will be available almost immediately
    fastData: fetch('/api/fast').then(r => r.json()),

    // The medium data will take a bit longer
    mediumData: fetch('/api/medium').then(r => r.json()),

    // The slow data will take the longest, but the page will start rendering before it's ready
    slowData: fetch('/api/slow').then(r => r.json()),

    // This data is available immediately
    startedAt
  }
}
