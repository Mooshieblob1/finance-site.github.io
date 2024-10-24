<script lang="ts">
  import { onMount } from 'svelte';
  import "../app.css";
  import AccountCard from '$lib/components/AccountCard.svelte';
  import UpLogo from '$lib/components/UpLogo.svelte';

  let accounts: Array<any> = [];
  let error: string | null = null;

  onMount(async () => {
    try {
      const response = await fetch('/api/accounts');
      if (!response.ok) throw new Error('Failed to fetch accounts');
      accounts = await response.json();
    } catch (e) {
      error = 'Failed to load accounts';
      console.error(e);
    }
  });
</script>

<div class="min-h-screen bg-up-dark text-up-text-primary">
  <main class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <a 
        href="https://up.com.au" 
        target="_blank" 
        rel="noopener noreferrer"
        class="inline-block hover:opacity-80 transition-opacity duration-200"
      >
        <UpLogo size="w-12 h-12" />
      </a>
      <h1 class="sr-only">Up Bank Dashboard</h1>
    </div>

    {#if error}
      <div class="bg-red-900/50 text-red-200 p-4 rounded-lg mb-4 border border-red-700">
        {error}
      </div>
    {/if}

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each accounts as account}
        <AccountCard
          name={account.attributes.displayName}
          balance={account.attributes.balance.value}
          currencyCode={account.attributes.balance.currencyCode}
          accountId={account.id}
        />
      {/each}
    </div>
  </main>
</div>