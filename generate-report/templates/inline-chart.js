#!/usr/bin/env node
// inline-chart.js — final assembly step for a generated report.
// Replaces the literal placeholder CHART_JS_INLINE (wrapped in JS block-comment
// delimiters) inside a report HTML file with the contents of chart.umd.min.js
// (the Chart.js library), so the report is self-contained and renders inside an
// iframe loaded via srcdoc.
//
// Usage:
//   node generate-report/templates/inline-chart.js <report.html>
//
// Run this ONLY as the very last step, after the report HTML has been fully
// written and all chart cards assembled. It edits the file in place.
const fs = require('fs');
const path = require('path');

const report = process.argv[2];
if (!report) {
  console.error('Usage: node inline-chart.js <report.html>');
  process.exit(1);
}
if (!fs.existsSync(report)) {
  console.error('Report not found: ' + report);
  process.exit(1);
}

const MARKER = '/*__CHART_JS_INLINE__*/';
let body = fs.readFileSync(report, 'utf8');
const occurrences = body.split(MARKER).length - 1;
if (occurrences === 0) {
  console.error('Placeholder token not found in ' + report +
    '. (Already inlined, or base.html was edited?)');
  process.exit(1);
}
if (occurrences > 1) {
  console.error('Placeholder token appears ' + occurrences + ' times in ' + report +
    '. Expected exactly 1. Report base.html is corrupt.');
  process.exit(1);
}

const libPath = path.join(__dirname, 'chart.umd.min.js');
if (!fs.existsSync(libPath)) {
  console.error('Chart.js library not found at: ' + libPath);
  process.exit(1);
}
const lib = fs.readFileSync(libPath, 'utf8');
if (lib.includes('</script')) {
  console.error('ABORT: chart.umd.min.js contains </script> — would break the page.');
  process.exit(1);
}

body = body.replace(MARKER, lib);
fs.writeFileSync(report, body);
console.log('Inlined Chart.js (' + lib.length + ' bytes) into ' + report);
