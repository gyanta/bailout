"use client";
import { Box, Flex } from "@radix-ui/themes";
import { PropsWithChildren } from "react";

export const PhoneContainer = ({ children }: PropsWithChildren) => {
  return (
    <PhoneFrame>
      <Notch />
      {children}
    </PhoneFrame>
  );
};

const PhoneFrame = ({ children }: PropsWithChildren) => {
  return (
    <Box
      width="300px"
      p="10px"
      style={{
        backgroundColor: "#111",
        aspectRatio: "9/19.5",
        boxShadow: "0 0 0 1px #333333",
        borderRadius: "40px",
      }}
    >
      <Flex
        p="10px"
        height="100%"
        direction="column"
        style={{ backgroundColor: "#202020", borderRadius: "30px" }}
      >
        {children}
      </Flex>
    </Box>
  );
};

const Notch = () => {
  return (
    <Flex
      style={{
        justifySelf: "start",
        borderBottomLeftRadius: "30px",
        borderBottomRightRadius: "30px",
        width: "50%",
        height: "5%",
        backgroundColor: "#111",
        position: "relative",
        left: "25%",
        top: "-10px",
      }}
    />
  );
};
