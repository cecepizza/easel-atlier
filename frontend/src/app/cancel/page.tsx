"use client";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-md mx-auto space-y-6">
        <XCircle className="w-16 h-16 text-red-500 mx-auto" />
        <h1 className="text-3xl font-bold">Order Cancelled</h1>
        <p className="text-gray-600">
          Your order has been cancelled. No charges were made.
        </p>
        <button
          onClick={() => router.push("/checkout")}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Return to Checkout
        </button>
      </div>
    </div>
  );
}
