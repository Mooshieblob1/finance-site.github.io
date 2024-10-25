<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let accounts: Array<any> = [];
  export let show = false;

  const dispatch = createEventDispatcher<{
    transfer: {
      fromAccountId: string;
      toAccountId: string;
      amount: number;
      description?: string;
    };
  }>();

  let fromAccount: string = '';
  let toAccount: string = '';
  let amount: number = 0;
  let description: string = '';
  let isLoading = false;
  let error: string | null = null;

  function close() {
    show = false;
    fromAccount = '';
    toAccount = '';
    amount = 0;
    description = '';
    error = null;
  }

  async function handleSubmit() {
    if (!fromAccount || !toAccount || !amount) {
      error = 'Please fill in all required fields';
      return;
    }

    if (fromAccount === toAccount) {
      error = 'Cannot transfer to the same account';
      return;
    }

    if (amount <= 0) {
      error = 'Amount must be greater than 0';
      return;
    }

    isLoading = true;
    error = null;

    try {
      // Find the source account to check balance
      const sourceAccount = accounts.find(acc => acc.id === fromAccount);
      const availableBalance = parseFloat(sourceAccount?.attributes.balance.value || '0');

      if (amount > availableBalance) {
        throw new Error('Insufficient funds');
      }

      dispatch('transfer', {
        fromAccountId: fromAccount,
        toAccountId: toAccount,
        amount: Number(amount),
        description: description.trim() || undefined
      });
      
      // Let the parent component handle closing the modal after successful transfer
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to process transfer';
      console.error('Transfer submission error:', e);
      isLoading = false;
    }
  }

  // Reset form when modal is opened
  $: if (show) {
    fromAccount = '';
    toAccount = '';
    amount = 0;
    description = '';
    error = null;
  }
</script>

{#if show}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-up-card rounded-lg p-6 max-w-md w-full mx-4">
      <h2 class="text-xl font-bold text-up-text-primary mb-4">Transfer Money [WIP until Up adds it to their API]</h2>
      
      {#if error}
        <div class="bg-red-900/50 text-red-200 p-3 rounded mb-4">
          {error}
        </div>
      {/if}

      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div>
          <label class="block text-up-text-secondary text-sm mb-1" for="fromAccount">
            From Account
          </label>
          <select
            id="fromAccount"
            bind:value={fromAccount}
            class="w-full bg-up-hover text-up-text-primary rounded p-2 border border-white/10"
            disabled={isLoading}
          >
            <option value="">Select account</option>
            {#each accounts as account}
              <option value={account.id}>
                {account.attributes.displayName} ({account.attributes.balance.value} {account.attributes.balance.currencyCode})
              </option>
            {/each}
          </select>
        </div>

        <div>
          <label class="block text-up-text-secondary text-sm mb-1" for="toAccount">
            To Account
          </label>
          <select
            id="toAccount"
            bind:value={toAccount}
            class="w-full bg-up-hover text-up-text-primary rounded p-2 border border-white/10"
            disabled={isLoading}
          >
            <option value="">Select account</option>
            {#each accounts as account}
              {#if account.id !== fromAccount}
                <option value={account.id}>
                  {account.attributes.displayName} ({account.attributes.balance.value} {account.attributes.balance.currencyCode})
                </option>
              {/if}
            {/each}
          </select>
        </div>

        <div>
          <label class="block text-up-text-secondary text-sm mb-1" for="amount">
            Amount (AUD)
          </label>
          <input
            id="amount"
            type="number"
            bind:value={amount}
            min="0.01"
            step="0.01"
            class="w-full bg-up-hover text-up-text-primary rounded p-2 border border-white/10"
            placeholder="0.00"
            disabled={isLoading}
          />
        </div>

        <div>
          <label class="block text-up-text-secondary text-sm mb-1" for="description">
            Description (optional)
          </label>
          <input
            id="description"
            type="text"
            bind:value={description}
            class="w-full bg-up-hover text-up-text-primary rounded p-2 border border-white/10"
            placeholder="Transfer description"
            disabled={isLoading}
          />
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            on:click={close}
            class="px-4 py-2 rounded text-up-text-secondary hover:text-up-text-primary transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            class="px-4 py-2 bg-up-orange text-white rounded hover:bg-up-orange/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Transfer'}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}