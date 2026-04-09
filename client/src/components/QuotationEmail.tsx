import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Hr,
} from "@react-email/components";

interface QuotationEmailProps {
  productName: string;
  productId: string;
  productBrand: string;
  productModel: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  quantity?: number;
  message?: string;
}

export default function QuotationEmail({
  productName,
  productId,
  productBrand,
  productModel,
  customerName,
  customerEmail,
  customerPhone,
  quantity,
  message,
}: QuotationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Solicitud de Cotización</Heading>
          
          <Section style={section}>
            <Heading as="h2" style={h2}>Información del Producto</Heading>
            <Text style={text}>
              <strong>Producto:</strong> {productName}
            </Text>
            <Text style={text}>
              <strong>ID:</strong> {productId}
            </Text>
            <Text style={text}>
              <strong>Marca:</strong> {productBrand}
            </Text>
            <Text style={text}>
              <strong>Modelo:</strong> {productModel}
            </Text>
          </Section>

          {(customerName || customerEmail || customerPhone) && (
            <>
              <Hr style={hr} />
              <Section style={section}>
                <Heading as="h2" style={h2}>Información del Cliente</Heading>
                {customerName && (
                  <Text style={text}>
                    <strong>Nombre:</strong> {customerName}
                  </Text>
                )}
                {customerEmail && (
                  <Text style={text}>
                    <strong>Email:</strong> {customerEmail}
                  </Text>
                )}
                {customerPhone && (
                  <Text style={text}>
                    <strong>Teléfono:</strong> {customerPhone}
                  </Text>
                )}
                {quantity && (
                  <Text style={text}>
                    <strong>Cantidad solicitada:</strong> {quantity}
                  </Text>
                )}
              </Section>
            </>
          )}

          {message && (
            <>
              <Hr style={hr} />
              <Section style={section}>
                <Heading as="h2" style={h2}>Mensaje Adicional</Heading>
                <Text style={text}>{message}</Text>
              </Section>
            </>
          )}

          <Hr style={hr} />
          <Text style={footer}>
            Esta cotización fue solicitada desde el sitio web de PROTON Fire & Rescue.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const h1 = {
  color: "#155DFC",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.4",
  margin: "0 0 20px",
};

const h2 = {
  color: "#2f2f3b",
  fontSize: "18px",
  fontWeight: "600",
  lineHeight: "1.4",
  margin: "0 0 12px",
};

const section = {
  margin: "16px 0",
};

const text = {
  color: "#4b5563",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "8px 0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
};

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  textAlign: "center" as const,
  margin: "20px 0 0",
};
