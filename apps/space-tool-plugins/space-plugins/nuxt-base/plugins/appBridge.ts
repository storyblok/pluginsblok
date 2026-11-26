export default defineNuxtPlugin(() => {
	const appConfig = useAppConfig();
	if (appConfig.appBridge.enabled) {
		globalThis.$fetch = $fetch.create({
			onRequest({ request, options }) {
				if (typeof request === 'string' && !request.startsWith('/')) {
					// skip external request
					return;
				}
				const token = sessionStorage.getItem(KEY_TOKEN) || '';
				options.headers.set(APP_BRIDGE_TOKEN_HEADER_KEY, token);
			},
		});
	}
});
