<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	// Format the timestamp to show hours:minutes:seconds.milliseconds
	function formatTime(isoString: string): string {
		const date = new Date(isoString);
		return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}.${date.getMilliseconds().toString().padStart(3, '0')}`;
	}
</script>

<h1>Standard Approach (No Streaming)</h1>
<p>This example demonstrates how SvelteKit normally loads data in a +page.ts file. All data needs to be loaded before the page renders.</p>
<p>Page load completed at: {formatTime(data.loadedAt)}</p>

<div class="data-container">
	<div class="data-card">
		<h2>Fast Data</h2>
		<p>{data.fastData.message}</p>
		<p class="timestamp">Loaded at: {formatTime(data.fastData.timestamp)}</p>
	</div>

	<div class="data-card">
		<h2>Medium Data</h2>
		<p>{data.mediumData.message}</p>
		<p class="timestamp">Loaded at: {formatTime(data.mediumData.timestamp)}</p>
	</div>

	<div class="data-card">
		<h2>Slow Data</h2>
		<p>{data.slowData.message}</p>
		<p class="timestamp">Loaded at: {formatTime(data.slowData.timestamp)}</p>
	</div>
</div>

<div class="nav-links">
	<a href="/">Back to Home</a>
	<a href="/streaming">View Streaming Example</a>
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
	}

	.timestamp {
		font-size: 0.8rem;
		color: #666;
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
	}
</style>
