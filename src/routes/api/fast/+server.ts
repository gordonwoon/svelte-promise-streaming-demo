import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
  // This simulates a fast API response (500ms)
  await new Promise(resolve => setTimeout(resolve, 500))

  return json({
    type: 'fast',
    message: 'This data loaded quickly (500ms)',
    timestamp: new Date().toISOString()
  })
}
