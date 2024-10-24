type Account = {
  id: string;
  attributes: {
    displayName: string;
    balance: {
      currencyCode: string;
      value: string;
      valueInBaseUnits: number;
    };
  };
};

type Transaction = {
  id: string;
  attributes: {
    description: string;
    amount: {
      currencyCode: string;
      value: string;
      valueInBaseUnits: number;
    };
    createdAt: string;
    status: "HELD" | "SETTLED";
  };
};

export class UpbankClient {
  private token: string;
  private baseUrl = "https://api.up.com.au/api/v1";

  constructor(token: string) {
    this.token = token;
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getAccounts() {
    return this.fetch<{ data: Account[] }>("/accounts");
  }

  async getTransactions(accountId: string) {
    return this.fetch<{ data: Transaction[] }>(
      `/accounts/${accountId}/transactions`
    );
  }
}
