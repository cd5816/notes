export const bucket = new sst.aws.Bucket("Uploads");

export const table = new sst.aws.Dynamo("Notes", {
	fields: {
		userId: "string",
		noteId: "string",
	},
	primaryIndex: { hashKey: "userId", rangeKey: "noteId" },
});

export const secret = new sst.Secret("StripeSecretKey");
