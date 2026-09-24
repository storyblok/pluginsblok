import type { ISbStoryData } from 'storyblok-js-client';

export type StoryContext = {
	language: string;
	story: ISbStoryData;
	releaseId: number | null;
	releases: Release[];
};

export type Release = {
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

export type StoryContextWithAction = StoryContext & {
	action: 'get-context';
};
