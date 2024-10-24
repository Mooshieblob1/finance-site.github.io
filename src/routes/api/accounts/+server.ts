import { UpbankClient } from "$lib/upbank.js"; // Note the .js extension
import { env } from "$env/dynamic/private"; // Changed to use env object
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  try {
    const upbank = new UpbankClient(env.PRIVATE_UPBANK_TOKEN);
    const response = await upbank.getAccounts();
    return json(response.data);
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch accounts" }), {
      status: 500,
    });
  }
};
