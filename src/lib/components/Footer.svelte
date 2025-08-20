<footer class="footer">
	<div class="container">
		<div class="footer__logo">
			<!-- <img src="logo.svg" alt="Logo" /> -->
		</div>

		<div class="footer__main">
			<div class="footer__about">
				<p>
					Built with ❤️ by Mariel, a web developer who loves data, dev, and interactive learning.
				</p>
			</div>

			<div class="footer__address">
				<p>Connect with me:</p>
				<ul class="footer__links">
					<li><a href="https://github.com/mariel-delagarza">GitHub</a></li>
					<li><a href="https://bsky.app/profile/mariel.bsky.social">BlueSky</a></li>
					<li><a href="mailto:mariel.code@gmail.com">Email</a></li>
				</ul>
			</div>
		</div>

		<div class="footer__copyright">
			<p>
				© 2025 Mariel de la Garza. All rights reserved.
			</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		background-color: #141624;
		color: #fff;
		padding: 2rem;
		font-size: 0.95rem;
	}

	.footer__main {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.footer__about {
		flex: 1 1 60%;
		color: #ccc;
	}

	.footer__address {
		flex: 1 1 35%;
	}

	.footer__copyright {
		font-size: 0.875rem;
		color: #aaa;
	}

	.footer__copyright a {
		color: #fff;
		text-decoration: underline;
	}

	.footer__links {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		gap: 1rem;
	}

	.footer__links a {
		color: #fff;
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.footer__links a:hover {
		color: #ffdd57;
	}
</style>
