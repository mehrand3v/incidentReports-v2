// src/utils/exportHelpers.jsx
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { formatDate as appFormatDate } from "./formatters"; // Import the main formatDate function

/**
 * Prepare incidents data for export
 * @param {Array} incidents - Array of incident objects
 * @param {boolean} forPdf - Whether the data is being prepared for PDF (affects truncation)
 * @returns {Array} Array of formatted incident objects for export
 */
const prepareIncidentsForExport = (incidents, forPdf = false) => {
  return incidents.map((incident) => {
    // Use the application's formatDate function from formatters.js for consistent date handling
    const dateStr = appFormatDate(incident.timestamp, "MM/dd/yy h:mm a");

    // Handle truncation differently for PDF vs Excel
    const truncate = (str, maxLength = 30) => {
      if (!str || typeof str !== "string") return str;

      // For PDF exports, don't truncate the details column
      if (forPdf) return str;

      // For other exports, truncate for better fit
      return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
    };

    // Get incident type with possibly shorter representation
    let incidentType = "";
    if (Array.isArray(incident.incidentTypes)) {
      incidentType = incident.incidentTypes.join(", ");
    } else {
      incidentType = incident.incidentTypes || "—";
    }

    return {
      Date: dateStr || "—",
      "Case#": incident.caseNumber || "—",
      "Store#": incident.storeNumber || "—",
      "Inc.": truncate(incidentType, 20),
      Details: forPdf
        ? incident.details || "—"
        : truncate(incident.details || "", 35),
      Status: truncate(incident.status || "pending", 10),
      "Police#": incident.policeReport || "—",
    };
  });
};

/**
 * Generate a PDF report of incidents
 * @param {Array} incidents - Array of incident objects
 * @param {Object} filters - Filters applied to the data
 * @returns {Blob} PDF file as blob
 */
export const generatePdfReport = (incidents, filters = {}) => {
  // Create a new PDF document - use landscape orientation for more width
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt", // Use points for more precise control
  });

  // Add title and date
  doc.setFontSize(18);
  doc.text("Incident Report", 14, 22);

  // Format the current date using the proper formatter
  const now = new Date();
  const formattedNow = format(now, "MM/dd/yyyy h:mm a");
  doc.setFontSize(10);
  doc.text(`Generated: ${formattedNow}`, 14, 30);

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

        // Format dates using the application's formatDate function
        if (key === "startDate" || key === "endDate") {
          filterText += appFormatDate(value, "MM/dd/yyyy");
        } else {
          filterText += value;
        }

        doc.text(filterText, 14, yPosition);
        yPosition += 5;
      }
    });

    yPosition += 5;
  }

  // Prepare the data - with forPdf=true to prevent truncation
  const formattedIncidents = prepareIncidentsForExport(incidents, true);

  // Use autoTable as a function instead of a method
  if (formattedIncidents.length > 0) {
    autoTable(doc, {
      startY: yPosition,
      head: [Object.keys(formattedIncidents[0])],
      body: formattedIncidents.map((incident) => Object.values(incident)),
      styles: {
        overflow: "linebreak", // Change from 'ellipsize' to 'linebreak' to show all text
        fontSize: 8,
        cellPadding: 2,
        halign: "left",
      },
      columnStyles: {
        0: { cellWidth: 70 }, // Date
        1: { cellWidth: 80 }, // Case#
        2: { cellWidth: 50 }, // Store#
        3: { cellWidth: 70 }, // Inc.
        4: { cellWidth: "auto" }, // Details - auto width to accommodate full text
        5: { cellWidth: 50 }, // Status
        6: { cellWidth: 60 }, // Police#
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
      tableWidth: "auto",
      margin: { top: 15, right: 15, bottom: 15, left: 15 },
      theme: "striped",
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
  // Prepare the data - Excel can show all text, but we'll keep standard formatting
  const formattedIncidents = prepareIncidentsForExport(incidents, false);

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
        // Format dates using the application's formatDate function
        if (key === "startDate" || key === "endDate") {
          return [key, appFormatDate(value, "MM/dd/yyyy")];
        }
        return [key, value];
      });

    // Add report generation date to filter info
    const now = new Date();
    filterData.unshift(["Report Generated", format(now, "MM/dd/yyyy h:mm a")]);

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
export const downloadPdfReport = async (incidents, filters = {}) => {
  try {
    const blob = generatePdfReport(incidents, filters);
    // Format date directly
    const now = new Date();
    const dateStr =
      now.getFullYear() +
      ("0" + (now.getMonth() + 1)).slice(-2) +
      ("0" + now.getDate()).slice(-2) +
      "_" +
      ("0" + now.getHours()).slice(-2) +
      ("0" + now.getMinutes()).slice(-2) +
      ("0" + now.getSeconds()).slice(-2);
    downloadBlob(blob, `incident_report_${dateStr}.pdf`);
  } catch (error) {
    console.error("Error generating PDF report:", error);
    throw error;
  }
};

/**
 * Generate and download an Excel report
 * @param {Array} incidents - Array of incident objects
 * @param {Object} filters - Filters applied to the data
 */
export const downloadExcelReport = async (incidents, filters = {}) => {
  try {
    const blob = generateExcelReport(incidents, filters);
    // Format date directly
    const now = new Date();
    const dateStr =
      now.getFullYear() +
      ("0" + (now.getMonth() + 1)).slice(-2) +
      ("0" + now.getDate()).slice(-2) +
      "_" +
      ("0" + now.getHours()).slice(-2) +
      ("0" + now.getMinutes()).slice(-2) +
      ("0" + now.getSeconds()).slice(-2);
    downloadBlob(blob, `incident_report_${dateStr}.xlsx`);
  } catch (error) {
    console.error("Error generating Excel report:", error);
    throw error;
  }
};

// Keep the formatDate function for compatibility, but have it use the app's version
export const formatDate = (date, formatString = "MM/dd/yyyy h:mm a") => {
  return appFormatDate(date, formatString);
};
