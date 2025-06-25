// Sample PDF URLs for testing
export const samplePDFs = {
  report: {
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    title: "Sample Report",
    description: "A sample business report with charts and data",
  },
  presentation: {
    url: "https://www.africau.edu/images/default/sample.pdf",
    title: "Sample Presentation",
    description: "A sample presentation with slides and graphics",
  },
  manual: {
    url: "https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf",
    title: "Sample Manual",
    description: "A sample user manual with instructions",
  },
};

// Create a mock PDF file for testing when no real PDFs are available
export const createMockPDFBlob = (): Blob => {
  // This is a minimal PDF structure for testing
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Hello, PDF Viewer!) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000120 00000 n 
0000000200 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
290
%%EOF`;

  return new Blob([pdfContent], { type: "application/pdf" });
};

// Mock PDF for development when external URLs are not accessible
export const getMockPDFFile = (): File => {
  const blob = createMockPDFBlob();
  return new File([blob], "sample-document.pdf", { type: "application/pdf" });
};
