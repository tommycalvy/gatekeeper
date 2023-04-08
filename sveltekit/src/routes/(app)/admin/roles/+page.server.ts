import { rolenames, roles, bestow, segment, warn } from '$lib/gatekeeper.json';
import type { PageServerLoad, Actions } from './$types';
import { writeFile } from 'fs';
import { fail } from '@sveltejs/kit';

export const load = (async () => {
	return {
		roles: roles,
		rolenames: rolenames
	};
}) satisfies PageServerLoad;

export const actions = {
	createRole: async ({ cookies, request }) => {
		const data = await request.formData();
		const rolename = data.get('rolename');
		const roledescription = data.get('roledescription');

		if (typeof rolename !== 'string' || typeof roledescription !== 'string') {
			return fail(400, { error: 'Error: rolename or roledescription missing' });
		}
		if (rolenames.includes(rolename)) {
			return fail(400, { error: 'Error: rolename already exists' });
		} else {
			rolenames.push(rolename);
		}

		/* Update the gatekeeper.json file using writefile to include the new rolename and the new roledescription in the roles object*/
		writeFile(
			'./src/lib/gatekeeper.json',
			JSON.stringify({
				bestow: bestow,
				segment: segment,
				warn: warn,
				rolenames: rolenames,
				roles: { ...roles, [rolename]: roledescription }
			}),
			(err) => {
				if (err) {
					console.log(err);
				}
			}
		);

		return { success: true };
	}
} satisfies Actions;
