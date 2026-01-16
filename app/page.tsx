import ToolSelectorForm from "../components/ToolSelectorForm";
import ThemeToggle from "../components/ThemeToggle";
import StructuredData from "../components/StructuredData";

export default function HomePage() {
  // Structured data for the tool selector
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Torque Tool Selector",
    description: "Select the right torque tool or hydraulic bolt tensioner for your industrial bolting application",
    applicationCategory: "IndustrialTool",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    featureList: [
      "Torque tool selection by requirement",
      "Industry-specific recommendations",
      "Application type filtering",
      "Power source preferences",
      "Environment considerations",
      "Accuracy priority selection",
      "Tool comparison"
    ],
    audience: {
      "@type": "Audience",
      audienceType: [
        "Industrial Engineers",
        "Maintenance Professionals",
        "Project Managers",
        "Bolting Specialists"
      ]
    },
    about: {
      "@type": "Thing",
      name: "Industrial Bolting",
      description: "Torque and tension tool selection for industrial bolting applications"
    }
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I select the right torque tool for my application?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Enter your torque requirement, fastener size, industry, application type, and operational constraints. The selector will recommend the most appropriate tools based on torque range, industry best practices, accuracy requirements, and environmental factors."
        }
      },
      {
        "@type": "Question",
        name: "What industries does the torque tool selector support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The selector supports Aerospace, Mining, Oil and Gas, Petrochemical, Railway, Manufacturing, Wind Energy, and Refineries industries. Each industry has specific tool preferences based on operational requirements and safety standards."
        }
      },
      {
        "@type": "Question",
        name: "What types of torque tools are available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The selector includes Battery Torque Tools (B-RAD, DB-RAD, V-RAD), Electric Torque Tools (E-RAD, E-RAD BLU), Pneumatic Torque Tools, Hydraulic Torque Wrenches (Square Drive and Low-Profile Cassette), and Hydraulic Bolt Tensioners."
        }
      }
    ]
  };

  return (
    <>
      <StructuredData data={[structuredData, faqStructuredData]} />
      <div className="space-y-8">
      <header className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-20 flex items-center">
            <a href="https://www.thetorqking.com" target="_blank" rel="noopener noreferrer" aria-label="Visit TorqKing.com">
              <img
                src="/torqking-logo.png.png"
                alt="TorqKing - Industrial Torque Tool Selector and Bolting Solutions"
                className="h-full w-auto object-contain"
                width={200}
                height={80}
                loading="eager"
              />
            </a>
          </div>
          <ThemeToggle />
        </div>
        <h1 className="text-3xl font-semibold text-industrial-900 dark:text-industrial-100">
          Torque Tool Selection for Industrial Bolting
        </h1>
        <p className="max-w-3xl text-base text-industrial-700 dark:text-industrial-300">
          Provide job scope and operational constraints. The selector returns the most
          conservative tooling options and the reasoning behind each recommendation.
        </p>
      </header>
      <section aria-label="Tool selector form">
        <ToolSelectorForm />
      </section>
    </div>
    </>
  );
}
