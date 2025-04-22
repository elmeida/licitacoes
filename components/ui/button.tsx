export function Button({ children, ...props }: any) {
  return (
    <button className="bg-verdePrefeitura hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50" {...props}>
      {children}
    </button>
  );
}