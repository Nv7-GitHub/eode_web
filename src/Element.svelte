<script lang="ts">
  import { Elem, elements, load } from "./data";
  
  export let id: number;

  // Get element
  let loaded = false;
  let elem: Elem;
  if ($elements.has(id)) {
    elem = $elements.get(id);
    loaded = true;
  } else {
    load([id]).then(() => {
      elem = $elements.get(id);
      loaded = true;
    });
  }
  elements.subscribe((v) => {
    if (loaded) {
      elem = v.get(id);
    }
  })

  function color(): string {
    return elem.Color.toString(16).padStart(6, "0");
  }

  function textColor(): string {
    let col = color();

    // https://stackoverflow.com/a/57720742/11388343
    const hexR = parseInt(col.substr(0, 2), 16);
    const hexG = parseInt(col.substr(2, 2), 16);
    const hexB = parseInt(col.substr(4, 2), 16);
    const contrastRatio = (hexR + hexG + hexB) / (255 * 3);
    return contrastRatio >= 0.5 ? 'black' : 'white';
  }
</script>

{#if loaded}
  <div class="element" style={`background-color: #${color()}; color: ${textColor()}`}>
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
    margin: 6px;
  }
</style>