<script lang="ts">
  export let chunks: {
    id: number;
    content: string;
    timestamp: string;
    type: 'html' | 'data' | 'hydration';
  }[] = [];
  export let startTime: string;

  // Format the timestamp to show hours:minutes:seconds.milliseconds
  function formatTime(isoString: string): string {
    const date = new Date(isoString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}.${date.getMilliseconds().toString().padStart(3, '0')}`;
  }

  // Get elapsed time in milliseconds
  function getElapsedTime(time: string): number {
    const start = new Date(startTime).getTime();
    const current = new Date(time).getTime();
    return current - start;
  }

  // Get type color
  function getTypeColor(type: 'html' | 'data' | 'hydration'): string {
    switch (type) {
      case 'html': return '#2196F3';
      case 'data': return '#4CAF50';
      case 'hydration': return '#FF9800';
      default: return '#666';
    }
  }

  // Get type name
  function getTypeName(type: 'html' | 'data' | 'hydration'): string {
    switch (type) {
      case 'html': return 'HTML Structure';
      case 'data': return 'Data Chunk';
      case 'hydration': return 'Hydration';
      default: return type;
    }
  }
</script>

<div class="stream-debugger">
  <h2>HTML Stream Debugger</h2>
  <p class="debugger-info">This visualizes the HTML chunks as they're streamed from the server to the browser</p>

  <div class="stream-timeline">
    <div class="timeline-start">Start: {formatTime(startTime)}</div>
    <div class="timeline-chunks">
      {#each chunks as chunk}
        <div class="timeline-chunk" style="background-color: {getTypeColor(chunk.type)}" title="{getTypeName(chunk.type)} at {formatTime(chunk.timestamp)} (+{getElapsedTime(chunk.timestamp)}ms)"></div>
      {/each}
    </div>
  </div>

  <div class="stream-chunks">
    {#each chunks as chunk}
      <div class="chunk-card" style="border-left-color: {getTypeColor(chunk.type)}">
        <div class="chunk-header">
          <span class="chunk-type" style="background-color: {getTypeColor(chunk.type)}">{getTypeName(chunk.type)}</span>
          <span class="chunk-time">+{getElapsedTime(chunk.timestamp)}ms</span>
        </div>
        <pre class="chunk-content">{chunk.content}</pre>
      </div>
    {/each}
  </div>
</div>

<style>
  .stream-debugger {
    margin: 2rem 0;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f8f8f8;
  }

  .debugger-info {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  .stream-timeline {
    margin: 1.5rem 0;
  }

  .timeline-start {
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 0.25rem;
  }

  .timeline-chunks {
    height: 20px;
    background-color: #e0e0e0;
    border-radius: 4px;
    display: flex;
    overflow: hidden;
  }

  .timeline-chunk {
    width: 3px;
    height: 100%;
    margin-right: 2px;
  }

  .stream-chunks {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
  }

  .chunk-card {
    border-left: 4px solid;
    margin: 0.5rem;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .chunk-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border-bottom: 1px solid #eee;
  }

  .chunk-type {
    font-size: 0.8rem;
    padding: 2px 6px;
    border-radius: 3px;
    color: white;
  }

  .chunk-time {
    font-size: 0.8rem;
    color: #666;
  }

  .chunk-content {
    padding: 0.5rem;
    margin: 0;
    font-size: 0.8rem;
    white-space: pre-wrap;
    word-break: break-all;
    max-height: 100px;
    overflow-y: auto;
    background-color: #f5f5f5;
    border-radius: 0 0 4px 0;
  }
</style>
