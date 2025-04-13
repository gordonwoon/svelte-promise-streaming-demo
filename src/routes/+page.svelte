<script>
	import { onMount } from 'svelte';

	// Used to track if we're in the browser or during SSR
	let mounted = false;

	onMount(() => {
		mounted = true;
	});
</script>

<main>
	<h1>SvelteKit Streaming with Promises Demo</h1>

	<p>
		This application demonstrates how streaming with promises works in SvelteKit.
		By returning promises directly from a load function, SvelteKit can start rendering
		the page immediately while data is still being fetched.
	</p>

	<div class="examples">
		<div class="example-card">
			<h2>Standard Approach</h2>
			<p>
				This example shows the traditional approach where all data must be loaded
				before the page renders. The page will only appear once all three API calls
				complete (including the slow 5-second one).
			</p>
			<a href="/standard" class="btn">View Standard Example</a>
		</div>

		<div class="example-card">
			<h2>Streaming with Promises</h2>
			<p>
				This example demonstrates how to use streaming with promises in SvelteKit.
				The page renders immediately, and each section updates as its data becomes
				available. This provides a much better user experience.
			</p>
			<a href="/streaming" class="btn">View Streaming Example</a>
		</div>
	</div>

	<div class="info-section">
		<h2>How It Works</h2>
		<p>
			In the standard approach, we use <code>await Promise.all()</code> to wait for all data
			to be fetched before returning from the load function:
		</p>

		<pre><code>{'export const load = async ({ fetch }) => {\n  const [fastData, mediumData, slowData] = await Promise.all([\n    fetch(\'/api/fast\').then(r => r.json()),\n    fetch(\'/api/medium\').then(r => r.json()),\n    fetch(\'/api/slow\').then(r => r.json())\n  ]);\n  \n  return { fastData, mediumData, slowData };\n};'}</code></pre>

		<p>
			With streaming, we return the promises directly without awaiting them:
		</p>

		<pre><code>{'export const load = async ({ fetch }) => {\n  return {\n    fastData: fetch(\'/api/fast\').then(r => r.json()),\n    mediumData: fetch(\'/api/medium\').then(r => r.json()),\n    slowData: fetch(\'/api/slow\').then(r => r.json())\n  };\n};'}</code></pre>

		<p>
			Then in the component, we use Svelte's <code>#await</code> blocks to handle the promises:
		</p>

		<pre><code>{'{#await data.fastData}\n  <div class="loading">Loading...</div>\n{:then fastData}\n  <p>{fastData.message}</p>\n{:catch error}\n  <p class="error">Error: {error.message}</p>\n{/await}'}</code></pre>

		<p>
			This allows the page to render immediately and update as data becomes available.
		</p>
	</div>
</main>

<style>
	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 1rem;
		color: #333;
	}

	.examples {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin: 2rem 0;
	}

	.example-card {
		border: 1px solid #e2e8f0;
		border-radius: 0.5rem;
		padding: 1.5rem;
		background-color: #f8fafc;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.btn {
		display: inline-block;
		background-color: #0070f3;
		color: white;
		padding: 0.6rem 1.2rem;
		border-radius: 0.25rem;
		text-decoration: none;
		font-weight: 500;
		margin-top: 1rem;
	}

	.info-section {
		margin-top: 3rem;
		padding: 1.5rem;
		border: 1px solid #e2e8f0;
		border-radius: 0.5rem;
		background-color: #f8fafc;
	}

	pre {
		background-color: #1e293b;
		color: #e2e8f0;
		padding: 1rem;
		border-radius: 0.25rem;
		overflow-x: auto;
		margin: 1rem 0;
	}

	code {
		font-family: 'Fira Code', monospace;
		font-size: 0.9rem;
	}
</style>
