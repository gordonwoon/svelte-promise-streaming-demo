import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch }) => {
  // Server-side rendering approach - fetch all data on the server
  const fastDataPromise = fetch('/api/fast').then(r => r.json())
  const mediumDataPromise = fetch('/api/medium').then(r => r.json())
  const slowDataPromise = fetch('/api/slow').then(r => r.json())

  // With this approach, we wait for ALL promises to resolve before sending the response
  const [fastData, mediumData, slowData] = await Promise.all([
    fastDataPromise,
    mediumDataPromise,
    slowDataPromise
  ])

  return {
    fastData,
    mediumData,
    slowData,
    // Include timing information so we can see when data was loaded
    loadedAt: new Date().toISOString()
  }
}
