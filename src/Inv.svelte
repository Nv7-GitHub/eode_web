<script lang="ts">
  import Loading from "./components/Loading.svelte";
  import { Method, send } from "./conn";
  import { load } from "./data";
  import Element from "./Element.svelte";
  import { error } from "./ui";

  // https://stackoverflow.com/questions/44109314/javascript-calculate-with-viewport-width-height
  function vh(v) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (v * h) / 100;
  }

  let size = vh(10);
  let height = vh(100);

  let inv: number[] = null;
  let start: number;
  let end: number;
  send(Method.MethodInv, {}).then(async (res) => {
    if (res.error) {
      error(res.error);
    } else {
      let elems: number[] = res.data["elems"];
      elems = elems.sort((a, b) => {
        return a - b;
      });
      await load(elems);
      inv = elems;
    }
  });
</script>

{#if inv}
  <div class="inv">
    {#each inv as id}
      <Element id={id}></Element>
    {/each}
  </div>
{:else}
  <Loading/>
{/if}

<style>
  .inv {
    display: flex;
    flex-wrap: wrap;
  }
</style>