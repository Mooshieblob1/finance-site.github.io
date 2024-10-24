import { UpbankClient } from "$lib/upbank.js";
import { env } from "$env/dynamic/private";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  try {
    const upbank = new UpbankClient(env.PRIVATE_UPBANK_TOKEN);
    const response = await upbank.getAccounts();
    return json(response.data);
  } catch (error) {
    return json({ error: "Failed to fetch accounts" }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const transferData = await request.json();

    // Basic validation
    if (
      !transferData.fromAccountId ||
      !transferData.toAccountId ||
      !transferData.amount
    ) {
      return json({ error: "Missing required fields" }, { status: 400 });
    }

    const upbank = new UpbankClient(env.PRIVATE_UPBANK_TOKEN);
    const response = await upbank.createTransfer(transferData);
    return json(response);
  } catch (error) {
    return json({ error: "Failed to process transfer" }, { status: 500 });
  }
};
