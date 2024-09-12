export function DashboardNumbers({ number, title }: { number: number; title: string; }) {
  return (
    <div className="w-full flex flex-col items-center px-8 py-10 gap-2 bg-white rounded-lg drop-shadow-md">
      <h3 className="text-6xl text-primary font-bold">{number}</h3>
      <p className="text-grey text-sm text-wrap text-center font-light w-8/12">{title}</p>
    </div>
  );
}
