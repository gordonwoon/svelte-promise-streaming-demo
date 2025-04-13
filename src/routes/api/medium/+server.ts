import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
  // This simulates a medium-speed API response (2000ms)
  await new Promise(resolve => setTimeout(resolve, 2000))

  return json({
    type: 'medium',
    message: 'This data took a bit longer to load (2000ms)',
    timestamp: new Date().toISOString()
  })
}
