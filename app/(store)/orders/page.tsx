import { formatCurrency } from "@/lib/formatCurrency";
import { imageUrl } from "@/lib/imageUrl";
import { getMyOrders } from "@/lib/orders/getMyOrders";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

interface SanityImageAsset {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: SanityImageAsset;
}

export interface Order {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  stripeCustomerId?: string;
  currency: string;
  amountDiscount?: number;
  totalPrice: number;
  products: {
    product: Product;
    quantity: number;
  }[];
  status: "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  orderDate: string;
}

export default async function Orders() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const orders: Order[] = await getMyOrders(userId);
  console.log('Orders data:', orders);
  console.log('Number of orders:', orders.length);
    console.log('🔍 Current User ID:', userId);
  console.log('📝 User ID type:', typeof userId);
  console.log('🔢 User ID length:', userId?.length)

  console.log('👤 Auth userId:', userId);

  if (!userId) {
    console.log('❌ No userId, redirecting...');
    return redirect("/");
  }

  console.log('📦 Final orders data:', orders);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-xl p-4 sm:p-8 max-w-4xl w-full mx-4">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">
            <p>You have no orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {orders.map((order) => (
              <React.Fragment key={order.orderNumber}>
                {/* Order Header */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-gray-200 mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1 font-bold">
                          Order Number
                        </p>
                        <p className="font-mono text-sm text-green-600 break-all">
                          {order.orderNumber}
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-sm text-gray-600 mb-1 font-bold">
                          Order Date
                        </p>
                        <p className="font-medium">
                          {order.orderDate
                            ? new Date(order.orderDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status & Total */}
                  <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-sm text-gray-600 mb-1 font-bold">
                        Total Amount
                      </p>
                      <p className="font-medium text-lg">
                        {formatCurrency(order.totalPrice ?? 0, order.currency)}
                      </p>
                    </div>
                  </div>

                  {/* Discount Info */}
                  {order.amountDiscount !== undefined &&
                  order.amountDiscount !== null ? (
                    <div className="mt-4 p-3 sm:p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-600 font-medium mb-1 sm:text-base">
                        Discount Applied:{" "}
                        {formatCurrency(order.amountDiscount, order.currency)}
                      </p>
                      <p className="text-xs text-red-600 sm:text-sm">
                        Original Subtotal:{" "}
                        {formatCurrency(
                          (order.totalPrice ?? 0) + order.amountDiscount,
                          order.currency
                        )}
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* Order Items */}
                <div className="px-4 py-3 sm:px-6 sm:py-4">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">
                    Order Items
                  </p>
                  <div className="space-y-3 sm:space-y-4">
                    {order.products.map((item, idx) => (
                      <div
                        key={item.product._id ?? idx}
                        className="flex sm:items-center sm:justify-between sm:flex-row flex-col gap-3 py-2 border-b last:border-b-0"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {item.product.image && (
                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-md overflow-hidden">
                              <Image
                                src={imageUrl(item.product.image).url()}
                                alt={item.product.name ?? "Product Image"}
                                className="w-full h-full object-cover"
                                fill
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-sm sm:text-base truncate">
                              {item.product.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium text-right">
                          {formatCurrency(
                            item.product.price * item.quantity,
                            order.currency
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
