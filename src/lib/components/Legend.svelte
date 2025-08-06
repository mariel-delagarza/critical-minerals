<script>
	import Page from '../../routes/+page.svelte';
</script>

<!-- This will be under the title and contain any notes, explanations, or legends/colors for the table -->
<div id="legend">
	<p>
		What is a "critical mineral"? There isn't one settled definition. Broadly, they're minerals that
		are important for manufacturing items that we need for things like energy, defense, and health
		care. These include things we use every day, like the batteries that power our phones and cars,
		fiber optics that enable high-speed internet, and liquid crystal displays for our televisions.
		They also include things like fertilizers, cancer treatments, permanent magnets, and nuclear
		control rods.<sup class="footnote"><a href="#footnote1">1</a></sup>
	</p>
	<p>
		U.S. law<sup class="footnote"><a href="#footnote2">2</a></sup> defines critical minerals as those
		that the Secretary of the Interior determines to meet three criteria:
	</p>
	<ol>
		<li>They are essential to the economic or national security of the United States;</li>
		<li>
			Their supply chain is vulnerable to disruption. These disruptions can include foreign
			political risk, abrupt demand growth, military conflict, violent unrest, anti-competitive or
			protectionist behaviors, and other risks throughout the supply chain.
		</li>
		<li>
			And, they serve an essential function in the manufacturing of a product that, should we go
			without it, would have significant consequences for the economic or national security of the
			United States. These products can include those in energy technology, defense, currency,
			agriculture, consumer electronics, and health-care.
		</li>
	</ol>
	<p>
		U.S. law <em>also</em> defines critical minerals as "any non-fuel mineral, element, substance, or
		material that the Secretary of Energy determines has a high risk of supply chain disruption; and
		serves an essential function in 1 or more energy technologies, including technologies that produce,
		transmit, store and conserve energy; or a critical mineral."<sup class="footnote"><a href="#footnote3">3</a></sup>
	</p>
</div>

<style>
	#legend {
		font-size: 1.2rem;
		outline: 1px solid red;
		max-width: 50%;
		width: 100%;
		color: #333;
	}

	@media (max-width: 1250px) {
		#legend {
			max-width: 100%;
		}
	}
</style>
