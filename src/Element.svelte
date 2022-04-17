<script lang="ts">
import { onMount } from "svelte";

  import { Elem, elements, load, picked } from "./data";
  
  export let id: number;
  export let isPicked = false;
  export let needsMargin = true;

  // Get element
  let loaded = false;
  let elem: Elem;

  onMount(() => {
    if (isPicked) {
      id = $picked;
      picked.subscribe((v) => {
        if (v != 0) {
          id = v;
        }
        loaded = false;
        loadEl();
      });
    }
    loadEl();
  })

  function loadEl() {
    if ($elements.has(id)) {
      elem = $elements.get(id);
      loaded = true;
    } else {
      load([id]).then(() => {
        elem = $elements.get(id);
        loaded = true;
      });
    } 
  }

  elements.subscribe((v) => {
    if (loaded) {
      elem = v.get(id);
    }
  })

  let col: string;
  let textCol: string;
  $: if (loaded) {
    col = elem.Color.toString(16).padStart(6, "0");
    textCol = textColor();
  }

  function textColor(): string {
    // https://stackoverflow.com/a/57720742/11388343
    const hexR = parseInt(col.substr(0, 2), 16);
    const hexG = parseInt(col.substr(2, 2), 16);
    const hexB = parseInt(col.substr(4, 2), 16);
    const contrastRatio = (hexR + hexG + hexB) / (255 * 3);
    return contrastRatio >= 0.5 ? 'black' : 'white';
  }

  function pick() {
    picked.set(id);
  }
</script>

{#if loaded}
  <div class="element" class:spaced={needsMargin} class:smalltext={elem.Name.length > 9} style={`background-color: #${col}; color: ${textCol}`} on:click={pick} data-id={id}>
    {elem.Name}
  </div>
{:else}
  <div class="element">
    Loading...
  </div>
{/if}

<style>
  .element {
    height: 10vh;
    width: 10vh;
    border-radius: 25%;
    background-color: #fff;
    text-align: center;
    word-wrap: break-word;
    padding: 1px 6px 1px 6px;
    overflow: hidden;
  }

  .spaced {
    margin: 6px;
  }

  .smalltext {
    font-size: 0.8em;
    padding: 3px 6px 3px 6px;
  }
</style>