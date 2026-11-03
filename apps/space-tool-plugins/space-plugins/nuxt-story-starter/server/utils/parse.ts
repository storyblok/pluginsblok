import type { H3Event } from 'h3';
import { type GenericSchema, safeParse } from 'valibot';

export const parseQuery = <TSchema extends GenericSchema>({
	event,
	schema,
}: {
	event: H3Event;
	schema: TSchema;
}) => {
	const result = safeParse(schema, getQuery(event));
	if (!result.success) {
		throw createError({ status: 400 });
	}
	return result.output;
};
