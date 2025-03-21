// src/utils/exportHelpers.js
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { format } from "date-fns";

/**
 * Format a date for display
 * @param {Date|string|number} date - The date to format
 * @param {string} formatString - The format string (default: 'MM/dd/yyyy h:mm a')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatString = "MM/dd/yyyy h:mm a") => {
  if (!date) return "N/A";

  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    return format(dateObj, formatString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

/**
 * Prepare incidents data for export
 * @param {Array} incidents - Array of incident objects
 * @returns {Array} Array of formatted incident objects for export
 */
const prepareIncidentsForExport = (incidents) => {
  return incidents.map((incident) => ({
    Date: formatDate(incident.timestamp),
    "Case #": incident.caseNumber || "N/A",
    "Store #": incident.storeNumber || "N/A",
    "Incident Type": Array.isArray(incident.incidentTypes)
      ? incident.incidentTypes.join(", ")
      : incident.incidentTypes || "N/A",
    Details: incident.details || "",
    Status: incident.status || "pending",
    "Police Report #": incident.policeReport || "N/A",
  }));
};

/**
 * Generate a PDF report of incidents
 * @param {Array} incidents - Array of incident objects
 * @param {Object} filters - Filters applied to the data
 * @returns {Blob} PDF file as blob
 */
export const generatePdfReport = (incidents, filters = {}) => {
  // Create a new PDF document
  const doc = new jsPDF();

  // Add title and date
  doc.setFontSize(18);
  doc.text("Incident Report", 14, 22);

  // Add report generation date
  doc.setFontSize(10);
  doc.text(`Generated: ${formatDate(new Date())}`, 14, 30);

  // Add filter information if available
  let yPosition = 38;
  if (Object.keys(filters).length > 0) {
    doc.setFontSize(12);
    doc.text("Filters Applied:", 14, yPosition);
    yPosition += 6;

    // Add each filter
    doc.setFontSize(10);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        let filterText = `${key.charAt(0).toUpperCase() + key.slice(1)}: `;

        // Format dates in a readable way
        if (key === "startDate" || key === "endDate") {
          filterText += formatDate(value, "MM/dd/yyyy");
        } else {
          filterText += value;
        }

        doc.text(filterText, 14, yPosition);
        yPosition += 5;
      }
    });

    yPosition += 5;
  }

  // Prepare the data
  const formattedIncidents = prepareIncidentsForExport(incidents);

  // Use autoTable as a function instead of a method
  if (formattedIncidents.length > 0) {
    autoTable(doc, {
      startY: yPosition,
      head: [Object.keys(formattedIncidents[0])],
      body: formattedIncidents.map((incident) => Object.values(incident)),
      styles: { overflow: "ellipsize", cellWidth: "wrap" },
      columnStyles: {
        3: { cellWidth: 40 }, // Incident Type column
        4: { cellWidth: 50 }, // Details column
      },
      didDrawPage: (data) => {
        // Add page number at the bottom
        doc.setFontSize(10);
        doc.text(
          `Page ${
            doc.internal.getCurrentPageInfo().pageNumber
          } of ${doc.internal.getNumberOfPages()}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      },
    });
  } else {
    // Handle empty data
    doc.setFontSize(12);
    doc.text("No data available for report", 14, yPosition + 20);
  }

  // Return the PDF as a blob
  return doc.output("blob");
};

/**
 * Generate an Excel report of incidents
 * @param {Array} incidents - Array of incident objects
 * @param {Object} filters - Filters applied to the data
 * @returns {Blob} Excel file as blob
 */
export const generateExcelReport = (incidents, filters = {}) => {
  // Prepare the data
  const formattedIncidents = prepareIncidentsForExport(incidents);

  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Convert the data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedIncidents);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Incidents");

  // Add a filter info worksheet if filters are applied
  if (Object.keys(filters).length > 0) {
    const filterData = Object.entries(filters)
      .filter(([_, value]) => value)
      .map(([key, value]) => {
        // Format dates in a readable way
        if (key === "startDate" || key === "endDate") {
          return [key, formatDate(value, "MM/dd/yyyy")];
        }
        return [key, value];
      });

    // Add report generation date to filter info
    filterData.unshift(["Report Generated", formatDate(new Date())]);

    const filterWorksheet = XLSX.utils.aoa_to_sheet(filterData);
    XLSX.utils.book_append_sheet(workbook, filterWorksheet, "Filters");
  }

  // Convert the workbook to a binary string
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Return the Excel file as a blob
  return new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
};

/**
 * Download a blob as a file
 * @param {Blob} blob - The blob to download
 * @param {string} filename - The filename to use
 */
export const downloadBlob = (blob, filename) => {
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  // Append the link to the body
  document.body.appendChild(link);

  // Click the link to trigger the download
  link.click();

  // Clean up
  URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

/**
 * Generate and download a PDF report
 * @param {Array} incidents - Array of incident objects
 * @param {Object} filters - Filters applied to the data
 */
export const downloadPdfReport = (incidents, filters = {}) => {
  const blob = generatePdfReport(incidents, filters);
  const date = format(new Date(), "yyyyMMdd_HHmmss");
  downloadBlob(blob, `incident_report_${date}.pdf`);
};

/**
 * Generate and download an Excel report
 * @param {Array} incidents - Array of incident objects
 * @param {Object} filters - Filters applied to the data
 */
export const downloadExcelReport = (incidents, filters = {}) => {
  const blob = generateExcelReport(incidents, filters);
  const date = format(new Date(), "yyyyMMdd_HHmmss");
  downloadBlob(blob, `incident_report_${date}.xlsx`);
};
