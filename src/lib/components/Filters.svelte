<!-- This is for (potentially) filters that will be used on mobile -->
<div id="filters">
	<strong>Filters</strong>
</div>

<style>
	#filters {
    display: none;
	}

	@media (max-width: 600px) {
		#filters {
			outline: 1px solid red;
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			background-color: white;
			z-index: 1000;
		}
	}
</style>
