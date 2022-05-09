<script lang="ts">
  import { scale } from "svelte/transition";
  import { picked, sidebar, sidebarCnt } from "./data";
  import Element from "./Element.svelte";

  let mousex = 0;
  let mousey = 0;

  function handleMouseMove(ev: MouseEvent) {
    mousex = ev.clientX;
    mousey = ev.clientY;
  }
  
  function drop(ev: MouseEvent) {
    if ($picked == 0) {
      return;
    }
    let targ = (ev.target as HTMLElement);
    if (targ.hasAttribute("data-id")) {
      return;
    }

    let kind = targ.getAttribute("data-kind");
    if (kind == "sidebar") {
      sidebar.set($sidebar.concat({elem: $picked, id: $sidebarCnt}));
      sidebarCnt.set($sidebarCnt + 1);
    }
    picked.set(0);
  }
</script>

<svelte:body on:mousemove={handleMouseMove} on:click={drop} />

{#if $picked != 0}
  <div style="position: absolute; top: {mousey + 5}px; left: {mousex + 5}px;" in:scale out:scale>
    <Element id={$picked} idWritable={picked} needsMargin={false}/>
  </div>
{/if}