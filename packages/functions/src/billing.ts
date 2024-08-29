import Stripe from "stripe";
import { Resource } from "sst";
import { Util } from "@notes/core/util";
import { Billing } from "@notes/core/billing";
import { APIGatewayProxyEvent } from "aws-lambda";

async function processStripeCharge(event: APIGatewayProxyEvent) {
	const { storage, source } = JSON.parse(event.body || "{}");
	const amount = Billing.compute(storage);
	const description = "Scratch charge";

	const stripe = new Stripe(
		// Load our secret key
		Resource.StripeSecretKey.value,
		{ apiVersion: "2024-06-20" },
	);

	await stripe.charges.create({
		source,
		amount,
		description,
		currency: "usd",
	});

	return JSON.stringify({ status: true });
}

export const main = Util.handler(processStripeCharge);
