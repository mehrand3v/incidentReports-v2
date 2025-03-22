// src/utils/exportHelpers.jsx
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
  if (!date) return "—";

  try {
    // Handle both string and Date objects
    let dateObj;
    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === "string" || typeof date === "number") {
      // For string or number input, create a new Date object
      dateObj = new Date(date);
    } else {
      return "—";
    }

    // Check if the date is valid before formatting
    if (isNaN(dateObj.getTime())) {
      return "—";
    }

    return format(dateObj, formatString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "—";
  }
};

/**
 * Prepare incidents data for export
 * @param {Array} incidents - Array of incident objects
 * @returns {Array} Array of formatted incident objects for export
 */
const prepareIncidentsForExport = (incidents) => {
  return incidents.map((incident) => {
    // Properly handle timestamp with best-effort date extraction
    let dateStr = "";
    if (incident.timestamp) {
      try {
        // For common timestamp formats
        const date = new Date(incident.timestamp);
        if (!isNaN(date.getTime())) {
          dateStr = format(date, "MM/dd/yy h:mm"); // Shortened date format
        } else {
          // For timestamps that might be nested in objects or arrays
          let extracted = null;

          // Handle array
          if (
            Array.isArray(incident.timestamp) &&
            incident.timestamp.length > 0
          ) {
            extracted = new Date(incident.timestamp[0]);
          }
          // Handle object with date property
          else if (
            typeof incident.timestamp === "object" &&
            incident.timestamp !== null
          ) {
            // Try common date properties
            const possibleDateProps = [
              "date",
              "created",
              "createdAt",
              "timestamp",
              "time",
              "datetime",
            ];
            for (const prop of possibleDateProps) {
              if (incident.timestamp[prop]) {
                extracted = new Date(incident.timestamp[prop]);
                if (!isNaN(extracted.getTime())) break;
              }
            }
          }
          // Handle string that might contain a date
          else if (typeof incident.timestamp === "string") {
            // Look for ISO date patterns
            const isoMatch = incident.timestamp.match(/\d{4}-\d{2}-\d{2}/);
            if (isoMatch) {
              extracted = new Date(isoMatch[0]);
            }
            // Look for US date patterns MM/DD/YYYY
            const usMatch = incident.timestamp.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
            if (!extracted && usMatch) {
              extracted = new Date(usMatch[0]);
            }
          }

          if (extracted && !isNaN(extracted.getTime())) {
            dateStr = format(extracted, "MM/dd/yy"); // Shortened date format
          }
        }
      } catch (e) {
        console.error("Error formatting incident timestamp:", e);
      }
    }

    // Truncate long values for better fit
    const truncate = (str, maxLength = 30) => {
      if (!str || typeof str !== "string") return str;
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
      "Case#": incident.caseNumber || "—", // Removed space to save width
      "Store#": incident.storeNumber || "—", // Removed space to save width
      "Inc.": truncate(incidentType, 20), // Shortened header and truncated value
      Details: truncate(incident.details || "", 35),
      Status: truncate(incident.status || "pending", 10),
      "Police#": incident.policeReport || "—", // Removed space to save width
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

  // Add title and date - directly format current date to avoid any issues
  doc.setFontSize(18);
  doc.text("Incident Report", 14, 22);

  // Format the current date directly without using formatDate
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

        // Format dates in a readable way - direct handling without helper functions
        if (key === "startDate" || key === "endDate") {
          try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              filterText += format(date, "MM/dd/yyyy");
            } else {
              filterText += "—";
            }
          } catch (e) {
            filterText += "—";
          }
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
      styles: {
        overflow: "ellipsize",
        fontSize: 8,
        cellPadding: 2,
        halign: "left",
      },
      columnStyles: {
        0: { cellWidth: "auto" }, // Date
        1: { cellWidth: "auto" }, // Case#
        2: { cellWidth: "auto" }, // Store#
        3: { cellWidth: "auto" }, // Inc.
        4: { cellWidth: "auto" }, // Details
        5: { cellWidth: "auto" }, // Status
        6: { cellWidth: "auto" }, // Police#
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
        // Format dates in a readable way - direct handling without helper functions
        if (key === "startDate" || key === "endDate") {
          try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              return [key, format(date, "MM/dd/yyyy")];
            } else {
              return [key, "—"];
            }
          } catch (error) {
            return [key, "—"];
          }
        }
        return [key, value];
      });

    // Add report generation date to filter info - format directly
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
export const downloadPdfReport = (incidents, filters = {}) => {
  try {
    const blob = generatePdfReport(incidents, filters);
    // Format date directly to avoid any date-related issues
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
export const downloadExcelReport = (incidents, filters = {}) => {
  try {
    const blob = generateExcelReport(incidents, filters);
    // Format date directly to avoid any date-related issues
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
