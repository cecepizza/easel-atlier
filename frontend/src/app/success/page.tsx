"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useArtworkStore } from "../../store/useArtworkStore";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const router = useRouter();
  const clearCart = useArtworkStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
    const timeout = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [clearCart, router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-md mx-auto space-y-6">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h1 className="text-3xl font-bold">Thank you for your purchase!</h1>
        <p className="text-gray-600">
          Your order has been confirmed and will be shipped soon.
        </p>
        <button
          onClick={() => router.push("/")}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Return to Gallery
        </button>
      </div>
    </div>
  );
}
