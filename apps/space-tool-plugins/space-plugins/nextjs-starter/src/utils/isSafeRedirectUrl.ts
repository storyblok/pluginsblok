const LOCAL_HOSTNAMES = ['localhost', '127.0.0.1'];

export const isSafeRedirectUrl = (url: unknown): url is string => {
	if (typeof url !== 'string') {
		return false;
	}

	try {
		const { protocol, hostname } = new URL(url, location.origin);

		if (protocol === 'https:') {
			return true;
		}

		return protocol === 'http:' && LOCAL_HOSTNAMES.includes(hostname);
	} catch {
		return false;
	}
};
