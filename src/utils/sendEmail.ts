import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./sesClient";

const createSendEmailCommand = (toAddress: string, fromAddress: string): SendEmailCommand => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [
        toAddress,
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: "<h1>This is the message body in HTML format.</h1>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "This is the message body in Text format.",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Hello from AWS SES",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

export const run = async (): Promise<any> => {
  const sendEmailCommand = createSendEmailCommand(
    "gargsamaksh108@gmail.com",
    "samaksh@devtinder.site",
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      return caught;
    }
    throw caught;
  }
};
