export default function STKPushQueryLoading({number}:{number:string}) {
    return (
      <div className="space-y-2 text-center text-black p-10 bg-gray-100">
        <h1 className="animate-pulse">PROCESSING PAYMENT....</h1>
        <h1>An Stk push has been sent to {number}</h1>
        <h1 className="gray-500">Please enter your Mpesa pin to complete the transaction</h1>
      </div>
    );
  }