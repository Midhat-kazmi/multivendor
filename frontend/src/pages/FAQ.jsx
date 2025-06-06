import React, { useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";

const faqs = [
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy. Products must be unused and in original packaging.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Shipping usually takes 3-7 business days, depending on your location.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship internationally. Shipping charges vary based on destination.",
  },
  {
    question: "How can I track my order?",
    answer:
      "After your order is shipped, you’ll receive a tracking number via email.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <Header activeHeading={6} />

      <div className={`${styles.section} min-h-screen py-12`}>
        <h1 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:shadow"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-800">{faq.question}</h2>
                <span className="text-gray-500 text-xl">
                  {openIndex === index ? "-" : "+"}
                </span>
              </div>
              {openIndex === index && (
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;
