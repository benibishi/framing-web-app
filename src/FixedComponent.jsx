import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const FixedComponent = () => {
  const [selectedDeficiency, setSelectedDeficiency] = useState(null);
  const reportRef = useRef(null); // The ref is now on the wrapper container

  const deficiencies = [
    { id: 1, title: 'Wall Plate Alignment', description: 'Check that wall plates are properly aligned' },
    { id: 2, title: 'Stud Spacing', description: 'Verify studs are spaced correctly (16" or 24" OC)' },
    { id: 3, title: 'Bracing Installation', description: 'Check that bracing is properly installed' },
  ];

  const handleDownloadPdf = async () => {
    // Fix: The ref targets the wrapper container that includes both panels
    const element = reportRef.current;
    if (!element) return;

    try {
      // Use html2canvas options to ensure better capture
      const canvas = await html2canvas(element, {
        scale: 2, // Improve quality
        useCORS: true, // Handle cross-origin images if any
        logging: true,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape', // Better for two-column layouts
        unit: 'px',
        format: [canvas.width, canvas.height] // Match canvas size for high fidelity, or use standard A4
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('report_fixed.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <button
        onClick={handleDownloadPdf}
        style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Download PDF (Fixed)
      </button>

      {/* Wrapper Container - Ref is here */}
      <div
        ref={reportRef}
        style={{
          display: 'flex',
          flexDirection: 'row',
          border: '1px solid #ccc',
          minHeight: '600px', // Ensure height for PDF
          backgroundColor: '#fff' // White background for PDF
        }}
      >
        {/* Left Panel */}
        <div style={{ width: '50%', borderRight: '1px solid #ccc', padding: '20px' }}>
          <h2>Deficiencies Report</h2>
          <p>Job Address: Not provided</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {deficiencies.map(def => (
              <li
                key={def.id}
                onClick={() => setSelectedDeficiency(def)}
                style={{
                  cursor: 'pointer',
                  marginBottom: '15px',
                  padding: '10px',
                  border: selectedDeficiency?.id === def.id ? '2px solid #007bff' : '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: selectedDeficiency?.id === def.id ? '#e7f1ff' : 'transparent'
                }}
              >
                <strong>{def.title}</strong>
                <div style={{ color: 'red', fontWeight: 'bold' }}>FAILED</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Panel - Inside the ref */}
        <div style={{ width: '50%', padding: '20px', backgroundColor: '#f9f9f9' }}>
          {selectedDeficiency ? (
            <div>
              <h2>Description</h2>
              <h3>{selectedDeficiency.title}</h3>
              <p>{selectedDeficiency.description}</p>
              <div style={{ color: 'red', fontWeight: 'bold' }}>FAILED</div>
              <div style={{ marginTop: '50px', borderTop: '1px solid #000', width: '200px', paddingTop: '5px' }}>
                Inspector Signature
              </div>
            </div>
          ) : (
            <div style={{ color: '#666', fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              Select a deficiency to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FixedComponent;
