<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import Timeline from '$lib/Timeline.svelte';
	import NetworkWaterfall from '$lib/NetworkWaterfall.svelte';
	import StreamDebugger from '$lib/StreamDebugger.svelte';

	export let data: PageData;

	// These variables track when each promise resolves
	let fastDataLoadedAt: string | null = null;
	let mediumDataLoadedAt: string | null = null;
	let slowDataLoadedAt: string | null = null;

	// Store actual API response data for visualization
	let fastDataResponse: any = null;
	let mediumDataResponse: any = null;
	let slowDataResponse: any = null;

	// Timeline events for visualization
	let timelineEvents: { label: string; time: string; color: string }[] = [];

	// Network waterfall data
	let networkRequests: {
		name: string;
		startTime: string;
		endTime?: string;
		status: 'pending' | 'complete' | 'error';
		color: string;
	}[] = [
		{
			name: 'Fast API',
			startTime: data.startedAt,
			status: 'pending',
			color: '#42a5f5'
		},
		{
			name: 'Medium API',
			startTime: data.startedAt,
			status: 'pending',
			color: '#7e57c2'
		},
		{
			name: 'Slow API',
			startTime: data.startedAt,
			status: 'pending',
			color: '#ef5350'
		}
	];

	// Stream debugger chunks
	let streamChunks: {
		id: number;
		content: string;
		timestamp: string;
		type: 'html' | 'data' | 'hydration';
	}[] = [
		{
			id: 0,
			content: '<html>...<div id="app">',
			timestamp: data.startedAt,
			type: 'html'
		}
	];

	// Format the timestamp to show hours:minutes:seconds.milliseconds
	function formatTime(isoString: string): string {
		const date = new Date(isoString);
		return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}.${date.getMilliseconds().toString().padStart(3, '0')}`;
	}

	// Add a new stream chunk
	function addStreamChunk(content: string, type: 'html' | 'data' | 'hydration') {
		const timestamp = new Date().toISOString();
		streamChunks = [
			...streamChunks,
			{
				id: streamChunks.length,
				content,
				timestamp,
				type
			}
		];
	}

	// Track when promises resolve to demonstrate streaming
	onMount(() => {
		// Initial HTML structure loaded
		timelineEvents = [
			...timelineEvents,
			{
				label: 'Initial HTML',
				time: data.startedAt,
				color: '#2196F3'
			}
		];

		// The page mount event
		const mountedAt = new Date().toISOString();
		timelineEvents = [
			...timelineEvents,
			{
				label: 'Page Mounted',
				time: mountedAt,
				color: '#FF9800'
			}
		];

		addStreamChunk(
			'&lt;script&gt;hydrate();&lt;/script&gt;',
			'hydration'
		);

		// Fast data promise
		Promise.resolve(data.fastData).then(result => {
			fastDataLoadedAt = new Date().toISOString();
			fastDataResponse = result; // Store the actual API response

			// Update timeline
			timelineEvents = [
				...timelineEvents,
				{
					label: 'Fast Data',
					time: fastDataLoadedAt,
					color: '#42a5f5'
				}
			];

			// Update network waterfall
			networkRequests = networkRequests.map(req =>
				req.name === 'Fast API'
					? { ...req, endTime: fastDataLoadedAt || undefined, status: 'complete' }
					: req
			);

				// Create a realistic stream chunk with the actual API data
			const htmlChunk = `&lt;script&gt;
  // Fast data chunk (${formatTime(fastDataLoadedAt)})
  document.getElementById('fast-data-placeholder').innerHTML =
    \`&lt;p&gt;${result.message}&lt;/p&gt;
     &lt;p class="timestamp"&gt;Data loaded at: ${formatTime(result.timestamp)}&lt;/p&gt;\`;
&lt;/script&gt;`;

			addStreamChunk(htmlChunk, 'data');
		});

		// Medium data promise
		Promise.resolve(data.mediumData).then(result => {
			mediumDataLoadedAt = new Date().toISOString();
			mediumDataResponse = result; // Store the actual API response

			// Update timeline
			timelineEvents = [
				...timelineEvents,
				{
					label: 'Medium Data',
					time: mediumDataLoadedAt,
					color: '#7e57c2'
				}
			];

			// Update network waterfall
			networkRequests = networkRequests.map(req =>
				req.name === 'Medium API'
					? { ...req, endTime: mediumDataLoadedAt || undefined, status: 'complete' }
					: req
			);

				// Create a realistic stream chunk with the actual API data
			const htmlChunk = `&lt;script&gt;
  // Medium data chunk (${formatTime(mediumDataLoadedAt)})
  document.getElementById('medium-data-placeholder').innerHTML =
    \`&lt;p&gt;${result.message}&lt;/p&gt;
     &lt;p class="timestamp"&gt;Data loaded at: ${formatTime(result.timestamp)}&lt;/p&gt;\`;
&lt;/script&gt;`;

			addStreamChunk(htmlChunk, 'data');
		});

		// Slow data promise
		Promise.resolve(data.slowData).then(result => {
			slowDataLoadedAt = new Date().toISOString();
			slowDataResponse = result; // Store the actual API response

			// Update timeline
			timelineEvents = [
				...timelineEvents,
				{
					label: 'Slow Data',
					time: slowDataLoadedAt,
					color: '#ef5350'
				}
			];

			// Update network waterfall
			networkRequests = networkRequests.map(req =>
				req.name === 'Slow API'
					? { ...req, endTime: slowDataLoadedAt || undefined, status: 'complete' }
					: req
				);

				// Create a realistic stream chunk with the actual API data
			const htmlChunk = `&lt;script&gt;
  // Slow data chunk (${formatTime(slowDataLoadedAt)})
  document.getElementById('slow-data-placeholder').innerHTML =
    \`&lt;p&gt;${result.message}&lt;/p&gt;
     &lt;p class="timestamp"&gt;Data loaded at: ${formatTime(result.timestamp)}&lt;/p&gt;\`;
&lt;/script&gt;`;

			addStreamChunk(htmlChunk, 'data');

			// Add final HTML chunk
			addStreamChunk(
				'&lt;/div&gt;&lt;/body&gt;&lt;/html&gt;',
				'html'
			);
		});

		// Client-side script for tab functionality - moved from separate script tag
		// We need to wait for the DOM to be ready
		setTimeout(() => {
			const tabButtons = document.querySelectorAll('.tab-button');
			const tabContents = document.querySelectorAll('.tab-content');

			tabButtons.forEach((button, index) => {
				button.addEventListener('click', () => {
					// Remove active class from all buttons and contents
					tabButtons.forEach(btn => btn.classList.remove('active'));
					tabContents.forEach(content => content.classList.remove('active'));

					// Add active class to clicked button and corresponding content
					button.classList.add('active');
					tabContents[index].classList.add('active');
				});
			});
		}, 0);
	});
</script>

<h1>Streaming with Promises Example</h1>
<p>This example demonstrates how SvelteKit can stream data using promises. The page renders immediately and data becomes available as it arrives from the server.</p>
<p>Page load started at: {formatTime(data.startedAt)}</p>

<div class="tabs">
	<div class="tab-headers">
		<button class="tab-button active">Data Cards</button>
		<button class="tab-button">Visualizations</button>
	</div>

	<div class="tab-content active">
		<div class="data-container">
			<div class="data-card appear-animation">
				<h2>Fast Data</h2>
				{#await data.fastData}
					<div class="loading">Loading fast data...</div>
				{:then fastData}
					<p>{fastData.message}</p>
					<p class="timestamp">Data loaded at: {formatTime(fastData.timestamp)}</p>
					{#if fastDataLoadedAt}
						<p class="timestamp">UI updated at: {formatTime(fastDataLoadedAt)}</p>
					{/if}
				{:catch error}
					<p class="error">Error loading fast data: {error.message}</p>
				{/await}
			</div>

			<div class="data-card appear-animation" style="animation-delay: 0.1s">
				<h2>Medium Data</h2>
				{#await data.mediumData}
					<div class="loading">Loading medium data...</div>
				{:then mediumData}
					<p>{mediumData.message}</p>
					<p class="timestamp">Data loaded at: {formatTime(mediumData.timestamp)}</p>
					{#if mediumDataLoadedAt}
						<p class="timestamp">UI updated at: {formatTime(mediumDataLoadedAt)}</p>
					{/if}
				{:catch error}
					<p class="error">Error loading medium data: {error.message}</p>
				{/await}
			</div>

			<div class="data-card appear-animation" style="animation-delay: 0.2s">
				<h2>Slow Data</h2>
				{#await data.slowData}
					<div class="loading">Loading slow data...</div>
				{:then slowData}
					<p>{slowData.message}</p>
					<p class="timestamp">Data loaded at: {formatTime(slowData.timestamp)}</p>
					{#if slowDataLoadedAt}
						<p class="timestamp">UI updated at: {formatTime(slowDataLoadedAt)}</p>
					{/if}
				{:catch error}
					<p class="error">Error loading slow data: {error.message}</p>
				{/await}
			</div>
		</div>
	</div>

	<div class="tab-content">
		<div class="visualization-container">
			<Timeline events={timelineEvents} startTime={data.startedAt} />
			<NetworkWaterfall requests={networkRequests} pageStartTime={data.startedAt} />
			<StreamDebugger chunks={streamChunks} startTime={data.startedAt} />
		</div>
	</div>
</div>

<div class="explanation">
	<h2>How Streaming Works</h2>
	<div class="explanation-content">
		<p>
			SvelteKit's streaming SSR works by:
		</p>
		<ol>
			<li>
				<strong>Returning promises from the server</strong> - The server returns a response immediately with placeholders for data.
			</li>
			<li>
				<strong>Progressive HTML rendering</strong> - The initial HTML is sent, with streaming placeholders for async data.
			</li>
			<li>
				<strong>Streaming updates</strong> - As each promise resolves on the server, more HTML chunks are sent to the browser.
			</li>
			<li>
				<strong>Client-side rendering</strong> - The browser progressively renders these HTML chunks as they arrive.
			</li>
		</ol>
		<p>
			This improves perceived performance, since the initial page load is much faster (not waiting for all data) and users
			see content appearing progressively.
		</p>

		<div class="code-example">
			<h3>What Actually Gets Sent Over the Wire</h3>
			<div class="wire-chunks">
				<div class="chunk">
					<span class="chunk-time">0ms</span>
					<pre class="chunk-content html-chunk">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;...&lt;/head&gt;
  &lt;body&gt;
    &lt;div id="app"&gt;
      &lt;!-- Initial content with placeholders --&gt;
      &lt;div id="fast-data-placeholder"&gt;Loading fast data...&lt;/div&gt;
      &lt;div id="medium-data-placeholder"&gt;Loading medium data...&lt;/div&gt;
      &lt;div id="slow-data-placeholder"&gt;Loading slow data...&lt;/div&gt;
    </pre>
					<span class="chunk-label">Initial HTML with placeholders</span>
				</div>

				{#if fastDataResponse}
				<div class="chunk">
					<span class="chunk-time">~500ms</span>
					<pre class="chunk-content js-chunk">
&lt;script&gt;
  // When fast data resolves
  document.getElementById('fast-data-placeholder').innerHTML =
    `&lt;p&gt;{fastDataResponse.message}&lt;/p&gt;
     &lt;p class="timestamp"&gt;Data loaded at: {formatTime(fastDataResponse.timestamp)}&lt;/p&gt;`;
&lt;/script&gt;</pre>
					<span class="chunk-label">Fast data chunk</span>
				</div>
				{/if}

				{#if mediumDataResponse}
				<div class="chunk">
					<span class="chunk-time">~2000ms</span>
					<pre class="chunk-content js-chunk">
&lt;script&gt;
  // When medium data resolves
  document.getElementById('medium-data-placeholder').innerHTML =
    `&lt;p&gt;{mediumDataResponse.message}&lt;/p&gt;
     &lt;p class="timestamp"&gt;Data loaded at: {formatTime(mediumDataResponse.timestamp)}&lt;/p&gt;`;
&lt;/script&gt;</pre>
					<span class="chunk-label">Medium data chunk</span>
				</div>
				{/if}

				{#if slowDataResponse}
				<div class="chunk">
					<span class="chunk-time">~5000ms</span>
					<pre class="chunk-content js-chunk">
&lt;script&gt;
  // When slow data finally resolves
  document.getElementById('slow-data-placeholder').innerHTML =
    `&lt;p&gt;{slowDataResponse.message}&lt;/p&gt;
     &lt;p class="timestamp"&gt;Data loaded at: {formatTime(slowDataResponse.timestamp)}&lt;/p&gt;`;
&lt;/script&gt;
    &lt;/div&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
					<span class="chunk-label">Slow data chunk & closing HTML</span>
				</div>
				{/if}
			</div>
			<p class="note">Note: This is a simplified representation showing actual API response data. The real server implementation includes additional hydration code.</p>
		</div>
	</div>
</div>

<div class="nav-links">
	<a href="/">Back to Home</a>
	<a href="/standard">View Standard Example</a>
</div>

<style>
	.data-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1rem;
		margin: 2rem 0;
	}

	.data-card {
		border: 1px solid #ccc;
		border-radius: 5px;
		padding: 1rem;
		background-color: #f9f9f9;
		min-height: 200px;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.data-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0,0,0,0.15);
	}

	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100px;
		color: #666;
		font-style: italic;
		position: relative;
	}

	.loading::after {
		content: "";
		position: absolute;
		width: 20px;
		height: 20px;
		border: 2px solid #ccc;
		border-top-color: #0070f3;
		border-radius: 50%;
		animation: loading-spinner 0.8s linear infinite;
		margin-top: 30px;
	}

	@keyframes loading-spinner {
		to {
			transform: rotate(360deg);
		}
	}

	.timestamp {
		font-size: 0.8rem;
		color: #666;
	}

	.error {
		color: red;
	}

	.nav-links {
		margin-top: 2rem;
		display: flex;
		gap: 1rem;
	}

	a {
		display: inline-block;
		padding: 0.5rem 1rem;
		background-color: #0070f3;
		color: white;
		text-decoration: none;
		border-radius: 5px;
		transition: background-color 0.2s ease;
	}

	a:hover {
		background-color: #0051a8;
	}

	.tabs {
		margin: 2rem 0;
		border: 1px solid #ddd;
		border-radius: 8px;
		overflow: hidden;
	}

	.tab-headers {
		display: flex;
		background-color: #f3f3f3;
		border-bottom: 1px solid #ddd;
	}

	.tab-button {
		padding: 0.8rem 1.5rem;
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1rem;
		transition: background-color 0.2s;
		flex: 1;
		text-align: center;
		color: #666;
	}

	.tab-button:hover {
		background-color: #e0e0e0;
	}

	.tab-button.active {
		background-color: white;
		color: #0070f3;
		font-weight: bold;
		border-bottom: 2px solid #0070f3;
	}

	.tab-content {
		padding: 1rem;
		display: none;
	}

	.tab-content.active {
		display: block;
	}

	.visualization-container {
		padding: 1rem;
	}

	.explanation {
		margin: 2rem 0;
		padding: 1.5rem;
		background-color: #f9f9ff;
		border-left: 4px solid #0070f3;
		border-radius: 4px;
	}

	.explanation h2 {
		margin-top: 0;
		color: #0070f3;
	}

	.appear-animation {
		animation: appear 0.5s ease-out forwards;
		opacity: 0;
		transform: translateY(10px);
	}

	@keyframes appear {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
