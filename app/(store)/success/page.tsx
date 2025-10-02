"use client";

import { useEffect } from "react";
import useBasketStore from "../store";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function SuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const clearBasket = useBasketStore((state) => state.clearBasket);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (orderNumber) {
      clearBasket();
    }
  }, [orderNumber, clearBasket]);

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-10 max-w-md w-full mx-4">
        <div className="flex justify-center mb-6">
          {/* Pulsing circle background */}
          <div className="flex justify-center items-center w-20 h-20 rounded-full bg-green-200 animate-pulse">
            {/* Check Icon */}
            <svg
              className="w-16 h-16 text-green-600 z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-6 text-center">
          Thank You for Your Order!
        </h1>

        <p className="text-gray-700 mb-6">
          Your order has been confirmed and will be shipped shortly.
        </p>

        <div className="space-y-4 mb-6">
          {orderNumber && (
            <p className="text-gray-600 flex items-center space-x-5">
              <span>Order Number:</span>
              <span className="font-mono text-sm text-green-600">
                {orderNumber}
              </span>
            </p>
          )}
          {sessionId && (
            <p className="text-gray-600 flex items-center space-x-5">
              <span>Transaction ID:</span>
              <span className="font-mono text-sm text-blue-600 break-all">
                {String(sessionId)}
              </span>
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:flex-col lg:flex-row lg:gap-6 lg:justify-center items-stretch">
          <Button
            asChild
            className="bg-green-600 text-white hover:bg-green-700 w-full lg:w-auto flex-1 flex items-center justify-center"
          >
            <Link href="/orders">View Order Details</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full lg:w-auto flex-1 flex items-center justify-center"
          >
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;
