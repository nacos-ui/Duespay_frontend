const SubmitButton = ({
    children,
    loading = false,
    loadingText = "Processing...",
    onClick,
    type = "submit",
    className = "",
    ...props
  }) => (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" size={20} />}
      {loading ? loadingText : children}
    </button>
  );

export default SubmitButton;