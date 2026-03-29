import UIKit

struct PDFGenerator {
    static func generatePDF(from images: [UIImage]) -> Data? {
        guard !images.isEmpty else { return nil }
        
        let pdfData = NSMutableData()
        
        // We use the first image's bounds to start the PDF Context
        UIGraphicsBeginPDFContextToData(pdfData, CGRect.zero, nil)
        
        for image in images {
            // Draw each image on a new PDF page matching its original dimensions to preserve quality
            let pageRect = CGRect(x: 0, y: 0, width: image.size.width, height: image.size.height)
            UIGraphicsBeginPDFPageWithInfo(pageRect, nil)
            image.draw(in: pageRect)
        }
        
        UIGraphicsEndPDFContext()
        
        return pdfData as Data
    }
}
