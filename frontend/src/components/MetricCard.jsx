export default function MetricCard({ title, value, subtitle, icon: Icon, iconColor = 'text-blue-500' }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`${iconColor} opacity-80`}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}
