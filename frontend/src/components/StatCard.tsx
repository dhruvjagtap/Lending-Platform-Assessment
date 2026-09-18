interface StatCardProps {
  title: string;
  value: string;
}

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="stat-card">
      <h3>{title}</h3>

      <p>{value}</p>
    </div>
  );
}
