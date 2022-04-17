<script lang="ts">
  import { scale } from "svelte/transition";
  import { sidebar } from "./data";
  import Element from "./Element.svelte";
</script>

<div class="sidebar" data-kind="sidebar">
  {#each $sidebar as id}
    <div in:scale out:scale class="spaced" data-kind="sidebar"><Element id={id} needsMargin={false}/></div>
  {/each}
</div>

<style>
  .sidebar {
    width: calc(10vh + 12px);
    background-color: #fff;
    height: 100vh;
    margin-right: 6px;
    grid-column: 1;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
  }

  .spaced {
    margin: 6px;
  }
</style>