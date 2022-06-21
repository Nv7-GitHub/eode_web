<script lang="ts">
	import Loading from "./components/Loading.svelte";
	import { connect, Method, send } from "./conn";
	import { initData } from "./data";
	import Inv from "./Inv.svelte";
	import Picked from "./Picked.svelte";
	import Sidebar from "./Sidebar.svelte";
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
			// Add to prev
			let glds = prevGuilds();
			if (!glds.includes(guild)) {
				glds.push(guild);
				localStorage.setItem("guilds", JSON.stringify(glds));
			}
			await initData(guild);
			hasGuild = true;
			document.body.style.setProperty("background-color", "#eee");
		}
	}

	function prevGuilds(): string[] {
		let res = localStorage.getItem("guilds");
		if (res) {
			return JSON.parse(res);
		} else {
			return [];
		}
	}

	let connected = false;
	connect().then(() => {connected = true;});
</script>

<main>
	{#if connected}
		{#if hasGuild}
			<div class="main">
				<Sidebar/>
				<Inv/>
				<Picked/>
			</div>
		{:else}
			<div class="container">
				<form on:submit|preventDefault={setGuild} class="input-group mt-3">
					<input type="text" class="form-control" placeholder="Guild ID..." bind:value={guild}>
					<button class="btn btn-primary" type="submit">Connect!</button>
				</form>

				<ul class="list-group mt-3">
					{#each prevGuilds() as gld}
						<li class="list-group-item list-group-item-action" on:click={() => {guild = gld; setGuild();}}>{gld}</li>
					{/each}
				</ul>
			</div>
		{/if}
	{:else}
		<Loading message="Logging in..."/>
	{/if}
</main>

<style>
	.main {
		display: grid;
	}
</style>
