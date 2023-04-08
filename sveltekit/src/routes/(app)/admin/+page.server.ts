import type { PageServerLoad, Actions } from "./$types";
import { error, fail, redirect } from "@sveltejs/kit";
import { identity } from "$lib/server/auth";
import { auth } from '$lib/server/auth';
import { DeleteCookiesByPrefix } from "$lib/utils";
import { rolenames } from '$lib/gatekeeper.json'; 


export const load = (async () => {

    return await identity.listSessions({
        pageSize: 100,
		expand: ["Identity"],
    }).then(({ data }) => {
		console.log(data);
        return {
            title: 'Admin',
            activeSessions: data,
			rolenames: rolenames,
        }
    }, ({ response: { data, status } }) => {
        console.log('Kratos list identities error');
		console.log(status);
        console.log(data);
        return {
            title: 'Admin',
            activeSessions: undefined,
			rolenames: rolenames,
        };
    })
}) satisfies PageServerLoad;

export const actions = {
	logout: async ({ url, request, locals, cookies }) => {
		const values = await request.formData();
		const logoutToken = values.get('logout_token') ?? undefined;
		const cookieHeader = request.headers.get('cookie') ?? undefined;
		return await auth
			.updateLogoutFlow(
				{
					token: typeof logoutToken === 'string' ? logoutToken : undefined,
					returnTo: url.searchParams.get('returnTo') ?? undefined
				},
				{
					headers: {
						cookie: cookieHeader ? decodeURIComponent(cookieHeader) : undefined
					}
				}
			)
			.then(
				({ headers }) => {
					cookies.delete('ory_kratos_session');
					DeleteCookiesByPrefix(cookieHeader, { cookies, prefix: 'csrf_token' });
					locals.userSession = undefined;
					if (headers['location']) {
						throw redirect(302, headers['location']);
					} else {
						throw redirect(302, '/');
					}
				},
				({ response: { data } }) => {
					const err = new Error('Error with updateLogoutFlow');
					console.log(err);
					console.log(data);
					throw error(500, 'Error logging out');
				}
			);
	},
	changeRole: async ({ request }) => {
		const values = await request.formData();
		const id = values.get('id') ?? undefined;
		const role = values.get('role') ?? undefined;
		console.log(id);
		console.log(role);
		if (typeof id !== 'string' || typeof role !== 'string') {
			return fail(400, { changeRole: 'Error: id or role missing'});
		}
		return await identity.patchIdentity({
			id: id,
			jsonPatch: [
				{
					op: 'replace',
					path: '/metadata_public',
					value: {"role": role},
				}
			],
		}).then(({ data }) => {
			console.log('Role changed');
			console.log(data.metadata_public.role);
			return { changeRole: 'success' }
		}, ({ response: { data, status } }) => {
			console.log('Kratos list identities error');
			console.log(status);
			console.log(data);
			return fail(400, { changeRole: 'Error: id or role missing'});
		});
	},
} satisfies Actions;
