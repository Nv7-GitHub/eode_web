<script lang="ts">
  export let message = "Loading...";
</script>

<div class="d-flex align-items-center container center">
  <strong>{message}</strong>
  <div class="spinner-border ms-auto"></div>
</div>

<style>
  .center {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
  }
</style>