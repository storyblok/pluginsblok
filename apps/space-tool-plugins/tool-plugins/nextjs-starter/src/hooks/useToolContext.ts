import { useEffect, useState } from 'react';
import { APP_ORIGIN, TOOL_ID } from '@/hooks/shared';

type Story = {
	name: string;
	updated_at: string;
	content: unknown;
	published: boolean;
	slug: string;
	// partial type definition
};

type ToolContext = {
	action: 'get-context';
	language: string;
	story: Story;
	releaseId: number | null;
	releases: Release[];
};

type Release = {
	name: string;
	id: number;
	created_at: string;
	updated_at: string;
	release_at: string;
	released: boolean;
	uuid: string;
	branches_to_deploy: number[];
	timezone: string;
	description?: string;
};

export function useToolContext() {
	const [context, setContext] = useState<ToolContext | undefined>(undefined);
	const handleContext = ({ data }: MessageEvent<ToolContext>) => {
		if (data.action === 'get-context') {
			setContext(data);
		}
	};

	useEffect(() => {
		window.parent.postMessage(
			{
				action: 'tool-changed',
				tool: TOOL_ID,
				event: 'getContext',
			},
			APP_ORIGIN,
		);

		window.addEventListener('message', handleContext);

		return () => {
			window.removeEventListener('message', handleContext);
		};
	}, []);

	return context;
}
