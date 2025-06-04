export default function TopDepartments() {
  // Dummy data, replace with real data as needed
  const departments = [
    { name: "Faculty of Engineering", value: "₦2.4M", color: "text-purple-400" },
    { name: "Faculty of Science", value: "₦1.8M", color: "text-blue-400" },
    { name: "Faculty of Arts", value: "₦1.2M", color: "text-green-400" }
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow">
      <h2 className="text-lg font-semibold text-white mb-4">Top Departments</h2>
      <ul className="space-y-2">
        {departments.map((dept, idx) => (
          <li key={idx} className="flex justify-between items-center">
            <span className={`font-medium ${dept.color}`}>{dept.name}</span>
            <span className="text-white">{dept.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}