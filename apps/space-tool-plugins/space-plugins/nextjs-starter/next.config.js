/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// Hosts allowed to reach the dev server (HMR and dev resources) through a
	// tunnel. Add your own domain here if you use a different tunnel.
	allowedDevOrigins: [
		'*.ngrok.app',
		'*.ngrok-free.app',
		'*.ngrok.dev',
		'*.ngrok-free.dev',
	],
};

module.exports = nextConfig;
