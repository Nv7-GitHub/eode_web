<script lang="ts">
import { tick } from "svelte";
import { writable } from "svelte/store";

  import { scale, slide } from "svelte/transition";
  import { Method, send } from "./conn";
  import { inv, sidebar } from "./data";
  import Element from "./Element.svelte";

  let res = writable(0);
  sidebar.subscribe(async (_) => {
    if ($sidebar.length < 2) {
      if ($res != 0) {
        res.set(0);
      }
      return;
    }
    let val = await send(Method.MethodCombo, {"elems": $sidebar.map((v) => v.elem)});
    if (!val.error) {
      let id = val.data["id"];
      res.set(0);
      await tick();
      res.set(id);

      if (!$inv.includes(id)) {
        $inv.push(id);
        inv.set($inv.sort((a, b) => {
          return a - b;
        }));
        await tick();
      }
    } else {
      res.set(0);
    }
  })
</script>

<div class="sidebar">
  <div class="sidebar_elems" data-kind="sidebar">
    {#each $sidebar as val, ind (val.id)}
      <div in:scale out:slide class="spaced" data-kind="sidebar"><Element id={val.elem} needsMargin={false} sidebarId={ind}/></div>
    {/each}
  </div>

  {#if $res != 0}
    <div class="result" in:scale out:scale>
      <Element canPick={false} id={$res} idWritable={res}/>
    </div>
  {/if}
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

  .sidebar_elems {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100% - 10vh - 12px);
  }

  .spaced {
    margin: 6px;
  }
</style>