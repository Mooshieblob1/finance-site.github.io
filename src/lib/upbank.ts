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

type TransferRequest = {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
};

export class UpbankClient {
  private token: string;
  private baseUrl = "https://api.up.com.au/api/v1";

  constructor(token: string) {
    this.token = token;
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/json",
        ...options.headers,
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

  async createTransfer({
    fromAccountId,
    toAccountId,
    amount,
    description,
  }: TransferRequest) {
    const transferBody = {
      data: {
        type: "transfers",
        attributes: {
          amount: {
            currencyCode: "AUD",
            value: amount.toFixed(2),
            valueInBaseUnits: Math.round(amount * 100),
          },
          description: description || "Transfer between accounts",
          accountId: toAccountId,
        },
      },
    };

    console.log(
      "Transfer request body:",
      JSON.stringify(transferBody, null, 2)
    );

    return this.fetch<any>(`/accounts/${fromAccountId}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transferBody),
    });
  }
}
