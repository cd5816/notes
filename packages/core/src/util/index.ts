import type { Context, APIGatewayProxyEvent } from "aws-lambda";

type LambdaFunction = (
	evt: APIGatewayProxyEvent,
	context: Context,
) => Promise<string>;

export const handler = (lambda: LambdaFunction) => {
	return async (event: APIGatewayProxyEvent, context: Context) => {
		let body: string;
		let statusCode: number;

		try {
			// Run the Lambda
			body = await lambda(event, context);
			statusCode = 200;
		} catch (error) {
			statusCode = 500;
			body = JSON.stringify({
				error: error instanceof Error ? error.message : String(error),
			});
		}

		// Return HTTP response
		return {
			body,
			statusCode,
		};
	};
};
