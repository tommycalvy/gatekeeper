<script lang="ts">
	import CreateRoleButton from "$lib/components/create-role-button.svelte";
import type { PageServerData } from "./$types";

    export let data: PageServerData;
    function roleDescription(rolename: string) {
        console.log(rolename);
        return data.roles[rolename];
    }
</script>
<br>
<div class="flex justify-center my-15">
    <CreateRoleButton />
</div>
<br>
<div class="overflow-x-auto">
    <table class="table w-full">
      <!-- head -->
      <thead>
        <tr>
          <th>Role</th>
          <th>Things to Redact</th>
        </tr>
      </thead>
      <tbody>
        {#each data.rolenames as rolename}
          <tr>
            <th>{rolename}</th>
            <td>{roleDescription(rolename)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>