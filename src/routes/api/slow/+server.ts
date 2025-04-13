import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
  // This simulates a slow API response (5000ms)
  await new Promise(resolve => setTimeout(resolve, 5000))

  return json({
    type: 'slow',
    message: 'This data loaded very slowly (5000ms)',
    timestamp: new Date().toISOString()
  })
}
