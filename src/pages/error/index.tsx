

export default function ErrorPage() {
  const handleReload = () => {
    window.history.back(); 
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-xl p-10 w-[400px] text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/565/565547.png"
          alt="server down"
          className="w-20 mx-auto mb-4 opacity-80"
        />

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Server Not Available
        </h1>

        <p className="text-gray-500 mb-6">
          The backend server is down or unreachable.
          <br />
          Please try again later.
        </p>

        <button
          onClick={handleReload}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-md"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
