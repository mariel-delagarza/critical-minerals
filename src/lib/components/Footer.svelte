<footer class="footer">
	<div class="container">
		<div class="footer__logo">
			<img src="logo.svg" alt="Logo" />
		</div>

		<div class="footer__main">
			<div class="footer__about">
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
					reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
					sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
					est laborum.
				</p>
			</div>

			<div class="footer__address">
				<p>1234 State Name Avenue, NW<br />Washington, DC 23456<br />(202) 555-5555</p>
			</div>
		</div>

		<div class="footer__copyright">
			<p>
				Copyright © 2025 Logoipsum. All rights reserved.
				<a href="#">Privacy Policy</a>
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

	.footer__logo img {
		max-width: 180px;
		margin-bottom: 1.5rem;
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
</style>
