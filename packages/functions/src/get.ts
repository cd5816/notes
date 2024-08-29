import { Resource } from "sst";
import { Util } from "@notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

async function getNote(event: APIGatewayProxyEvent) {
	const params = {
		TableName: Resource.Notes.name,
		Key: {
			userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
			noteId: event.pathParameters?.id,
		},
	};

	const result = await dynamoDb.send(new GetCommand(params));
	if (!result.Item) {
		throw new Error("Item not found.");
	}

	return JSON.stringify(result.Item);
}

export const main = Util.handler(getNote);
