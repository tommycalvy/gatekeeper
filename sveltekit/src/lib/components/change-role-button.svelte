<script lang="ts">
    export let currentRole: string = 'undefined';
    export let allRoles: string[] = [];
    export let id: string;
</script>


<label for="modal-login" class="btn btn-primary btn-xs">Change Role</label>
<input type="checkbox" id="modal-login" class="modal-toggle" />
<label for="modal-login" class="modal duration-0 bg-black bg-opacity-80">
	<label class="modal-box relative duration-0" for="">
		<div class=" modal-action absolute top-0 right-0 m-1">
			<label for="modal-login" class="btn btn-circle btn-sm btn-ghost">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/></svg
				>
			</label>
		</div>
		<div class="flex justify-center items-end gap-2 py-4">
			<h1 class=" text-2xl font-bold">Change Role</h1>
		</div>
		<form
			action="?/changeRole"
			method="POST"
			enctype="application/x-www-form-urlencoded"
			class="flex flex-col"
		>
			<select class="select select-bordered w-full max-w-xs" name="role">
                <input type="hidden" name="id" value="{id}" />
				<option selected>{currentRole}</option>
                {#each allRoles as role}
                    {#if role !== currentRole}
                        <option>{role}</option>
                    {/if}
                {/each}
			</select>
			<button class="btn btn-block btn-primary mt-6 mb-2">Save</button>
		</form>
	</label>
</label>
