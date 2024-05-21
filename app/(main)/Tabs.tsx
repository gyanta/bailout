"use client";

import { usePathname, useRouter } from "next/navigation";
import { SegmentedControl } from "@radix-ui/themes";

export const Tabs = () => {
  const router = useRouter();
  const tab = usePathname().split("/")[1];

  return (
    <SegmentedControl.Root
      radius="full"
      onValueChange={(tab) => router.replace(`/${tab}`)}
      value={tab}
    >
      <SegmentedControl.Item value="web">Web</SegmentedControl.Item>
      <SegmentedControl.Item value="phone">Phone</SegmentedControl.Item>
    </SegmentedControl.Root>
  );
};
