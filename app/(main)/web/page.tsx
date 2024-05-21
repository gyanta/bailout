import { WebTab } from "./WebTab";
import { VapiProvider } from "@/contexts/VapiContext";

const env = process.env;

export default function WebPage() {
  const vapiPublicKey = env["VAPI_PUBLIC_KEY"];

  if (!vapiPublicKey) {
    return <div>Vapi not configured</div>;
  }

  return (
    <VapiProvider apiKey={vapiPublicKey}>
      <WebTab />
    </VapiProvider>
  );
}
