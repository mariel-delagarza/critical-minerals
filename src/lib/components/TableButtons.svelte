<!-- src/lib/components/TableButtons.svelte -->
<script>
    import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let activeFilter = 'all';

  const filters = [
    { id: 'all', label: 'All Lists' },
    { id: 'doi', label: '2022 DOI' },
    { id: 'doe', label: 'DOE' },
    { id: 'dla', label: 'DLA' }
  ];

    function changeFilter(id) {
    dispatch('filterChange', { id });
  }
</script>

<div class="table-buttons">
  {#each filters as { id, label }}
    <button
      class:selected={activeFilter === id}
      on:click={() => changeFilter(id)}
    >
      {label}
    </button>
  {/each}
</div>

<style>
  .table-buttons {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
    margin-top: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    font-weight: bold;
    border: 2px solid #444;
    background: white;
    cursor: pointer;
    border-radius: 0.25rem;
  }

  .selected {
    background-color: #444;
    color: white;
  }
</style>
