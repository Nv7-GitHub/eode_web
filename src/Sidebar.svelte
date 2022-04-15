<script lang="ts">
import Element from "./Element.svelte";


</script>

<div class="sidebar">
  <Element id={1}/>
</div>

<style>
  .sidebar {
    width: calc(10vh + 12px);
    background-color: #fff;
    height: 100vh;
    margin-right: 6px;
    /*display: flex;
    flex-direction: column;
    overflow-y: scroll;*/
  }
</style>