export default function PayersTable({ payers, loading, onViewDetails }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow">
      <h2 className="text-lg font-semibold text-white mb-4">Payers List</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-sm">
              <th className="py-2">NAME</th>
              <th className="py-2">MATRIC NUMBER</th>
              <th className="py-2">EMAIL</th>
              <th className="py-2">PHONE NUMBER</th>
              {/* <th className="py-2">FACULTY</th>
              <th className="py-2">DEPARTMENT</th> */}
              <th className="py-2">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-6">Loading...</td>
              </tr>
            ) : payers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-6">No payers found.</td>
              </tr>
            ) : (
              payers.map((payer, idx) => (
                <tr key={payer.id || idx} className="border-t border-gray-800">
                  <td className="py-4 text-white font-medium">{payer.first_name} {payer.last_name}</td>
                  <td className="py-4 text-white">{payer.matric_number}</td>
                  <td className="py-4 text-white">{payer.email}</td>
                  <td className="py-4 text-white">{payer.phone_number}</td>
                  {/* <td className="py-4 text-white">{payer.faculty}</td>
                  <td className="py-4 text-white">{payer.department}</td> */}
                  <td className="py-4">
                    <button
                      className="text-purple-600 hover:underline cursor-pointer font-semibold"
                      onClick={() => onViewDetails(payer)}
                    >
                      View Details
                    </button>
                    
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}