"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const client_ses_1 = require("@aws-sdk/client-ses");
const sesClient_1 = require("./sesClient");
const createSendEmailCommand = (toAddress, fromAddress) => {
    return new client_ses_1.SendEmailCommand({
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
const run = async () => {
    const sendEmailCommand = createSendEmailCommand("gargsamaksh108@gmail.com", "samaksh@devtinder.site");
    try {
        return await sesClient_1.sesClient.send(sendEmailCommand);
    }
    catch (caught) {
        if (caught instanceof Error && caught.name === "MessageRejected") {
            return caught;
        }
        throw caught;
    }
};
exports.run = run;
