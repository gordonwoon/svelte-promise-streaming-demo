<script lang="ts">
  export let events: { label: string; time: string; color: string }[] = [];
  export let startTime: string;

  // Format the timestamp to show hours:minutes:seconds.milliseconds
  function formatTime(isoString: string): string {
    const date = new Date(isoString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}.${date.getMilliseconds().toString().padStart(3, '0')}`;
  }

  // Calculate relative position based on time difference
  function getPositionPercent(time: string): number {
    const start = new Date(startTime).getTime();
    const eventTime = new Date(time).getTime();
    const duration = Math.max(eventTime - start, 0);

    // Cap at 100% and ensure we have some minimum spacing
    // Assuming most events happen within 5 seconds
    return Math.min(Math.max((duration / 5000) * 100, 0), 100);
  }
</script>

<div class="timeline-container">
  <h2>Streaming Timeline</h2>
  <div class="timeline">
    <div class="timeline-start" title="Page load started">
      {formatTime(startTime)}
    </div>

    <div class="timeline-track">
      {#each events as event}
        <div
          class="timeline-event"
          style="left: {getPositionPercent(event.time)}%; background-color: {event.color};"
          title="{event.label} at {formatTime(event.time)}"
        >
          <div class="timeline-event-label">{event.label}</div>
        </div>
      {/each}
    </div>
  </div>

  <div class="timeline-legend">
    {#each events as event}
      <div class="legend-item">
        <div class="legend-color" style="background-color: {event.color};"></div>
        <div class="legend-label">{event.label}: {formatTime(event.time)}</div>
      </div>
    {/each}
  </div>
</div>

<style>
  .timeline-container {
    margin: 2rem 0;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f8f8f8;
  }

  .timeline {
    position: relative;
    height: 80px;
    margin: 1.5rem 0;
  }

  .timeline-start {
    position: absolute;
    left: 0;
    bottom: 100%;
    font-size: 0.8rem;
    color: #666;
  }

  .timeline-track {
    position: relative;
    height: 8px;
    background-color: #e0e0e0;
    border-radius: 4px;
    overflow: visible;
  }

  .timeline-event {
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transition: transform 0.3s ease;
    z-index: 2;
  }

  .timeline-event:hover {
    transform: translate(-50%, -50%) scale(1.5);
    z-index: 3;
  }

  .timeline-event-label {
    position: absolute;
    bottom: 100%;
    left: 0;
    transform: translateX(-50%);
    font-size: 0.7rem;
    white-space: nowrap;
    color: #333;
    margin-bottom: 5px;
    display: none;
  }

  .timeline-event:hover .timeline-event-label {
    display: block;
  }

  .timeline-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
  }

  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
</style>
