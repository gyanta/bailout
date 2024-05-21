"use server";
import axios from "axios";
import {
  assistantControllerCreate,
  callControllerCreatePhoneCall,
  CreateAssistantDTO,
  CreateOutboundCallDTO,
} from "@/vapi-api";

import { DeepgramVoiceVoiceId, ElevenLabsVoiceVoiceId } from "@/vapi-api";

const DEEPGRAM_VOICES: DeepgramVoiceVoiceId[] = [
  "asteria",
  "luna",
  "stella",
  "athena",
  "hera",
  "orion",
  "arcas",
  "perseus",
  "angus",
  "orpheus",
  "helios",
  "zeus",
];

export const createAssistant = async (prompt: string) => {
  console.log("create assistant with", prompt);
  try {
    const name = `assistant-${new Date().toISOString()}`;

    // TODO delete these assistant after some time
    const response = await assistantControllerCreate(
      getCreateAssistantDTO(
        name,
        getRandomVoice(DEEPGRAM_VOICES), // #YOLO
        getSystemMessage(prompt),
      ),
      getVapiOptions(),
    );
    return response.data.id;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.error(e.response);
      console.error(e.message);
    }
    throw e;
  }
};

export const createPhoneCall = async (
  assistantId: string,
  phoneNumber: string,
) => {
  const createOutboundCallDto: CreateOutboundCallDTO = {
    assistantId,
    maxDurationSeconds: 300,
    phoneNumberId: process.env["PHONE_NUMBER_ID"],
    customer: {
      number: phoneNumber,
    },
  };

  const response = await callControllerCreatePhoneCall(
    createOutboundCallDto,
    getVapiOptions(),
  );

  return response.data;
};

const getCreateAssistantDTO = (
  name: string,
  voiceId: string,
  systemMessage: string,
): CreateAssistantDTO => ({
  name,

  transcriber: { model: "nova-2", language: "en", provider: "deepgram" },

  model: {
    model: "llama3-70b-8192",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
    ],
    provider: "groq",
    maxTokens: 250,
    temperature: 0.9,
    emotionRecognitionEnabled: true,
  },

  voice: {
    voiceId,
    provider: "deepgram",
    fillerInjectionEnabled: true,
  },

  firstMessageMode: "assistant-speaks-first",
  firstMessage: "Hello",

  endCallFunctionEnabled: true,

  backchannelingEnabled: true,
});

const getRandomVoice = (voices: string[]): ElevenLabsVoiceVoiceId => {
  const randomIndex = Math.floor(Math.random() * voices.length);
  return voices[randomIndex];
};

const getSystemMessage = (basePrompt: string) => `${basePrompt}
NEVER reveal that you're an AI. If you're asked something you don't know about, give vague answers or try to change subject.
DO NOT use abbreviations or all caps.
`;

const getVapiOptions = () => ({
  headers: {
    Authorization: "Bearer " + process.env["VAPI_PRIVATE_KEY"],
  },
});
