# SvelteKit Streaming with Promises Demo

This project demonstrates how to implement streaming with promises in SvelteKit. It shows how to load data progressively while rendering the page, providing a better user experience compared to waiting for all data to load before rendering.

## Key Concepts Demonstrated

1. **Standard Loading Approach**: Shows how SvelteKit typically loads data, waiting for all promises to resolve before rendering the page.
2. **Streaming with Promises**: Demonstrates how to stream data by returning promises directly from load functions.
3. **Progressive UI Updates**: Shows how to use Svelte's `#await` blocks to handle loading states and progressively update the UI.

## Project Structure

- `/src/routes/api/` - Contains API endpoints that simulate different response times
- `/src/routes/standard/` - Demonstrates the standard (non-streaming) approach
- `/src/routes/streaming/` - Demonstrates streaming with promises

## How Streaming Works

SvelteKit's streaming feature works by:

1. Returning promises directly from the load function instead of awaiting them
2. Using Svelte's `#await` blocks in the component to handle the loading, success, and error states
3. The page renders immediately with the initial data and updates as promises resolve

## Running the Project

### Online Demo

You can try this demo without any setup by visiting the CodeSandbox link below:

[Open in CodeSandbox](https://codesandbox.io/p/github/[your-username]/svelte-streaming-demo)

### Local Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:5173` to see the demo in action.

## What to Expect

- When visiting the standard example, the page will load only after all data is fetched (including the 5-second slow data).
- When visiting the streaming example, the page will render immediately, and sections will update as their data becomes available.

This project helps understand the practical implementation of the concepts explained in the [SvelteKit documentation on streaming with promises](https://svelte.dev/docs/kit/load#streaming-with-promises).
# svelte-promise-streaming-demo
