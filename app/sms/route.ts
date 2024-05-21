import { type NextRequest } from "next/server";
import { twiml, validateRequest } from "twilio";
import { createAssistant, createPhoneCall } from "@/lib/vapiUtils";
import { generateSystemPrompt } from "@/lib/groqUtils";

const VALIDATE_REQUEST = true;

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const twilioSignature = request.headers.get("X-Twilio-Signature") ?? "";

  if (VALIDATE_REQUEST) {
    const authToken = process.env["TWILIO_AUTH_TOKEN"];
    const url = process.env["SMS_WEBHOOK_URL"];

    if (!authToken || !url) {
      return new Response("Missing Twilio configuration", {
        status: 500,
        statusText: "Internal Server Error",
      });
    }

    const params = Object.fromEntries(form.entries());
    const isValid = validateRequest(authToken, twilioSignature, url, params);

    console.log("twilio validation result", { isValid });

    if (!isValid) {
      return new Response("Unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }
  }

  const message = form.get("Body");
  if (typeof message !== "string") {
    return new Response("Missing Body", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  const phoneNumber = form.get("From");
  if (typeof phoneNumber !== "string") {
    return new Response("Missing From", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  const assistantPrompt = await generateSystemPrompt(message);

  const assistantId = await createAssistant(assistantPrompt);

  console.log(`Calling ${phoneNumber} with assistant ${assistantId}`);
  const call = await createPhoneCall(assistantId, phoneNumber);
  console.log(`Call ID ${call.id}`);

  // https://www.twilio.com/docs/messaging/tutorials/how-to-receive-and-reply/node-js#receive-incoming-messages-without-sending-a-reply
  const noopResponse = new twiml.MessagingResponse().toString();

  return new Response(noopResponse, {
    status: 200,
    statusText: "ok",
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
