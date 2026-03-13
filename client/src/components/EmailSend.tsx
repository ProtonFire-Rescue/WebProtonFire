import { Body, Button, Container, Head, Heading, Html, Img, Preview, Section, Tailwind, Text } from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
  email: string;
  asunto: string;
  message: string;
  phone: string
}

const WelcomeEmail = ({
  name = 'Nicole',
  email = 'nicole@example.com',
  asunto = 'Nuevo mensaje',
  message = 'Nuevo mensaje',
  phone = '1xxxxxxxxx'
}: WelcomeEmailProps) => {
  const previewText = `!Haz recibido un nuevo mensaje de ${name}!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-black m-auto font-sans">
          <Container className="mb-10 mx-auto p-5 max-w-[465px]">
            <Section className="mt-10">
              <Img
                src={`https://example.com/brand/example-logo.png`}
                width="60"
                height="60"
                alt="Logo Example"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-2xl text-white font-normal text-center p-0 my-8 mx-0">
              ¡Haz recibido un nuevo mensaje de {name}!
            </Heading>
            <Text className="text-start text-sm text-white">
              Hello {name},
            </Text>
            <Text className="text-start text-sm text-white leading-relaxed">
              {message}
            </Text>
            <Section className="text-center mt-8 mb-8">
              <Button
                className="py-2.5 px-5 bg-white rounded-md text-black text-sm font-semibold no-underline text-center"
                href={`https://wa.me/${phone}`}
              >
                Ver mensaje
              </Button>
            </Section>
            <Text className="text-start text-sm text-white">
              Cheers,
              <br />
              Contacto ProtonFire Web
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;