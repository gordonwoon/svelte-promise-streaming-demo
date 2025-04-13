<script lang="ts">
  export let requests: {
    name: string;
    startTime: string;
    endTime?: string;
    status: 'pending' | 'complete' | 'error';
    color: string;
  }[] = [];
  export let pageStartTime: string;

  // Format the timestamp to show hours:minutes:seconds.milliseconds
  function formatTime(isoString: string): string {
    const date = new Date(isoString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}.${date.getMilliseconds().toString().padStart(3, '0')}`;
  }

  // Calculate time elapsed in ms
  function getElapsedTime(startTime: string, endTime?: string): number {
    const start = new Date(startTime).getTime();
    const end = endTime ? new Date(endTime).getTime() : Date.now();
    return end - start;
  }

  // Calculate position and width for waterfall bar
  function getBarStyles(startTime: string, endTime?: string) {
    const pageStart = new Date(pageStartTime).getTime();
    const requestStart = new Date(startTime).getTime();
    const requestEnd = endTime ? new Date(endTime).getTime() : Date.now();

    // Assuming 5000ms (5s) is the max duration we want to show
    const maxDuration = 5000;

    // Calculate left position (start time) as percentage
    const leftPos = Math.min(((requestStart - pageStart) / maxDuration) * 100, 100);

    // Calculate width (duration) as percentage
    const width = Math.min(((requestEnd - requestStart) / maxDuration) * 100, 100 - leftPos);

    return {
      left: `${leftPos}%`,
      width: `${width}%`
    };
  }

  // Calculate duration in ms and format it
  function formatDuration(startTime: string, endTime?: string): string {
    const duration = getElapsedTime(startTime, endTime);
    return `${duration}ms`;
  }
</script>

<div class="waterfall-container">
  <h2>Network Waterfall</h2>
  <div class="waterfall-header">
    <div class="waterfall-label">Request</div>
    <div class="waterfall-timeline">Timeline</div>
    <div class="waterfall-duration">Duration</div>
  </div>

  {#each requests as request}
    <div class="waterfall-row">
      <div class="waterfall-label">
        {request.name}
        <span class="waterfall-status" class:complete={request.status === 'complete'} class:pending={request.status === 'pending'} class:error={request.status === 'error'}>
          {request.status}
        </span>
      </div>

      <div class="waterfall-timeline">
        <div
          class="waterfall-bar"
          style="left: {getBarStyles(request.startTime, request.endTime).left}; width: {getBarStyles(request.startTime, request.endTime).width}; background-color: {request.color};"
        >
          <div class="waterfall-tooltip">
            Start: {formatTime(request.startTime)}<br>
            {#if request.endTime}
              End: {formatTime(request.endTime)}<br>
            {/if}
            Duration: {formatDuration(request.startTime, request.endTime)}
          </div>
        </div>
      </div>

      <div class="waterfall-duration">
        {formatDuration(request.startTime, request.endTime)}
      </div>
    </div>
  {/each}
</div>

<style>
  .waterfall-container {
    margin: 2rem 0;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f8f8f8;
  }

  .waterfall-header, .waterfall-row {
    display: grid;
    grid-template-columns: 150px 1fr 80px;
    gap: 1rem;
    align-items: center;
    padding: 0.5rem 0;
  }

  .waterfall-header {
    font-weight: bold;
    border-bottom: 1px solid #ddd;
    padding-bottom: 0.75rem;
  }

  .waterfall-label {
    font-size: 0.9rem;
  }

  .waterfall-status {
    display: inline-block;
    font-size: 0.75rem;
    padding: 0.1rem 0.4rem;
    border-radius: 3px;
    margin-left: 0.5rem;
  }

  .waterfall-status.pending {
    background-color: #f5da42;
    color: #333;
  }

  .waterfall-status.complete {
    background-color: #4caf50;
    color: white;
  }

  .waterfall-status.error {
    background-color: #f44336;
    color: white;
  }

  .waterfall-timeline {
    position: relative;
    height: 20px;
    background-color: #e0e0e0;
    border-radius: 2px;
  }

  .waterfall-bar {
    position: absolute;
    height: 100%;
    border-radius: 2px;
    opacity: 0.8;
    transition: opacity 0.2s ease;
  }

  .waterfall-bar:hover {
    opacity: 1;
  }

  .waterfall-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0,0,0,0.8);
    color: white;
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
    border-radius: 3px;
    white-space: nowrap;
    z-index: 10;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .waterfall-bar:hover .waterfall-tooltip {
    opacity: 1;
  }

  .waterfall-duration {
    font-size: 0.85rem;
    text-align: right;
    color: #666;
  }
</style>
