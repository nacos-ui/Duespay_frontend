export default function PayersTable({ 
  payers, 
  loading, 
  onViewDetails,
  selectedPayers,
  setSelectedPayers
}) {
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPayers(payers.map(payer => payer.id));
    } else {
      setSelectedPayers([]);
    }
  };

  const handleSelectPayer = (payerId, checked) => {
    if (checked) {
      setSelectedPayers(prev => [...prev, payerId]);
    } else {
      setSelectedPayers(prev => prev.filter(id => id !== payerId));
    }
  };

  const isAllSelected = payers.length > 0 && selectedPayers.length === payers.length;
  const isIndeterminate = selectedPayers.length > 0 && selectedPayers.length < payers.length;

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Payers List</h2>
        {selectedPayers.length > 0 && (
          <span className="text-sm text-gray-400">
            {selectedPayers.length} selected
          </span>
        )}
      </div>
      
      <div className="overflow-x-auto hide-scrollbar w-full">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="text-gray-400 text-sm">
              <th className="py-2 w-12">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={input => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="accent-purple-600"
                />
              </th>
              <th className="py-2 w-[10rem]">NAME</th>
              <th className="py-2 w-[10rem]">MATRIC NUMBER</th>
              <th className="py-2 w-[15rem]">EMAIL</th>
              <th className="py-2 w-[10rem]">PHONE NUMBER</th>
              {/* <th className="py-2 w-[10rem]">FACULTY</th>
              <th className="py-2 w-[10rem]">DEPARTMENT</th> */}
              <th className="py-2 w-[10rem]">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-400 py-6">Loading...</td>
              </tr>
            ) : payers.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-400 py-6">No payers found.</td>
              </tr>
            ) : (
              payers.map((payer, idx) => (
                <tr key={payer.id || idx} className="border-t border-gray-800">
                  <td className="py-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedPayers.includes(payer.id)}
                      onChange={(e) => handleSelectPayer(payer.id, e.target.checked)}
                      className="accent-purple-600"
                    />
                  </td>
                  <td className="py-4 pr-2 text-white font-medium">
                    {payer.first_name} {payer.last_name}
                  </td>
                  <td className="py-4 text-white">{payer.matric_number}</td>
                  <td className="py-4 pr-2 text-white">{payer.email}</td>
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