import { UpbankClient } from "$lib/upbank.js";
import { env } from "$env/dynamic/private";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, url }) => {
  try {
    const limit = url.searchParams.get("limit") || "4";
    const upbank = new UpbankClient(env.PRIVATE_UPBANK_TOKEN);
    const response = await upbank.getTransactions(params.accountId);

    // Take only the requested number of transactions
    const transactions = response.data.slice(0, parseInt(limit));

    return json(transactions);
  } catch (error) {
    return json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
};
