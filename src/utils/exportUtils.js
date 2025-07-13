import * as XLSX from 'xlsx';
import { API_ENDPOINTS } from '../apiConfig';
import { fetchWithTimeout, handleFetchError } from './fetchUtils';

export const exportTransactions = async (search, status, type, setExportLoading) => {
  setExportLoading(true);
  try {
    const token = localStorage.getItem("access_token");
    // Fetch ALL transactions for export (without pagination)
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    if (type) params.append("type", type);
    params.append("page_size", "1000"); // Get up to 1000 records

    const res = await fetchWithTimeout(`${API_ENDPOINTS.GET_TRANSACTIONS}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }, 60000); // 60 seconds for export
    
    if (!res.ok) throw new Error("Failed to fetch transactions for export");
    const data = await res.json();
    const allTransactions = data.results || [];

    // Prepare data for Excel
    const exportData = allTransactions.map((tx, index) => ({
      'S/N': index + 1,
      'Name': tx.payer_name || `${tx.payer_first_name} ${tx.payer_last_name}`,
      'Reference': tx.reference_id,
      'Items': tx.payment_item_titles?.join(", ") || '',
      'Amount': Number(tx.amount_paid),
      'Status': tx.is_verified ? 'Verified' : 'Unverified',
      'Date': new Date(tx.submitted_at).toLocaleDateString(),
      'Email': tx.payer_email || '',
      'Phone': tx.payer_phone || '',
      'Matric Number': tx.payer_matric_number || '',
      'Faculty': tx.payer_faculty || '',
      'Department': tx.payer_department || '',
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const colWidths = [
      { wch: 5 },   // S/N
      { wch: 20 },  // Name
      { wch: 15 },  // Reference
      { wch: 30 },  // Items
      { wch: 12 },  // Amount
      { wch: 12 },  // Status
      { wch: 12 },  // Date
      { wch: 25 },  // Email
      { wch: 15 },  // Phone
      { wch: 15 },  // Matric Number
      { wch: 20 },  // Faculty
      { wch: 20 },  // Department
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `transactions_${currentDate}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);

  } catch (err) {
    const { message } = handleFetchError(err);
    alert(`Export failed: ${message}`);
  } finally {
    setExportLoading(false);
  }
};

export const exportPayers = async (search, faculty, department, setExportLoading) => {
  setExportLoading(true);
  try {
    const token = localStorage.getItem("access_token");
    // Fetch ALL payers for export (without pagination)
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (faculty) params.append("faculty", faculty);
    if (department) params.append("department", department);
    params.append("page_size", "1000"); // Get up to 1000 records

    const res = await fetchWithTimeout(`${API_ENDPOINTS.CREATE_PAYER}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }, 60000); // 60 seconds for export
    
    if (!res.ok) throw new Error("Failed to fetch payers for export");
    const data = await res.json();
    const allPayers = data.results || [];

    // Prepare data for Excel
    const exportData = allPayers.map((payer, index) => ({
      'S/N': index + 1,
      'First Name': payer.first_name,
      'Last Name': payer.last_name,
      'Matric Number': payer.matric_number,
      'Email': payer.email,
      'Phone Number': payer.phone_number,
      'Faculty': payer.faculty,
      'Department': payer.department,
      'Date Registered': new Date(payer.created_at).toLocaleDateString(),
      'Total Transactions': payer.total_transactions || 0,
      'Total Amount Paid': payer.total_amount_paid || 0,
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const colWidths = [
      { wch: 5 },   // S/N
      { wch: 15 },  // First Name
      { wch: 15 },  // Last Name
      { wch: 15 },  // Matric Number
      { wch: 25 },  // Email
      { wch: 15 },  // Phone Number
      { wch: 20 },  // Faculty
      { wch: 20 },  // Department
      { wch: 15 },  // Date Registered
      { wch: 15 },  // Total Transactions
      { wch: 15 },  // Total Amount Paid
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Payers');

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `payers_${currentDate}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);

  } catch (err) {
    const { message } = handleFetchError(err);
    alert(`Export failed: ${message}`);
  } finally {
    setExportLoading(false);
  }
};