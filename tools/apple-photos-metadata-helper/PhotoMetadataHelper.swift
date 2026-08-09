import Foundation
import Photos

private struct ResourceRecord: Codable {
    let originalFilename: String
    let resourceType: Int
    let resourceTypeName: String
    let uniformTypeIdentifier: String
}

private struct AssetRecord: Codable {
    let localIdentifier: String
    let creationDate: String?
    let pixelWidth: Int
    let pixelHeight: Int
    let latitude: Double?
    let longitude: Double?
    let horizontalAccuracy: Double?
    let altitude: Double?
    let resources: [ResourceRecord]
}

private struct OutputRecord: Codable {
    let schemaVersion: Int
    let generatedAt: String
    let authorizationStatus: String
    let requestedFilenameCount: Int
    let photosAssetsScanned: Int
    let matchingAssets: [AssetRecord]
}

private struct Arguments {
    let inputPath: String?
    let filenames: [String]
    let outputPath: String
}

private enum HelperError: Error, CustomStringConvertible {
    case usage(String)
    case accessDenied(String)

    var description: String {
        switch self {
        case .usage(let message), .accessDenied(let message): return message
        }
    }
}

private func parseArguments() throws -> Arguments {
    var inputPath: String?
    var filenames: [String] = []
    var outputPath: String?
    var index = 1
    let args = CommandLine.arguments

    while index < args.count {
        switch args[index] {
        case "--input":
            index += 1
            guard index < args.count else { throw HelperError.usage("--input requires a path") }
            inputPath = args[index]
        case "--filename":
            index += 1
            guard index < args.count else { throw HelperError.usage("--filename requires a value") }
            filenames.append(args[index])
        case "--output":
            index += 1
            guard index < args.count else { throw HelperError.usage("--output requires a path") }
            outputPath = args[index]
        default:
            throw HelperError.usage("Unknown argument: \(args[index])")
        }
        index += 1
    }

    guard let outputPath else {
        throw HelperError.usage("Usage: PhotoMetadataHelper (--filename NAME | --input filenames.json) --output result.json")
    }
    guard inputPath != nil || !filenames.isEmpty else {
        throw HelperError.usage("At least one --filename or an --input JSON file is required")
    }
    return Arguments(inputPath: inputPath, filenames: filenames, outputPath: outputPath)
}

private func normalizedFilename(_ filename: String) -> String {
    let name = URL(fileURLWithPath: filename).lastPathComponent.precomposedStringWithCanonicalMapping
    let url = URL(fileURLWithPath: name)
    let stem = url.deletingPathExtension().lastPathComponent.lowercased()
    var ext = url.pathExtension.lowercased()
    if ext == "jpeg" { ext = "jpg" }
    return ext.isEmpty ? stem : "\(stem).\(ext)"
}

private func authorizationName(_ status: PHAuthorizationStatus) -> String {
    switch status {
    case .notDetermined: return "NOT_DETERMINED"
    case .restricted: return "RESTRICTED"
    case .denied: return "DENIED"
    case .authorized: return "AUTHORIZED"
    case .limited: return "LIMITED"
    @unknown default: return "UNKNOWN"
    }
}

private func resourceTypeName(_ type: PHAssetResourceType) -> String {
    switch type {
    case .photo: return "PHOTO"
    case .video: return "VIDEO"
    case .audio: return "AUDIO"
    case .alternatePhoto: return "ALTERNATE_PHOTO"
    case .fullSizePhoto: return "FULL_SIZE_PHOTO"
    case .fullSizeVideo: return "FULL_SIZE_VIDEO"
    case .adjustmentData: return "ADJUSTMENT_DATA"
    case .adjustmentBasePhoto: return "ADJUSTMENT_BASE_PHOTO"
    case .pairedVideo: return "PAIRED_VIDEO"
    case .adjustmentBasePairedVideo: return "ADJUSTMENT_BASE_PAIRED_VIDEO"
    case .adjustmentBaseVideo: return "ADJUSTMENT_BASE_VIDEO"
    case .photoProxy: return "PHOTO_PROXY"
    @unknown default: return "UNKNOWN"
    }
}

private func loadRequestedFilenames(_ arguments: Arguments) throws -> [String] {
    var filenames = arguments.filenames
    if let inputPath = arguments.inputPath {
        let data = try Data(contentsOf: URL(fileURLWithPath: inputPath))
        filenames.append(contentsOf: try JSONDecoder().decode([String].self, from: data))
    }
    return Array(Set(filenames.map { URL(fileURLWithPath: $0).lastPathComponent })).sorted()
}

private func requestPhotoLibraryAccess() -> PHAuthorizationStatus {
    let current = PHPhotoLibrary.authorizationStatus(for: .readWrite)
    guard current == .notDetermined else { return current }

    let semaphore = DispatchSemaphore(value: 0)
    var result = current
    PHPhotoLibrary.requestAuthorization(for: .readWrite) { status in
        result = status
        semaphore.signal()
    }
    semaphore.wait()
    return result
}

private func scan(requestedFilenames: [String], status: PHAuthorizationStatus) throws -> OutputRecord {
    guard status == .authorized || status == .limited else {
        throw HelperError.accessDenied("Photos access is \(authorizationName(status)). Grant access in System Settings > Privacy & Security > Photos, then run the helper again.")
    }

    let wanted = Set(requestedFilenames.map(normalizedFilename))
    let fetchResult = PHAsset.fetchAssets(with: .image, options: nil)
    var matchingAssets: [AssetRecord] = []

    fetchResult.enumerateObjects { asset, _, _ in
        autoreleasepool {
            let resources = PHAssetResource.assetResources(for: asset)
            let matches = resources.filter { wanted.contains(normalizedFilename($0.originalFilename)) }
            guard !matches.isEmpty else { return }

            let location = asset.location
            matchingAssets.append(AssetRecord(
                localIdentifier: asset.localIdentifier,
                creationDate: asset.creationDate.map { ISO8601DateFormatter().string(from: $0) },
                pixelWidth: asset.pixelWidth,
                pixelHeight: asset.pixelHeight,
                latitude: location?.coordinate.latitude,
                longitude: location?.coordinate.longitude,
                horizontalAccuracy: location?.horizontalAccuracy,
                altitude: location?.altitude,
                resources: matches.map {
                    ResourceRecord(
                        originalFilename: $0.originalFilename,
                        resourceType: $0.type.rawValue,
                        resourceTypeName: resourceTypeName($0.type),
                        uniformTypeIdentifier: $0.uniformTypeIdentifier
                    )
                }
            ))
        }
    }

    matchingAssets.sort { $0.localIdentifier < $1.localIdentifier }
    return OutputRecord(
        schemaVersion: 1,
        generatedAt: ISO8601DateFormatter().string(from: Date()),
        authorizationStatus: authorizationName(status),
        requestedFilenameCount: requestedFilenames.count,
        photosAssetsScanned: fetchResult.count,
        matchingAssets: matchingAssets
    )
}

private func writeJSON<T: Encodable>(_ value: T, to path: String) throws {
    let encoder = JSONEncoder()
    encoder.outputFormatting = [.prettyPrinted, .sortedKeys, .withoutEscapingSlashes]
    let data = try encoder.encode(value)
    try data.write(to: URL(fileURLWithPath: path), options: .atomic)
}

do {
    let arguments = try parseArguments()
    let filenames = try loadRequestedFilenames(arguments)
    let status = requestPhotoLibraryAccess()
    let output = try scan(requestedFilenames: filenames, status: status)
    try writeJSON(output, to: arguments.outputPath)
    print("Scanned \(output.photosAssetsScanned) image assets; found \(output.matchingAssets.count) matching assets.")
} catch {
    FileHandle.standardError.write(Data("PhotoMetadataHelper: \(error)\n".utf8))
    exit(1)
}
