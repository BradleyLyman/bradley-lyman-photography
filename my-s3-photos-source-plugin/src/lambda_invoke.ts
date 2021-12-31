import * as lambda from "@aws-sdk/client-lambda";

const decoder = new TextDecoder("utf-8");
const client = new lambda.LambdaClient({ region: "us-west-2" });

export async function invoke<ResponseType>(
  function_name: string,
  payload: any
): Promise<ResponseType> {
  let serialized = Buffer.from(JSON.stringify(payload), "utf-8");
  let command = new lambda.InvokeCommand({
    FunctionName: function_name,
    Payload: serialized,
    InvocationType: "RequestResponse",
  });
  let response = await client.send(command);
  let response_payload_json = decoder.decode(response.Payload);
  console.log(`got response: ${response_payload_json}`);
  let response_payload: ResponseType = JSON.parse(response_payload_json);

  return response_payload;
}
