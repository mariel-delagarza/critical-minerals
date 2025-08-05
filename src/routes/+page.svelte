<script>
  import { onMount } from 'svelte';
  import { getData } from '$lib/data.js';

  let data = []

  onMount(async() => {
    try {
      data = await getData();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
