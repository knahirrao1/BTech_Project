import React, { useState } from "react";
import Footer from "../Layout/Footer";
import Header from "../Layout/Header";
import styles from "../../styles/styles";

const FAQPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const toggleTab = (tab) => {
    if (activeTab === tab) {
      setActiveTab(0);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div>
      <Header activeHeading={4} />
      <div className={`${styles.section} my-8`}>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">FAQ</h2>
        <div className="mx-auto space-y-4">
          {/* single Faq */}

          <div className="border-b border-gray-200 pb-4">
            <button
              className="flex items-center justify-between w-full"
              onClick={() => toggleTab(1)}
            >
              <span className="text-lg font-medium text-gray-900">
                What is your return policy?
              </span>
              {activeTab === 1 ? (
                <svg
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
            {activeTab === 1 && (
              <div className="mt-4">
                <p className="text-base text-gray-500">
                  If you're not satisfied with your purchase, we accept returns
                  within 30 days of delivery. To initiate a return, please email
                  us at support@ecommerce.com with your order number and a brief
                  explanation of why you're returning the item.
                </p>
              </div>
            )}
          </div>

          <div className="border-b border-gray-200 pb-4">
            <button
              className="flex items-center justify-between w-full"
              onClick={() => toggleTab(2)}
            >
              <span className="text-lg font-medium text-gray-900">
                How do I track my order?
              </span>
              {activeTab === 2 ? (
                <svg
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
            {activeTab === 2 && (
              <div className="mt-4">
                <p className="text-base text-gray-500">
                  You can track your order by logging into your account on our
                  website and viewing the order details.
                </p>
              </div>
            )}
          </div>

          <div className="border-b border-gray-200 pb-4">
            <button
              className="flex items-center justify-between w-full"
              onClick={() => toggleTab(3)}
            >
              <span className="text-lg font-medium text-gray-900">
                How do I contact customer support?
              </span>
              {activeTab === 3 ? (
                <svg
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
            {activeTab === 3 && (
              <div className="mt-4">
                <p className="text-base text-gray-500">
                  You can contact our customer support team by emailing us at
                  support@ecommerce.com, Monday through Friday.
                </p>
              </div>
            )}
          </div>

          <div className="border-b border-gray-200 pb-4">
            <button
              className="flex items-center justify-between w-full"
              onClick={() => toggleTab(4)}
            >
              <span className="text-lg font-medium text-gray-900">
                Can I change or cancel my order?
              </span>
              {activeTab === 4 ? (
                <svg
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
            {activeTab === 4 && (
              <div className="mt-4">
                <p className="text-base text-gray-500">
                  Unfortunately, once an order has been placed, we are not able
                  to make changes or cancellations. If you no longer want the
                  items you've ordered, you can return them for a refund within
                  30 days of delivery.
                </p>
              </div>
            )}
          </div>

          <div className="border-b border-gray-200 pb-4">
            <button
              className="flex items-center justify-between w-full"
              onClick={() => toggleTab(5)}
            >
              <span className="text-lg font-medium text-gray-900">
                Do you offer international shipping?
              </span>
              {activeTab === 5 ? (
                <svg
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
            {activeTab === 5 && (
              <div className="mt-4">
                <p className="text-base text-gray-500">
                  Currently, we only offer shipping within INDIA.
                </p>
              </div>
            )}
          </div>

          <div className="border-b border-gray-200 pb-4">
            <button
              className="flex items-center justify-between w-full"
              onClick={() => toggleTab(6)}
            >
              <span className="text-lg font-medium text-gray-900">
                Accepted payment methods
              </span>
              {activeTab === 6 ? (
                <svg
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
            {activeTab === 6 && (
              <div className="mt-4">
                <p className="text-base text-gray-500">
                  We accept visa, mastercard payment method also we have cash on
                  delivery system.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQPage;
