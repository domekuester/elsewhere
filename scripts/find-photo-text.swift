import Foundation
import ImageIO
import Vision

let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let inventoryURL = root.appendingPathComponent("docs/photo-inventory.json")
let data = try Data(contentsOf: inventoryURL)
let object = try JSONSerialization.jsonObject(with: data) as! [String: Any]
let photos = object["photos"] as! [[String: Any]]
let needles = ["SHAWARMA", "YUMMY", "FAST &", "FAST AND"]

for (index, photo) in photos.enumerated() {
    guard let sourcePath = photo["sourcePath"] as? String,
          let filename = photo["filename"] as? String else { continue }
    let url = root.appendingPathComponent(sourcePath) as CFURL
    guard let source = CGImageSourceCreateWithURL(url, nil),
          let image = CGImageSourceCreateThumbnailAtIndex(source, 0, [
            kCGImageSourceCreateThumbnailFromImageAlways: true,
            kCGImageSourceThumbnailMaxPixelSize: 1800,
            kCGImageSourceCreateThumbnailWithTransform: true
          ] as CFDictionary) else { continue }

    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.recognitionLanguages = ["en-US"]
    request.usesLanguageCorrection = true
    try? VNImageRequestHandler(cgImage: image).perform([request])
    let text = (request.results ?? []).compactMap { $0.topCandidates(1).first?.string }.joined(separator: " | ")
    let upper = text.uppercased()
    if needles.contains(where: upper.contains) {
        print("\(photo["id"] ?? "")\t\(filename)\t\(text)")
    }
    if (index + 1) % 50 == 0 {
        FileHandle.standardError.write(Data("Reviewed \(index + 1)/\(photos.count)\n".utf8))
    }
}
