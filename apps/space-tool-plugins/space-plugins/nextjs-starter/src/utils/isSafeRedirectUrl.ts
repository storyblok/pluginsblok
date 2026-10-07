const LOCAL_HOSTNAMES = ['localhost', '127.0.0.1'];

export const isSafeRedirectUrl = (url: unknown): url is string => {
	if (typeof url !== 'string') {
		return false;
	}

	try {
		if (url.startsWith('/')) {
			return new URL(url, location.origin).origin === location.origin;
		}

		const { protocol, hostname } = new URL(url);

		if (protocol === 'https:') {
			return true;
		}

		return protocol === 'http:' && LOCAL_HOSTNAMES.includes(hostname);
	} catch {
		return false;
	}
};
