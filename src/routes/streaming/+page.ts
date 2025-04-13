import type { PageLoad } from './$types'

// This is a simple pass-through for server data
// We're now using server-side streaming via +page.server.ts
export const load: PageLoad = async ({ data }) => {
  // Simply return the data from the server
  return data
}
