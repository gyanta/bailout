import {Container, Section} from "@radix-ui/themes";

export const PhoneTab = () => {
  return (
      <Section size="1">
          <Container size="1">
              <iframe
                  className="w-full aspect-video self-stretch md:min-h-96"
                  src="https://www.youtube.com/embed/oG6yuGYNhuk"
                  frameBorder="0"
                  title="Product Overview Video"
                  aria-hidden="true"
              />
          </Container>
      </Section>
  );
};
