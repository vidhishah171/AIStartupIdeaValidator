"use client";

import jsPDF from "jspdf";
import { ValidationReport } from "@/lib/types";

export function downloadReportPdf(params: {
  ideaText: string;
  report: ValidationReport;
  createdAt: string;
}) {
  const { ideaText, report, createdAt } = params;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  const bottomLimit = pageHeight - 60;

  // Colors
  const brand: [number, number, number] = [74, 99, 255];
  const dark: [number, number, number] = [23, 23, 23];
  const body: [number, number, number] = [60, 60, 60];
  const muted: [number, number, number] = [120, 120, 120];
  const light: [number, number, number] = [200, 200, 200];
  const white: [number, number, number] = [255, 255, 255];
  const bgLight: [number, number, number] = [247, 248, 252];
  const green: [number, number, number] = [22, 163, 74];
  const amber: [number, number, number] = [217, 119, 6];
  const red: [number, number, number] = [220, 38, 38];

  let currentPage = 1;

  const safeText = (value?: string, fallback?: string) =>
    value?.trim() ? value : (fallback ?? "—");

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Unknown date";
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const score = Math.max(0, Math.min(100, report.marketDemandScore ?? 0));
  const scoreColor = score >= 75 ? green : score >= 50 ? amber : red;
  const scoreLabel = score >= 75 ? "Strong" : score >= 50 ? "Moderate" : "Weak";

  // --- Cursor helper with auto-pagination ---
  let y = margin;

  function ensureSpace(needed: number) {
    if (y + needed > bottomLimit) {
      addFooter();
      doc.addPage();
      currentPage++;
      y = margin;
    }
  }

  function addFooter() {
    // Thin line
    doc.setDrawColor(...light);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 40, pageWidth - margin, pageHeight - 40);
    // Left: branding
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.setFont("helvetica", "normal");
    doc.text(
      "IdeaPulse Validator — AI Startup Idea Validation Report",
      margin,
      pageHeight - 28,
    );
    // Right: page number
    doc.text(`Page ${currentPage}`, pageWidth - margin, pageHeight - 28, {
      align: "right",
    });
  }

  function drawDivider() {
    doc.setDrawColor(...light);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 16;
  }

  // --- COVER / TITLE SECTION ---
  // Brand accent bar at very top
  doc.setFillColor(...brand);
  doc.rect(0, 0, pageWidth, 6, "F");

  y = 60;
  // Logo text
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...brand);
  doc.text("AI STARTUP IDEA VALIDATOR", margin, y);

  // Date top-right
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...muted);
  doc.text(formatDate(createdAt), pageWidth - margin, y, { align: "right" });

  y += 32;
  // Title
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...dark);
  doc.text("Startup Idea", margin, y);
  y += 32;
  doc.text("Validation Report", margin, y);

  y += 40;
  drawDivider();

  // --- EXECUTIVE SUMMARY BOX ---
  const ideaSummary = ideaText.trim()
    ? ideaText
    : safeText(report.ideaSummary, "Idea summary pending.");
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const summaryLines = doc.splitTextToSize(ideaSummary, contentWidth - 32);
  const summaryBoxH = summaryLines.length * 16 + 40;

  doc.setFillColor(...bgLight);
  doc.roundedRect(margin, y, contentWidth, summaryBoxH, 8, 8, "F");
  doc.setDrawColor(...brand);
  doc.setLineWidth(3);
  doc.line(margin, y, margin, y + summaryBoxH); // Left accent bar

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...brand);
  doc.text("IDEA OVERVIEW", margin + 16, y + 18);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...dark);
  doc.text(summaryLines, margin + 16, y + 36);
  y += summaryBoxH + 36;

  // --- SCORE SECTION ---
  ensureSpace(90);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...muted);
  doc.text("MARKET OPPORTUNITY SCORE", margin, y);
  y += 20;

  // Score box
  const scoreBoxW = 120;
  const scoreBoxH = 52;
  doc.setFillColor(...scoreColor);
  doc.roundedRect(margin, y, scoreBoxW, scoreBoxH, 8, 8, "F");
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...white);
  doc.text(`${score}`, margin + 16, y + 34);
  doc.setFontSize(12);
  doc.text("/ 100", margin + 62, y + 34);

  // Score label
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...scoreColor);
  doc.text(scoreLabel, margin + scoreBoxW + 20, y + 22);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...body);
  const justLines = doc.splitTextToSize(
    safeText(report.marketDemandJustification, "Demand analysis pending."),
    contentWidth - scoreBoxW - 40,
  );
  doc.text(justLines.slice(0, 3), margin + scoreBoxW + 20, y + 38);
  y += scoreBoxH + 24;
  drawDivider();

  // --- VALUE PROPOSITION ---
  ensureSpace(70);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...muted);
  doc.text("VALUE PROPOSITION", margin, y);
  y += 24;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...body);
  const vpLines = doc.splitTextToSize(
    safeText(report.valueProposition, "Value proposition pending."),
    contentWidth,
  );
  doc.text(vpLines, margin, y);
  y += vpLines.length * 15 + 16;

  // --- DIFFERENTIATION ---
  ensureSpace(60);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...muted);
  doc.text("KEY DIFFERENTIATOR", margin, y);
  y += 24;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...body);
  const diffLines = doc.splitTextToSize(
    safeText(report.differentiation, "Differentiation story pending."),
    contentWidth,
  );
  doc.text(diffLines, margin, y);
  y += diffLines.length * 15 + 16;
  drawDivider();

  // --- TARGET AUDIENCE TABLE ---
  ensureSpace(120);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...muted);
  doc.text("TARGET AUDIENCE", margin, y);
  y += 16;

  const persons = report.targetAudience ?? {
    role: "—",
    ageRange: "—",
    painPoint: "—",
    buyingPower: "—",
  };
  const personaRows: [string, string][] = [
    ["Role", persons.role],
    ["Age Range", persons.ageRange],
    ["Primary Pain Point", persons.painPoint],
    ["Buying Power", persons.buyingPower],
  ];

  drawTable(personaRows, [140, contentWidth - 140]);
  y += 12;
  drawDivider();

  // --- COMPETITOR TABLE ---
  ensureSpace(80);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...muted);
  doc.text("COMPETITIVE LANDSCAPE", margin, y);
  y += 16;

  const competitors = report.competitors?.length
    ? report.competitors.slice(0, 6)
    : [{ name: "—", description: "Competitive research in progress." }];

  // Table header
  const compColWidths = [160, contentWidth - 160];
  drawTableHeader(["Competitor", "Description"], compColWidths);
  competitors.forEach((comp) => {
    drawTableRow([comp.name, comp.description], compColWidths);
  });
  y += 12;
  drawDivider();

  // --- MONETIZATION TABLE ---
  ensureSpace(80);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...muted);
  doc.text("MONETIZATION STRATEGY", margin, y);
  y += 16;

  const monetization = report.monetizationSuggestions?.length
    ? report.monetizationSuggestions.slice(0, 5)
    : [
        {
          model: "Subscription",
          fit: "Recurring delivery",
          reason: "Steady revenue",
        },
      ];

  const monColWidths = [120, 140, contentWidth - 260];
  drawTableHeader(["Model", "Fit", "Rationale"], monColWidths);
  monetization.forEach((m) => {
    drawTableRow([m.model, m.fit, m.reason], monColWidths);
  });
  y += 12;
  drawDivider();

  // --- STRENGTHS & WEAKNESSES side by side ---
  ensureSpace(120);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...muted);
  doc.text("STRENGTHS & WEAKNESSES", margin, y);
  y += 24;

  const strengths = report.strengths?.length
    ? report.strengths.slice(0, 6)
    : ["—"];
  const weaknesses = report.weaknesses?.length
    ? report.weaknesses.slice(0, 6)
    : ["—"];

  const colW = Math.round((contentWidth - 24) / 2);
  const leftX = margin;
  const rightX = margin + colW + 24;
  const startY = y;

  // Strengths column
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(leftX, y, colW, 24, 4, 4, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...green);
  doc.text("STRENGTHS", leftX + 10, y + 16);

  // Weaknesses column
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(rightX, y, colW, 24, 4, 4, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...red);
  doc.text("WEAKNESSES", rightX + 10, y + 16);
  y += 40;

  let leftY = y;
  let rightY = y;

  strengths.forEach((s) => {
    ensureSpace(20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...body);
    const lines = doc.splitTextToSize(`•  ${s}`, colW - 16);
    doc.text(lines, leftX + 8, leftY);
    leftY += lines.length * 14 + 4;
  });

  weaknesses.forEach((w) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...body);
    const lines = doc.splitTextToSize(`•  ${w}`, colW - 16);
    doc.text(lines, rightX + 8, rightY);
    rightY += lines.length * 14 + 4;
  });

  y = Math.max(leftY, rightY) + 12;
  drawDivider();

  // --- RISKS ---
  ensureSpace(60);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...muted);
  doc.text("KEY RISKS", margin, y);
  y += 24;

  const risks = report.risks?.length ? report.risks.slice(0, 5) : ["—"];
  risks.forEach((risk, i) => {
    ensureSpace(24);
    doc.setFillColor(254, 249, 235);
    doc.roundedRect(margin, y - 10, contentWidth, 22, 4, 4, "F");
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...body);
    doc.text(`${i + 1}.  ${risk}`, margin + 10, y + 4);
    y += 26;
  });
  y += 8;
  drawDivider();

  // --- GO-TO-MARKET PLAN ---
  ensureSpace(60);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...muted);
  doc.text("GO-TO-MARKET PLAN", margin, y);
  y += 24;

  const gtmSteps = report.goToMarketPlan?.length
    ? report.goToMarketPlan.slice(0, 6)
    : ["—"];
  gtmSteps.forEach((step, i) => {
    ensureSpace(30);
    // Step number circle
    doc.setFillColor(...brand);
    doc.circle(margin + 10, y - 2, 8, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...white);
    doc.text(`${i + 1}`, margin + 10, y + 1, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...body);
    const lines = doc.splitTextToSize(step, contentWidth - 36);
    doc.text(lines, margin + 26, y);
    y += lines.length * 14 + 10;
  });
  y += 4;
  drawDivider();

  // --- PIVOT RECOMMENDATIONS ---
  ensureSpace(60);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...muted);
  doc.text("PIVOT RECOMMENDATIONS", margin, y);
  y += 24;

  const pivots = report.pivotRecommendations?.length
    ? report.pivotRecommendations.slice(0, 5)
    : ["—"];
  drawBulletList(pivots);
  y += 8;
  drawDivider();

  // --- NEXT 30-DAY ACTION PLAN ---
  ensureSpace(60);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...muted);
  doc.text("NEXT 30-DAY ACTION PLAN", margin, y);
  y += 24;

  const nextSteps = report.nextSteps?.length
    ? report.nextSteps.slice(0, 6)
    : ["—"];
  nextSteps.forEach((step) => {
    ensureSpace(24);
    // Checkbox
    doc.setDrawColor(...light);
    doc.setLineWidth(1);
    doc.roundedRect(margin + 2, y - 9, 12, 12, 2, 2, "S");
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...body);
    const lines = doc.splitTextToSize(step, contentWidth - 28);
    doc.text(lines, margin + 22, y);
    y += lines.length * 14 + 8;
  });

  // --- FINAL FOOTER ON LAST PAGE ---
  // Confidentiality note
  y += 16;
  ensureSpace(40);
  doc.setDrawColor(...light);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 14;
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...muted);
  doc.text(
    "This report was generated by AI Startup Idea Validator using AI-powered market analysis. Data is indicative and should be validated with primary research.",
    margin,
    y,
    { maxWidth: contentWidth },
  );

  // Add footer to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    currentPage = i;
    addFooter();
    // Brand bar at top of every page
    doc.setFillColor(...brand);
    doc.rect(0, 0, pageWidth, 6, "F");
  }

  doc.save("validation-report.pdf");

  // ========== TABLE HELPERS ==========

  function drawTableHeader(headers: string[], colWidths: number[]) {
    ensureSpace(28);
    doc.setFillColor(...brand);
    let x = margin;
    const rowH = 22;
    colWidths.forEach((w) => {
      doc.rect(x, y, w, rowH, "F");
      x += w;
    });
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...white);
    x = margin;
    headers.forEach((h, i) => {
      doc.text(h, x + 8, y + 15);
      x += colWidths[i];
    });
    y += rowH;
  }

  function drawTableRow(cells: string[], colWidths: number[]) {
    // Calculate row height based on text wrapping
    let maxLines = 1;
    const cellLines: string[][] = cells.map((cell, i) => {
      doc.setFontSize(9);
      const lines = doc.splitTextToSize(cell || "—", colWidths[i] - 16);
      if (lines.length > maxLines) maxLines = lines.length;
      return lines;
    });
    const rowH = maxLines * 13 + 10;
    ensureSpace(rowH);

    // Alternate row bg
    doc.setFillColor(...bgLight);
    doc.rect(margin, y, contentWidth, rowH, "F");

    // Cell borders
    doc.setDrawColor(...light);
    doc.setLineWidth(0.5);
    doc.line(margin, y + rowH, pageWidth - margin, y + rowH);

    let x = margin;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...body);
    cellLines.forEach((lines, i) => {
      if (i === 0) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...dark);
      } else {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...body);
      }
      doc.text(lines, x + 8, y + 14);
      x += colWidths[i];
    });
    y += rowH;
  }

  function drawTable(rows: [string, string][], colWidths: number[]) {
    rows.forEach(([label, value]) => {
      const valLines = doc.splitTextToSize(value || "—", colWidths[1] - 16);
      const rowH = Math.max(valLines.length * 13, 13) + 12;
      ensureSpace(rowH);

      doc.setDrawColor(...light);
      doc.setLineWidth(0.5);
      doc.line(margin, y + rowH, pageWidth - margin, y + rowH);

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...muted);
      doc.text(label, margin + 8, y + 14);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(...dark);
      doc.text(valLines, margin + colWidths[0] + 8, y + 14);
      y += rowH;
    });
  }

  function drawBulletList(items: string[]) {
    items.forEach((item) => {
      ensureSpace(20);
      doc.setFillColor(...brand);
      doc.circle(margin + 6, y - 2, 3, "F");
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...body);
      const lines = doc.splitTextToSize(item, contentWidth - 24);
      doc.text(lines, margin + 18, y);
      y += lines.length * 14 + 6;
    });
  }
}
