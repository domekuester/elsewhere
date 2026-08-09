# ELSEWHERE Apple Photos metadata reader

This local macOS helper uses Apple's supported PhotoKit APIs to enumerate image
asset metadata and match requested original filenames. It does not request image
data, export assets, or use any PhotoKit mutation API.

PhotoKit calls the enumeration permission `.readWrite`; Apple does not provide a
separate full-library read-only authorization level. The utility itself remains
read-only by construction: it uses `PHAsset.fetchAssets` and
`PHAssetResource.assetResources(for:)` only.

Exact coordinates and Photos local identifiers in its output are private,
internal metadata and must not be published.
