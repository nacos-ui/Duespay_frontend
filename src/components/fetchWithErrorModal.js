export async function fetchWithErrorModal(fetchPromise, setModalError) {
  try {
    const res = await fetchPromise;
    if (!res.ok) {
      let msg = "An error occurred.";
      try {
        const data = await res.json();
        msg = data.error || data.message || msg;
      } catch {}
      setModalError({
        open: true,
        title: "Server Error",
        message: msg,
      });
      throw new Error(msg);
    }
    return res;
  } catch (err) {
    setModalError({
      open: true,
      title: "Error",
      message: err.message || "A network error occurred.",
    });
    throw err;
  }
}