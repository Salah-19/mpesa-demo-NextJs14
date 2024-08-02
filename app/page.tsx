import PaymentForm from "@/components/PaymentForm";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <section className="bg-gray-100 max-w-400 h-screen flex justify-center items-center px-6">
      <PaymentForm />
      <Toaster/>
    </section>
  );
}

