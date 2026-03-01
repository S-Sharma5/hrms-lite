export default function Button({ children, onClick, variant = "primary", type = "button" }) {
  const base =
    "px-4 py-2 rounded-xl font-semibold transition duration-200";

  const styles = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
  };

  return (
    <button type={type} onClick={onClick} className={`${base} ${styles[variant]}`}>
      {children}
    </button>
  );
}