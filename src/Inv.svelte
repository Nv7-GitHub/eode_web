<script lang="ts">
  import Loading from "./components/Loading.svelte";
  import { Method, send } from "./conn";
  import { elements, inv, load, calcnum } from "./data";
  import Element from "./Element.svelte";
  import { error } from "./ui";
  import VirtualList from '@sveltejs/svelte-virtual-list';

  let num = calcnum();

  send(Method.MethodInv, {}).then(async (res) => {
    if (res.error) {
      error(res.error);
    } else {
      let elems: number[] = res.data["elems"];
      elems = elems.sort((a, b) => {
        return a - b;
      });

      $inv = elems;
    }
  });

  function updateSize() {
    num = calcnum();
  }

  type row = {
    value: number[];
    index: number;
  }

  let items: row[] = [];
  let loadedrows: boolean[] = []
  $: {
    items = [];
    for (let i = 0; i < $inv.length; i++) {
      let start = i;
      let row = [];
      while (i - start < num && i < $inv.length) {
        row.push($inv[i]);
        i++;
      }
      items.push({value: row, index: items.length});
    }
    loadedrows = new Array(items.length).fill(false);
    refreshLoaded();
    loadRows();
  }

  async function loadRows() {
    let toLoad = [];
    for (let i = start; i < end; i++) {
      if (!loadedrows[i]) {
        toLoad = toLoad.concat(items[i].value);
      }
    }
    await load(toLoad);
  }

  function refreshLoaded() {
    for (let i = 0; i < items.length; i++) {
      loadedrows[i] = true;
      for (let id of items[i].value) {
        if (!$elements.has(id)) {
          loadedrows[i] = false;
          break;
        }
      }
    }
    loadedrows = loadedrows;
  }

  let start: number;
  let end: number;
  let prevstart = 0;
  let prevend = 0;
  $: {
    if (start != prevstart || end != prevend) {
      refreshLoaded();
      loadRows();
    }
  }
</script>

<svelte:window on:resize={updateSize}/>

{#if inv}
  <!--<div class="inv">
    {#each $inv as id}
      <Element id={id}></Element>
    {/each}
  </div>-->

  <div style="grid-column: 2; overflow-y: scoll; height: 100vh;">
    <VirtualList items={items} let:item bind:start bind:end>
        {#if loadedrows[item.index]}
          <div class="row">
            {#each item.value as id}
              <Element id={id}></Element>
            {/each}
          </div>
        {:else}
          <div class="loading"/>
        {/if}
    </VirtualList>
  </div>
{:else}
  <Loading/>
{/if}

<style>
  .loading {
    height: 10vh;
  }

  .row {
    display: flex;
    flex-flow: row;
    padding-left: 6px;
  }
</style>