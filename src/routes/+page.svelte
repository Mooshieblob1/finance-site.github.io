<script lang="ts">
  import "../app.css";
  import { onMount } from 'svelte';
  import { UpbankClient } from '$lib/upbank';
  import AccountCard from '$lib/components/AccountCard.svelte';
  import { env } from '$env/dynamic/private';

  const upbank = new UpbankClient(env.UPBANK_TOKEN);
  let accounts: Array<any> = [];
  let error: string | null = null;

  onMount(async () => {
    try {
      const response = await upbank.getAccounts();
      accounts = response.data;
    } catch (e) {
      error = 'Failed to load accounts';
      console.error(e);
    }
  });
</script>

<div class="min-h-screen bg-gray-100">
  <main class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">
      Up Bank Dashboard
    </h1>

    {#if error}
      <div class="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
        {error}
      </div>
    {/if}

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each accounts as account}
        <AccountCard
          name={account.attributes.displayName}
          balance={account.attributes.balance.value}
          currencyCode={account.attributes.balance.currencyCode}
        />
      {/each}
    </div>
  </main>
</div>