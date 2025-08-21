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
	<h2>Legal Definitions</h2>
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
		U.S. law <em>also</em> defines critical minerals as "any non-fuel mineral, element, substance,
		or material that the Secretary of Energy determines has a high risk of supply chain disruption;
		and serves an essential function in 1 or more energy technologies, including technologies that
		produce, transmit, store and conserve energy; or a critical mineral."<sup class="footnote"
			><a href="#footnote3">3</a></sup
		>
	</p>
	<p>But wait, there's more.</p>
	<p>
		With the Strategic and Critical Minerals Stock Piling Act of 1939, Congress provided for the
		establishment of a National Defense Stockpile.<sup class="footnote"
			><a href="#footnote4">4</a></sup
		>
		This stockpile is meant to “decrease and to preclude, when possible, a dangerous and costly dependency
		by the United States upon foreign sources or a single point of failure for supply of [certain strategic
		and critical materials] in times of national emergency.”<sup class="footnote"
			><a href="#footnote5">5</a></sup
		>
		The law defines “materials critical to national security” as those:<sup class="footnote"
			><a href="#footnote6">6</a></sup
		>
	</p>
	<ol>
		<li>Upon which the production or sustainment of military equipment is dependent; and</li>
		<li>
			The supply of which could be restricted by actions or events outside the control of the
			Government of the United States.
		</li>
	</ol>
	<p>
		This leaves us with three main sources for what minerals and materials are “critical” to the
		United States: the Department of Interior (DOI), the Department of Energy (DOE), and the
		Department of Defense (DOD).
	</p>
	<h2>Lists</h2>
	<p>
		There are two official lists of critical minerals, published by the Department of Interior
		through the U.S. Geological Survey (USGS) and the Department of Energy. These are the
		result of determinations made according to the definitions above.
There's also a quasi-official list published by the Department of Defense's Defense Logistics
		Agency (DLA), called "Materials of Interest."<sup class="footnote"><a href="#foonote6">6</a></sup>
	</p>
	<p>
		In 2022, USGS released its List of Critical
		Minerals "based on directives from the Energy Act of 2020."<sup class="footnote"
			><a href="#footnote4">7</a></sup
		>
		In 2023, DOE followed with its own list. It includes minerals that are specifically
		important to energy applications, "as well as those on critical minerals on the [USGS] 2022 final list".<sup class="footnote"><a href="#footnote5">8</a></sup>
	</p>
	<p>
		The DLA Strategic Materials office is the part of DOD that “is
		responsible for providing safe, secure, and environmentally sound stewardship for strategic and
		critical materials in the United States National Defense Stockpile (NDS).”<sup class="footnote"
			><a href="#footnote9">9</a></sup
		>
		It maintains a list of Materials of Interest<sup class="footnote"
			><a href="#footnote10">10</a></sup> that has many items in common with the lists from the DOI and DOE,
			in addition to those of special interest to DOD due to their defense applications.
		
	</p>
  	<p>But what <span class="italic-bold">are</span> they?</p>

	<h2>This Tool</h2>
	<p>
		Below, the critical minerals and materials have been mapped to the periodic table of elements.
		If you click on an element, you'll be able to see:
	</p>
	<ul>
		<li>What lists it's on</li>
		<li>
			Whether it appears on a list but in a different form (for example, graphite is 100% carbon,
			but "Carbon" is not on any of the lists while "Graphite (Natural)" is)
		</li>
		<li>
			Net import reliance<sup class="footnote"><a href="#footnote11">11</a></sup> from 2020-2024
		</li>
		<li>What countries it's imported from</li>
		<li>What it's used for</li>
	</ul>
	<h2>Conclusion</h2>
	<p>
		Critical minerals are a recurring subject of legislation and public discourse due to their
		strategic importance to national security and the economy. However, the language used to discuss
		them is often vague and buzzword-heavy or assumes a level of familiarity with the topic that
		many people don’t have. News coverage will emphasize the risks of relying on countries like
		China for our supply, but rarely break down what these minerals are or why they matter to all of
		us, not just those working in national security and defense.
	</p>
	<p>
		This visualization was created to make the subject more approachable and provide a starting
		point for anyone interested in learning more. The information presented isn’t exhaustive, but it
		consolidates information from multiple federal sources in a way that’s easy to quickly
		understand, and provides direct links to resources for those who want to learn more.
	</p>
</div>

<style>
	#legend {
		font-family: 'Source Serif 4', serif;
		font-size: 1.25rem;
		font-weight: 400;
		outline: 1px solid red;
		max-width: 50%;
		width: 100%;
		color: #333;
		margin: 5rem auto;
	}

  .footnote a {
    color: #6e1e43;
  }

  .footnote a:hover {
    color: #bc8fa1;
    transition: color 0.3s ease-in-out; 
  }

	.italic-bold {
		font-weight: bold;
		font-style: italic;
	}

  h2 {
    font-family: 'Roboto';
  }

	@media (max-width: 1250px) {
		#legend {
			max-width: 100%;
		}
	}
</style>
