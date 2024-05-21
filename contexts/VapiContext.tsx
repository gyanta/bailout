"use client";
import Vapi from "@vapi-ai/web";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type VapiContextType = {
  vapi: Vapi;
  isCallActive: boolean;
};
const VapiContext = createContext<VapiContextType | null>(null);

export const VapiProvider = ({
  children,
  apiKey,
}: PropsWithChildren<{ apiKey: string }>) => {
  const [vapi] = useState<Vapi>(() => new Vapi(apiKey));
  const [isCallActive, setIsCallActive] = useState(false);

  useEffect(() => {
    const handleCallStart = () => {
      setIsCallActive(true);
      console.log("Call has started.");
    };

    const handleCallEnd = () => {
      setIsCallActive(false);
      console.log("Call has ended.");
    };

    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);

    return () => {
      vapi.stop();
      vapi.off("call-start", handleCallStart);
      vapi.off("call-end", handleCallEnd);
    };
  }, [vapi]);

  return (
    <VapiContext.Provider value={{ vapi: vapi, isCallActive }}>
      {children}
    </VapiContext.Provider>
  );
};

export const useVapi = () => {
  const vapiContext = useContext(VapiContext);
  if (!vapiContext) {
    throw new Error("useVapi must be used within a VapiProvider");
  }
  return vapiContext;
};
