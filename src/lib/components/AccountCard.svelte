<script lang="ts">
  export let name: string;
  export let balance: string;
  export let currencyCode: string;
</script>

<div class="bg-white rounded-lg shadow-md p-6">
  <h3 class="text-lg font-semibold text-gray-800">{name}</h3>
  <p class="text-2xl font-bold text-up-blue mt-2">
    {currencyCode} {balance}
  </p>
</div>