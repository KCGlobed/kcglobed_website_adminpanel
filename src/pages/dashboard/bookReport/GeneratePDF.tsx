import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateOrderPDF = (order: any) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    // Title
    doc.setFontSize(16);
    doc.text(`Order Details - #${order.orderID}`, 40, 40);

    // Basic Info Table
    const basicInfo = [
        ["First Name", order.first_name],
        ["Last Name", order.last_name],
        ["Email", order.email],
        ["Mobile", order.mobile],
        ["Address", order.address],
        ["City", order.city],
        ["Postal Code", order.postal_code],
        ["Country", order.country],
        ["Payment Method", order.payment_method],
        ["Status", order.payment_status],
        ["Amount", `₹${order.amount}`],
        ["Tax", `₹${order.tax_amount}`],
        ["Total", `₹${order.total_amount}`],
        ["Order Date", new Date(order.order_date).toLocaleString()],
    ];

    autoTable(doc, {
        startY: 60,
        head: [["Field", "Value"]],
        body: basicInfo,
        theme: "grid",
        styles: { fontSize: 10 },
    });

    let currentY = doc.lastAutoTable.finalY + 20;

    // Ordered Books
    if (order.ordered_books && order.ordered_books.length > 0) {
        doc.setFontSize(14);
        doc.text("Ordered Books", 40, currentY);
        currentY += 10;

        order.ordered_books.forEach((book: any, index: number) => {
            currentY += 20;
            doc.setFontSize(12);
            doc.text(`${index + 1}. ${book.name} (${book.subject_name})`, 50, currentY);
            doc.setFontSize(10);
            doc.text(`Price: ₹${book.total_price} • Language: ${book.language}`, 60, currentY + 15);
            doc.text(`Publisher: ${book.publisher}`, 60, currentY + 30);
            currentY += 30;
        });
    }

    doc.save(`Order_${order.orderID}.pdf`);
};
