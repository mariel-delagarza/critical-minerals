<script>
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import Main from '$lib/components/Main.svelte';
  import About from '$lib/components/About.svelte';

  export let data;
</script>

<Header/>
<Main {data} />
<About />
<Footer />