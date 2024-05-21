import { Container, Flex, Heading, Section, Text } from "@radix-ui/themes";
import { Tabs } from "@/app/(main)/Tabs";
import { PropsWithChildren } from "react";

const title = `Bailout - Your Ultimate Escape Plan`;
const description = `The Voice AI app that comes to your rescue when you need a clever escape from any situation! This lighthearted project showcases the incredible potential of advanced language models and voice synthesis by generating custom-made, entertaining excuses to help you gracefully exit from any circumstance you'd rather not be in.`;

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <>
      <header>
        <Section size="1" style={{ backgroundColor: "var(--accent-9)" }}>
          <Container>
            <Heading as="h1" align="center" size="8" weight="bold">
              {title}
            </Heading>
          </Container>
        </Section>
      </header>
      <main>
        <Section size="1">
          <Container size="3">
            <Text align="center" as="div">
              {description}
            </Text>
          </Container>
        </Section>
        <Section size="1">
          <Container align="center">
            <Flex justify="center">
              <Tabs />
            </Flex>
          </Container>
        </Section>
        {children}
      </main>
    </>
  );
}
