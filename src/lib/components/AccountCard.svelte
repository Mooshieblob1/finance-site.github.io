<!-- src/lib/components/AccountCard.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  
  export let name: string;
  export let balance: string;
  export let currencyCode: string;
  export let accountId: string;

  let isExpanded = false;
  let transactions: any[] = [];
  let isLoading = false;
  let error: string | null = null;

  async function toggleCard() {
    isExpanded = !isExpanded;
    
    if (isExpanded && transactions.length === 0) {
      isLoading = true;
      try {
        const response = await fetch(`/api/accounts/${accountId}/transactions?limit=4`);
        if (!response.ok) throw new Error('Failed to fetch transactions');
        const data = await response.json();
        transactions = data;
      } catch (e) {
        error = 'Could not load transactions';
        console.error(e);
      } finally {
        isLoading = false;
      }
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-AU', {
      month: 'short',
      day: 'numeric'
    });
  }

  // Add a function to get tag background color
  function getTagColor(tagName: string): string {
    // You can customize these colors or add more based on your needs
    const colors: Record<string, string> = {
      food: 'bg-blue-500/20 text-blue-300',
      transport: 'bg-green-500/20 text-green-300',
      shopping: 'bg-purple-500/20 text-purple-300',
      bills: 'bg-red-500/20 text-red-300',
      default: 'bg-gray-500/20 text-gray-300'
    };
    
    const tag = tagName.toLowerCase();
    return colors[tag] || colors.default;
  }
</script>
<div class="relative"> <!-- Added wrapper div -->
  <div 
    class="bg-up-card rounded-lg shadow-lg p-6 transition-all duration-200 hover:bg-up-hover border border-white/5 cursor-pointer"
    on:click={toggleCard}
  >
    <div class="flex justify-between items-start">
      <h3 class="text-lg font-medium text-up-text-primary">{name}</h3>
      <svg 
        class="w-5 h-5 text-up-text-secondary transform transition-transform duration-200"
        class:rotate-180={isExpanded}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    
    <p class="text-2xl font-bold mt-2">
      <span class="text-up-text-secondary text-sm mr-1">{currencyCode}</span>
      <span class="text-up-orange">{balance}</span>
    </p>

    {#if isExpanded}
      <div 
        transition:slide={{ duration: 300 }}
        class="mt-6 space-y-4 border-t border-white/10 pt-4"
      >
        <h4 class="text-sm font-medium text-up-text-secondary">Recent Transactions</h4>
        
        {#if isLoading}
          <div class="animate-pulse space-y-3">
            {#each Array(4) as _}
              <div class="h-12 bg-up-hover rounded"></div>
            {/each}
          </div>
        {:else if error}
          <p class="text-red-400 text-sm">{error}</p>
        {:else}
          <div class="space-y-3">
            {#each transactions as transaction}
              <div 
                class="flex justify-between items-start py-2 text-sm"
                in:slide={{ duration: 200, delay: 100 }}
              >
                <div>
                  <p class="text-up-text-primary">{transaction.attributes.description}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <p class="text-up-text-secondary text-xs">
                      {formatDate(transaction.attributes.createdAt)}
                    </p>
                    {#if transaction.relationships?.tags?.data?.length > 0}
                      <div class="flex gap-1">
                        {#each transaction.relationships.tags.data as tag}
                          <span class={`text-xs px-2 py-0.5 rounded-full ${getTagColor(tag.id)}`}>
                            {tag.id}
                          </span>
                        {/each}
                      </div>
                    {/if}
                  </div>
                </div>
                <p class="font-medium" class:text-red-400={transaction.attributes.amount.valueInBaseUnits < 0}>
                  {transaction.attributes.amount.value}
                </p>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>