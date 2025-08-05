<script>
	import { onMount } from 'svelte';
	import { getData } from '$lib/data.js';
	import Header from '$lib/components/Header.svelte';
	import Main from '$lib/components/Main.svelte';

	let data = [];

	onMount(async () => {
		try {
			data = await getData();
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	});
</script>

<Header/>
<Main {data} />
