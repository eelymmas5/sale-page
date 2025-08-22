export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background:
          "linear-gradient(180deg,rgba(13,3,8,1) 46%,rgba(0,0,0,1) 100%)",
      }}
    >
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#ff00aa] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg font-medium">กำลังโหลดเกม...</p>
        <p className="text-gray-400 text-sm mt-2">Loading games...</p>
      </div>
    </div>
  );
}