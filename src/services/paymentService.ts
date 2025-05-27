import API from "./api";


export const downloadSalesReport = async () => {
  const response = await API.get("/payments/report/monthly", {
    responseType: "blob",
  });

  // Crear enlace para descarga
  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  const fecha = new Date().toISOString().split("T")[0];
  link.setAttribute("download", `Reporte_Ventas_${fecha}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
