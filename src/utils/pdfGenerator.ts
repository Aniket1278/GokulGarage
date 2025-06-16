import jsPDF from 'jspdf';
import { Bill } from '../types';

export const generateBillPDF = (bill: Bill): void => {
  const doc = new jsPDF();
  
  // Header with border
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(10, 10, 190, 40); // Header border
  
  // Garage name and location
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('GOKUL MOTOR GARAGE', 105, 25, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('AMALNER', 105, 35, { align: 'center' });
  
  // Contact number below garage name
  doc.setFontSize(12);
  doc.text('Contact: 9370071035', 105, 45, { align: 'center' });
  
  // Horizontal line after header
  doc.setLineWidth(1);
  doc.line(10, 55, 200, 55);
  
  // Bill details section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL DETAILS', 20, 70);
  
  // Bill info box
  doc.setLineWidth(0.3);
  doc.rect(15, 75, 170, 25);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Bill No: ${bill.id.slice(-8).toUpperCase()}`, 20, 85);
  doc.text(`Date: ${new Date(bill.createdAt).toLocaleDateString('en-IN')}`, 20, 95);
  doc.text(`Time: ${new Date(bill.createdAt).toLocaleTimeString('en-IN')}`, 120, 85);
  
  // Customer details section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('CUSTOMER DETAILS', 20, 115);
  
  // Customer info box
  doc.rect(15, 120, 170, 35);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${bill.customerName}`, 20, 130);
  doc.text(`Phone: ${bill.customerPhone}`, 20, 140);
  doc.text(`Car Number: ${bill.carNumber}`, 120, 130);
  doc.text(`Car KM: ${bill.carKm.toLocaleString()}`, 120, 140);
  
  // Services section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SERVICES & PRODUCTS', 20, 170);
  
  // Table header with background
  doc.setFillColor(240, 240, 240);
  doc.rect(15, 175, 170, 10, 'F');
  doc.rect(15, 175, 170, 10);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Description', 20, 182);
  doc.text('Qty', 120, 182);
  doc.text('Rate', 140, 182);
  doc.text('Amount', 165, 182);
  
  // Vertical lines for table
  doc.line(115, 175, 115, 185 + (bill.items.length * 10));
  doc.line(135, 175, 135, 185 + (bill.items.length * 10));
  doc.line(160, 175, 160, 185 + (bill.items.length * 10));
  
  // Table content
  doc.setFont('helvetica', 'normal');
  let yPos = 192;
  bill.items.forEach((item, index) => {
    // Alternate row background
    if (index % 2 === 1) {
      doc.setFillColor(250, 250, 250);
      doc.rect(15, yPos - 7, 170, 10, 'F');
    }
    
    doc.text(item.name, 20, yPos);
    doc.text(item.quantity.toString(), 125, yPos, { align: 'center' });
    doc.text(`₹${item.price.toFixed(2)}`, 147, yPos, { align: 'center' });
    doc.text(`₹${item.total.toFixed(2)}`, 175, yPos, { align: 'right' });
    yPos += 10;
  });
  
  // Table border
  doc.rect(15, 175, 170, 10 + (bill.items.length * 10));
  
  // Totals section
  const totalsY = yPos + 10;
  doc.setLineWidth(0.5);
  doc.line(120, totalsY, 185, totalsY);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', 130, totalsY + 10);
  doc.text(`₹${bill.subtotal.toFixed(2)}`, 175, totalsY + 10, { align: 'right' });
  
  doc.text('GST (18%):', 130, totalsY + 20);
  doc.text(`₹${bill.tax.toFixed(2)}`, 175, totalsY + 20, { align: 'right' });
  
  // Total with highlight
  doc.setLineWidth(1);
  doc.line(120, totalsY + 25, 185, totalsY + 25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL:', 130, totalsY + 35);
  doc.text(`₹${bill.total.toFixed(2)}`, 175, totalsY + 35, { align: 'right' });
  doc.line(120, totalsY + 40, 185, totalsY + 40);
  
  // Footer section
  const footerY = 270;
  doc.setLineWidth(1);
  doc.line(10, footerY, 200, footerY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for choosing Gokul Motor Garage!', 105, footerY + 10, { align: 'center' });
  doc.text('For any queries, please contact: 9370071035', 105, footerY + 20, { align: 'center' });
  
  // Save the PDF
  doc.save(`Gokul-Motor-Garage-Bill-${bill.id.slice(-8).toUpperCase()}.pdf`);
};

export const generateMonthlyReport = (bills: Bill[], month: string, year: number): void => {
  const doc = new jsPDF();
  
  // Header with border
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(10, 10, 190, 40);
  
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('GOKUL MOTOR GARAGE', 105, 25, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('AMALNER', 105, 35, { align: 'center' });
  doc.text('Contact: 9370071035', 105, 45, { align: 'center' });
  
  // Report title
  doc.setLineWidth(1);
  doc.line(10, 55, 200, 55);
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('MONTHLY REPORT', 105, 70, { align: 'center' });
  
  doc.setFontSize(16);
  doc.text(`${month} ${year}`, 105, 80, { align: 'center' });
  
  // Summary section
  const totalRevenue = bills.reduce((sum, bill) => sum + bill.total, 0);
  const totalBills = bills.length;
  const avgBill = totalBills > 0 ? totalRevenue / totalBills : 0;
  
  // Summary box
  doc.setLineWidth(0.3);
  doc.rect(15, 90, 170, 40);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('SUMMARY', 20, 105);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Bills Generated: ${totalBills}`, 20, 115);
  doc.text(`Total Revenue: ₹${totalRevenue.toLocaleString('en-IN')}`, 20, 125);
  doc.text(`Average Bill Amount: ₹${avgBill.toFixed(2)}`, 120, 115);
  doc.text(`Report Generated: ${new Date().toLocaleDateString('en-IN')}`, 120, 125);
  
  // Bills details
  if (bills.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL DETAILS', 20, 150);
    
    // Table header
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 155, 170, 10, 'F');
    doc.rect(15, 155, 170, 10);
    
    doc.setFontSize(9);
    doc.text('Date', 20, 162);
    doc.text('Customer', 50, 162);
    doc.text('Car No.', 100, 162);
    doc.text('Amount', 160, 162);
    
    // Table content
    doc.setFont('helvetica', 'normal');
    let yPos = 172;
    
    bills.forEach((bill, index) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      if (index % 2 === 1) {
        doc.setFillColor(250, 250, 250);
        doc.rect(15, yPos - 7, 170, 10, 'F');
      }
      
      doc.text(new Date(bill.createdAt).toLocaleDateString('en-IN'), 20, yPos);
      doc.text(bill.customerName.substring(0, 15), 50, yPos);
      doc.text(bill.carNumber, 100, yPos);
      doc.text(`₹${bill.total.toFixed(2)}`, 175, yPos, { align: 'right' });
      yPos += 10;
    });
    
    // Table border
    doc.rect(15, 155, 170, 10 + (bills.length * 10));
  }
  
  // Footer
  const footerY = 270;
  doc.setLineWidth(1);
  doc.line(10, footerY, 200, footerY);
  doc.setFontSize(10);
  doc.text('Generated by Gokul Motor Garage Management System', 105, footerY + 10, { align: 'center' });
  
  doc.save(`Gokul-Motor-Garage-Report-${month}-${year}.pdf`);
};