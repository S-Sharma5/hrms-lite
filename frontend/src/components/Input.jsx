export default function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = true,
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-300">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
      />
    </div>
  );
}