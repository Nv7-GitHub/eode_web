<script lang="ts">
	import { connect, login, Method, send } from "./conn";
	import Element from "./Element.svelte";
	import { error } from "./ui";

	let guild = "";
	let hasGuild = false;

	async function setGuild() {
		let res = await send(Method.MethodGuild, {
			gld: guild,
		})
		if (res.error) {
			error(res.error);
		} else {
			hasGuild = true;
		}
	}

	let connected = false;
	let idProm = login();
	idProm.then(async (id) => {
		await connect(id);
		connected = true;
	})
</script>

<main>
	{#if connected}
		{#if hasGuild}
			Connected!
		{:else}
			<input type="text" bind:value={guild} placeholder="Guild..."/>
			<button on:click={setGuild}>Connect!</button>
		{/if}
	{:else}
		Connecting...
	{/if}
</main>
