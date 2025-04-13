import type { PageLoad } from './$types'

// Since we're using SSR, we just pass through the data
// that was loaded server-side in +page.server.ts
export const load: PageLoad = async ({ data }) => {
  return {
    ...data,
    // We can add additional client-side only data here if needed
    clientLoadedAt: new Date().toISOString()
  }
}
