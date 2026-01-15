import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How do I start creating a website?',
    answer:
      'To start creating a website, you can use our intuitive drag-and-drop editor. Simply choose a template, customize it with your content, and publish it with one click.',
  },
  {
    question: 'What API services do you offer?',
    answer:
      'We offer a range of API services including user authentication, data storage, and serverless functions. You can find detailed documentation for each service in our developer portal.',
  },
  {
    question: 'Can I connect my own domain?',
    answer:
      "Yes, you can connect your own domain to your website. Go to the 'Settings' tab in your dashboard and follow the instructions under the 'Domain' section.",
  },
];

export function FaqSection() {
  return (
    <div className="p-6 pt-0">
      <h3 className="mb-4 text-lg font-medium text-muted-foreground">
        Frequently Asked Questions
      </h3>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
