<header class="header">
	<div class="header__title">
		<h1>Critical Minerals: An Overview</h1>
		<p class="subtitle">I'm a subtitle</p>
	</div>
</header>

<style>
	.header {
		padding: 2rem 1rem;
		background-color: #f8f8f8;
		border-bottom: 1px solid #ddd;
		width: 100%;
		display: flex;
		align-items: center; /* vertically center content */
		justify-content: center; /* horizontally center content */
    flex-wrap: wrap; /* allow wrapping on smaller screens */
	}

	.header__title {
		/* max-width: 1200px; */
		margin: 0 auto;
		text-align: center;
	}

	h1 {
		font-size: 2.2rem;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		font-size: 1rem;
		color: #555;
		margin: 0;
	}
	@media (max-width: 768px) {
		h1 {
			font-size: 1.8rem;
		}

		.subtitle {
			font-size: 1rem;
		}
	}

	@media (max-width: 480px) {
		h1 {
			font-size: 1.5rem;
		}

		.subtitle {
			font-size: 0.95rem;
		}
	}
</style>
