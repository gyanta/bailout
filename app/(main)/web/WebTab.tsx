"use client";

import { useEffect, useRef, useState } from "react";
import { generateSystemPrompt } from "@/lib/groqUtils";
import { createAssistant } from "@/lib/vapiUtils";
import {
  Avatar,
  Card,
  Flex,
  Grid,
  IconButton,
  Section,
  ScrollArea,
  Text,
  TextField,
} from "@radix-ui/themes";
import { PhoneContainer } from "@/components/Phone/PhoneContainer";
import { CircleUserRound, Phone, PhoneOff, SendHorizontal } from "lucide-react";
import { useVapi } from "@/contexts/VapiContext";
import { useRinger } from "@/hooks/useRinger";

type Message = {
  sender: "ai" | "user";
  message: string;
};

export const WebTab = () => {
  const [messages, setMessages] = useState<Message[]>([
    { message: "What excuse do you need?", sender: "ai" },
    { message: "pet rock escaped", sender: "user" },
    {
      message: "roommate accidentally glued himself to the couch",
      sender: "user",
    },
    { message: "kaiju attack", sender: "user" },
    { message: "pet iguana staged a coup, runs the house now", sender: "user" },
  ]);

  const { vapi } = useVapi();
  const ringer = useRinger();

  const [currentAssistant, setCurrentAssistant] = useState<string>();

  const handleSend = async (message: string) => {
    setMessages((messages) => [
      ...messages,
      {
        sender: "user",
        message,
      },
    ]);
    const promptResult = await generateSystemPrompt(message);

    console.log({ promptResult });

    const assistant = await createAssistant(promptResult);

    setCurrentAssistant(assistant);

    ringer.start();
  };

  const handleAnswer = async () => {
    ringer.stop();
    vapi.start(currentAssistant ?? "12dc2281-744c-4afc-a1a2-95e0e3422154");
  };

  // todo: handle when assistant termainates call
  const handleHangup = () => {
    ringer.stop();
    vapi.stop();
    setCurrentAssistant(undefined);
  };

  useEffect(() => {
    vapi.on("error", (e) => {
      console.error(e);
    });
  }, [vapi]);

  return (
    <>
      <Section size="1">
        <Flex justify="center">
          <PhoneContainer>
            {!currentAssistant && (
              <SmsUi onSend={handleSend} messages={messages} />
            )}
            {currentAssistant && (
              <CallUi answer={handleAnswer} hangup={handleHangup} />
            )}
          </PhoneContainer>
        </Flex>
      </Section>

      <audio {...ringer.audioProps} />
    </>
  );
};

const CallUi = ({
  answer,
  hangup,
}: {
  answer: () => void;
  hangup: () => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { vapi, isCallActive } = useVapi();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    setIsConnecting(false);
  }, [hangup, isCallActive]);

  const canvas = canvasRef.current;
  useEffect(() => {
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const upvateVis = (volume: number) => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate the size and shade based on the volume
      const range = 10;
      const radius = 80 + volume * range;

      // Draw the circle
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
      ctx.fillStyle = `#888`;
      ctx.fill();
    };

    vapi.on("volume-level", (volume) => {
      upvateVis(volume);
    });

    return () => {
      vapi.off("volume-level", upvateVis);
    };
  }, [canvas, vapi]);

  const status = isConnecting
    ? "Connecting..."
    : isCallActive
      ? "Bailout"
      : "Bailout calling...";

  return (
    <Flex
      flexGrow="1"
      direction="column"
      justify="center"
      gap="4"
      position="relative"
    >
      <Text as="div" size="6" style={{ margin: "0 auto" }}>
        {status}
      </Text>
      <Grid style={{ justifyItems: "center", alignItems: "center" }}>
        <canvas
          ref={canvasRef}
          width={200}
          height={200}
          style={{ gridRow: 1, gridColumn: 1 }}
        />
        <Avatar
          style={{ gridRow: 1, gridColumn: 1 }}
          variant="solid"
          size="9"
          fallback={
            <CircleUserRound color="gray" strokeWidth={0.5} size={160} />
          }
        />

        <Flex gap="6">
          <IconButton
            disabled={isCallActive || isConnecting}
            style={{ margin: 10, padding: 10 }}
            size="4"
            color="green"
            onClick={() => {
              setIsConnecting(true);
              answer();
            }}
          >
            <Phone />
          </IconButton>
          <IconButton
            style={{ margin: 10, padding: 10 }}
            size="4"
            color="red"
            onClick={() => hangup()}
          >
            <PhoneOff />
          </IconButton>
        </Flex>
      </Grid>
    </Flex>
  );
};

const SmsUi = ({
  onSend,
  messages,
}: {
  onSend: (sms: string) => void;
  messages: Message[];
}) => {
  const [sms, setSms] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current?.scrollHeight;
    }
  }, [messages]);

  return (
    <Flex
      flexGrow="1"
      direction="column"
      justify="end"
      gap="4"
      position="relative"
      overflow="hidden"
    >
      <Flex justify="center" position="relative" top="200px"></Flex>

      <ScrollArea ref={scrollRef}>
        <Flex direction="column" gap="4" position="absolute" bottom="0">
          {messages.map((message, index) => (
            <Flex
              key={`${message}-${index}`}
              justify={message.sender === "ai" ? "start" : "end"}
            >
              <Card
                size="1"
                style={{
                  backgroundColor: message.sender === "ai" ? "#3B82F6" : "#444",
                  maxWidth: "90%",
                }}
              >
                <Text>{message.message}</Text>
              </Card>
            </Flex>
          ))}
        </Flex>
      </ScrollArea>

      <form onSubmit={(e) => e.preventDefault()}>
        <TextField.Root
          placeholder="Type in your message…"
          size="3"
          value={sms}
          onChange={(e) => setSms(e.target.value)}
        >
          <TextField.Slot pr="3" side="right">
            <IconButton
              type="submit"
              size="2"
              variant="ghost"
              onClick={() => {
                onSend(sms);
                setSms("");
              }}
            >
              <SendHorizontal />
            </IconButton>
          </TextField.Slot>
        </TextField.Root>
      </form>
    </Flex>
  );
};
