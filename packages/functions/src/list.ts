import { Resource } from "sst";
import { Util } from "@notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

async function getListOfNotes(event: APIGatewayProxyEvent) {
	const params = {
		TableName: Resource.Notes.name,
		// 'KeyConditionExpression' defines the condition for the query
		// - 'userId = :userId': only return items with matching 'userId'
		//   partition key
		KeyConditionExpression: "userId = :userId",
		// 'ExpressionAttributeValues' defines the value in the condition
		// - ':userId': defines 'userId' to be the id of the author
		ExpressionAttributeValues: {
			":userId":
				event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
		},
	};

	const result = await dynamoDb.send(new QueryCommand(params));

	// Return the matching list of items in response body
	return JSON.stringify(result.Items);
}

export const main = Util.handler(getListOfNotes);
