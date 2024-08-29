import { Resource } from "sst";
import { handler } from "@notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

async function deleteNote(event: APIGatewayProxyEvent) {
	const params = {
		TableName: Resource.Notes.name,
		Key: {
			userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId, // The id of the author
			noteId: event?.pathParameters?.id, // The id of the note from the path
		},
	};

	await dynamoDb.send(new DeleteCommand(params));

	return JSON.stringify({ status: true });
}

export const main = handler(deleteNote);
