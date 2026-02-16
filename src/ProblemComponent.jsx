import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ProblemComponent = () => {
  const [selectedDeficiency, setSelectedDeficiency] = useState(null);
  const leftPanelRef = useRef(null); // The ref is only on the left panel (the list)

  const deficiencies = [
    { id: 1, title: 'Wall Plate Alignment', description: 'Check that wall plates are properly aligned' },
    { id: 2, title: 'Stud Spacing', description: 'Verify studs are spaced correctly (16" or 24" OC)' },
    { id: 3, title: 'Bracing Installation', description: 'Check that bracing is properly installed' },
  ];

  const handleDownloadPdf = async () => {
    // Problem: The ref is only targeting the left panel
    const element = leftPanelRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('report_problem.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'row' }}>
      {/* Left Panel - Ref is here */}
      <div
        ref={leftPanelRef}
        style={{ width: '50%', borderRight: '1px solid #ccc', padding: '20px', overflowY: 'auto' }}
      >
        <h2>Deficiencies</h2>
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
                borderRadius: '4px'
              }}
            >
              <strong>{def.title}</strong>
              <div style={{ color: 'red', fontWeight: 'bold' }}>FAILED</div>
            </li>
          ))}
        </ul>
        <button
          onClick={handleDownloadPdf}
          style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Download PDF
        </button>
      </div>

      {/* Right Panel - Outside the ref */}
      <div style={{ width: '50%', padding: '20px', backgroundColor: '#f9f9f9', overflowY: 'auto' }}>
        {selectedDeficiency ? (
          <div>
            <h2>Description</h2>
            <h3>{selectedDeficiency.title}</h3>
            <p>{selectedDeficiency.description}</p>
            <div style={{ color: 'red', fontWeight: 'bold' }}>FAILED</div>
            <p>inspector signature line here...</p>
          </div>
        ) : (
          <p>Select a deficiency to view details.</p>
        )}
      </div>
    </div>
  );
};

export default ProblemComponent;
