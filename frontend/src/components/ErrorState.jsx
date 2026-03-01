export default function ErrorState({ message }) {
  return (
    <div className="text-center py-20 text-red-400">
      {message}
    </div>
  );
}