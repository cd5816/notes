import * as uuid from "uuid";
import { Resource } from "sst";
import { handler } from "@notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

interface NoteData {
	content: string;
	attachment: string;
}

async function createNote(event: APIGatewayProxyEvent) {
	const data: NoteData = event.body
		? JSON.parse(event.body)
		: { content: "", attachment: "" };

	const params = {
		TableName: Resource.Notes.name,
		Item: {
			userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
			noteId: uuid.v1(),
			content: data.content,
			attachment: data.attachment,
			createdAt: Date.now(),
		},
	};

	await dynamoDb.send(new PutCommand(params));

	return JSON.stringify(params.Item);
}

export const main = handler(createNote);
