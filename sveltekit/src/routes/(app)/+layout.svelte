<script lang="ts">
	import type { LayoutData } from './$types';
	import '$lib/app.css';
	import ProfileButton from '$lib/components/account-button.svelte';
	import CreateAccountButton from '$lib/components/create-account-button.svelte';
	import LoginButton from '$lib/components/login-button.svelte';
	import { page } from '$app/stores';

	export let data: LayoutData;
</script>

<svelte:head>
	<title>{$page.data.title}</title>
</svelte:head>

<div class="bg-base-300 w-screen h-screen">
	<nav class="navbar bg-base-200 px-4 min-h-6 justify-between">
		<div class="flex justify-start gap-4">
			<a href="/"><h1 class="font-logo text-[1.75rem] text-sky-500">demarcait</h1></a>
			<h1 class="text-2xl">{$page.data.title}</h1>
		</div>
		<div class="flex justify-end gap-4">
			{#if data.userSession?.admin}
			<a href="/admin/users"><button class="btn btn-sm">Users</button></a>
            <a href="/admin/roles"><button class="btn btn-sm">Roles</button></a>
			{/if}
			{#if !data.user}
				{#if $page.form}
					{#if $page.form.loginUi}
						<LoginButton ui={$page.form.loginUi} open={true} />
					{/if}
					{#if $page.form.signupUi}
						<CreateAccountButton ui={$page.form.signupUi} open={true} />
					{/if}
				{/if}
				{#if data.loginUi}
					<LoginButton ui={data.loginUi} open={data.openLoginModal} />
				{/if}
				{#if data.signupUi}
					<CreateAccountButton ui={data.signupUi} open={data.openSignupModal} />
				{/if}
			{/if}
			{#if $page.form}
				{#if $page.form.verifyEmailUi}
					<ProfileButton
						theme={data.theme}
						userSession={data.userSession}
						logoutToken={data.logoutToken}
						verifyEmailUi={$page.form.verifyEmailUi}
						openVerifyEmailModal={true}
					/>
				{:else}
					<ProfileButton
						theme={data.theme}
						userSession={data.userSession}
						logoutToken={data.logoutToken}
						verifyEmailUi={data.verifyEmailUi}
						openVerifyEmailModal={data.openVerifyEmailModal}
					/>
				{/if}
			{:else}
				<ProfileButton
					theme={data.theme}
					userSession={data.userSession}
					logoutToken={data.logoutToken}
					verifyEmailUi={data.verifyEmailUi}
					openVerifyEmailModal={data.openVerifyEmailModal}
				/>
			{/if}
		</div>
	</nav>
			<main class="w-full h-full">
				<slot />
			</main>
</div>
