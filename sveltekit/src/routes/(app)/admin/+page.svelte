<script lang="ts">
	import ChangeRoleButton from '$lib/components/change-role-button.svelte';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
</script>

<div class="overflow-x-auto">
	<table class="table table-compact w-full">
		<thead>
			<tr>
				<th />
				<th>Manage</th>
				<th>Username</th>
				<th>Email</th>
				<th>Verified</th>
				<th>Role</th>
				<th>Admin</th>
				<th>Authenticated_At</th>
			</tr>
		</thead>
		<tbody>
			{#if data.activeSessions}
				{#each data.activeSessions as session}
                    {#if session.active}
                        <tr>
                            <th />
                            <th><ChangeRoleButton admin={session.identity.metadata_public?.admin ?? false} currentRole={session.identity.metadata_public?.role}/></th>
                            <th>{session.identity.traits.username}</th>
                            <th>{session.identity.traits.email}</th>
                            <th>{session.identity.verifiable_addresses?.[0].verified}</th>
                            <th>{session.identity.metadata_public?.role}</th>
                            <th>{session.identity.metadata_public?.admin}</th>
                            <th>{session.authenticated_at}</th>
                        </tr>
                    {/if}
				{/each}
			{/if}
		</tbody>
		<tfoot>
			<tr>
				<th />
				<th>Manage</th>
				<th>Username</th>
				<th>Email</th>
				<th>Verified</th>
				<th>Role</th>
				<th>Admin</th>
				<th>Authenticated_At</th>
			</tr>
		</tfoot>
	</table>
</div>
