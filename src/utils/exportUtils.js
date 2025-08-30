import * as XLSX from 'xlsx';
import { API_ENDPOINTS } from '../apiConfig';
import { fetchWithTimeout, handleFetchError } from './fetchUtils';

export const exportTransactions = async (search, status, type, setExportLoading, sessionId, showErrorModal) => {
  setExportLoading(true);
  try {
    const token = localStorage.getItem("access_token");
    
    // 🔥 FIX: Ensure we have a session ID
    if (!sessionId) {
      showErrorModal('Export Error', 'No active session found. Please select a session first.');
      return;
    }
    
    // Fetch ALL transactions for export (without pagination)
    const params = new URLSearchParams();
    
    // 🔥 FIX: Add session_id parameter first
    params.append("session_id", sessionId);
    
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    if (type) params.append("type", type);
    params.append("page_size", "1000"); // Get up to 1000 records

    const res = await fetchWithTimeout(`${API_ENDPOINTS.GET_TRANSACTIONS}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }, 60000); // 60 seconds for export
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`Failed to fetch transactions: ${errorData.message || res.statusText}`);
    }
    
    const responseData = await res.json();
    console.log("Export Response Data: ", responseData);
    
    // 🔥 FIX: Handle the exact response structure you showed
    if (!responseData.success) {
      throw new Error(responseData.message || 'Request failed');
    }
    
    const data = responseData.data;
    const allTransactions = data.results || [];

    if (allTransactions.length === 0) {
      showErrorModal('Export Warning', 'No transactions found to export with the current filters.');
      return;
    }

    const formatDateTime = (dateTimeString) => {
      if (!dateTimeString) return { date: '', time: '' };
      
      const dateObj = new Date(dateTimeString);
      const date = dateObj.toLocaleDateString();
      const time = dateObj.toLocaleTimeString();
      
      return { date, time };
    };    

    // Prepare data for Excel based on your exact response structure
    const exportData = allTransactions.map((tx, index) => {
      const { date, time } = formatDateTime(tx.submitted_at);
      
      return {
        'S/N': index + 1,
        'Name': tx.payer_name || `${tx.payer_first_name || ''} ${tx.payer_last_name || ''}`.trim(),
        'Matric Number': tx.payer_matric || '',
        'Email': tx.payer_email || '',
        'Reference': tx.reference_id || '',
        'Items': tx.payment_item_titles?.join(", ") || '',
        'Amount': Number(tx.amount_paid || 0),
        'Status': tx.is_verified ? 'Verified' : 'Unverified',
        'Date Submitted': date,
        'Time Submitted': time,
      };
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const colWidths = [
      { wch: 5 },   // S/N
      { wch: 20 },  // Name
      { wch: 15 },  // Matric Number
      { wch: 20 },  // Email
      { wch: 15 },  // Reference
      { wch: 30 },  // Items
      { wch: 12 },  // Amount
      { wch: 12 },  // Status
      { wch: 12 },  // Date Submitted
      { wch: 12 },  // Time Submitted
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

    // Generate filename with current date and session info
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `transactions_session_${sessionId}_${currentDate}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);

    console.log(`Successfully exported ${exportData.length} transactions`);

  } catch (err) {
    const errorInfo = handleFetchError(err);
    console.error('Export error:', err);
    showErrorModal('Export Failed', `Failed to export transactions: ${errorInfo.message}`);
  } finally {
    setExportLoading(false);
  }
};

export const exportPayers = async (search, faculty, department, setExportLoading, sessionId, showErrorModal) => {
  setExportLoading(true);
  try {
    const token = localStorage.getItem("access_token");
    
    // 🔥 FIX: Ensure we have a session ID
    if (!sessionId) {
      showErrorModal('Export Error', 'No active session found. Please select a session first.');
      return;
    }
    
    // Fetch ALL payers for export (without pagination)
    const params = new URLSearchParams();
    
    // 🔥 FIX: Add session_id parameter first
    params.append("session_id", sessionId);
    
    if (search) params.append("search", search);
    if (faculty) params.append("faculty", faculty);
    if (department) params.append("department", department);
    params.append("page_size", "1000"); // Get up to 1000 records

    // 🔥 FIX: Use GET_PAYERS endpoint (not CREATE_PAYER)
    const res = await fetchWithTimeout(`${API_ENDPOINTS.GET_PAYERS}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }, 60000); // 60 seconds for export
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`Failed to fetch payers: ${errorData.message || res.statusText}`);
    }
    
    const responseData = await res.json();
    console.log("Export Payers Response Data: ", responseData);
    
    // 🔥 FIX: Handle the exact response structure you showed
    if (!responseData.success) {
      throw new Error(responseData.message || 'Request failed');
    }
    
    const data = responseData.data;
    const allPayers = data.results || [];

    if (allPayers.length === 0) {
      showErrorModal('Export Warning', 'No payers found to export with the current filters.');
      return;
    }

    // Prepare data for Excel based on your exact response structure
    const exportData = allPayers.map((payer, index) => ({
      'S/N': index + 1,
      'First Name': payer.first_name || '',
      'Last Name': payer.last_name || '',
      'Matric Number': payer.matric_number || '',
      'Email': payer.email || '',
      'Phone Number': payer.phone_number || '',
      'Faculty': payer.faculty || '',
      'Department': payer.department || '',
      'Date Registered': payer.created_at ? new Date(payer.created_at).toLocaleDateString() : '',
      'Total Transactions': payer.total_transactions || 0,
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
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Payers');

    // Generate filename with current date and session info
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `payers_session_${sessionId}_${currentDate}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);

    console.log(`Successfully exported ${exportData.length} payers`);

  } catch (err) {
    const errorInfo = handleFetchError(err);
    console.error('Export error:', err);
    showErrorModal('Export Failed', `Failed to export payers: ${errorInfo.message}`);
  } finally {
    setExportLoading(false);
  }
};