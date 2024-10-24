import { UpbankClient } from "$lib/upbank.js";
import { env } from "$env/dynamic/private";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, params }) => {
  try {
    console.log("Payment request params:", params);
    const body = await request.json();
    console.log("Payment request body:", body);

    const { toAccountId, amount, description } = body;
    const accountId = params.accountId;

    // Basic validation
    if (!accountId || !toAccountId || !amount) {
      console.error("Missing required fields:", {
        accountId,
        toAccountId,
        amount,
      });
      return json({ error: "Missing required fields" }, { status: 400 });
    }

    const upbank = new UpbankClient(env.PRIVATE_UPBANK_TOKEN);
    const response = await upbank.createTransfer({
      fromAccountId: accountId,
      toAccountId,
      amount,
      description,
    });

    return json(response);
  } catch (error) {
    console.error("Transfer error:", error);
    return json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process transfer",
      },
      { status: 500 }
    );
  }
};
