import Image from "next/image";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">BuyNGive / Sellr</h1>
      <p className="mt-2 text-slate-600">Powered by Brobbytech Systems</p>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl p-6 border shadow-sm hover:shadow">
          <div className="text-sm font-medium text-sky-600">Event</div>
          <div className="mt-2 text-lg">Community Theatre</div>
        </div>
        <div className="rounded-2xl p-6 border shadow-sm hover:shadow">
          <div className="text-sm font-medium text-emerald-600">Lotto</div>
          <div className="mt-2 text-lg">Weekly Draw</div>
        </div>
      </div>
    </main>
  );
}
