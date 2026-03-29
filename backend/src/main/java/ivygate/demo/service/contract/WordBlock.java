package ivygate.demo.service.contract;

import java.util.List;

import software.amazon.awssdk.services.textract.model.Block;
import software.amazon.awssdk.services.textract.model.SelectionStatus;
import software.amazon.awssdk.services.textract.model.TextType;

public record WordBlock(
        String id,
        String blockType,
        String text,
        Integer page,
        Float confidence,
        BoundingBox boundingBox,
        List<PolygonPoint> polygon,
        List<BlockRelationship> relationships,
        List<String> entityTypes,
        String selectionStatus,
        String textType,
        Integer rowIndex,
        Integer columnIndex,
        Integer rowSpan,
        Integer columnSpan
) {

    public static WordBlock fromBlock(Block block) {
        BoundingBox bb = null;
        List<PolygonPoint> polygon = List.of();

        if (block.geometry() != null) {
            var sdkBb = block.geometry().boundingBox();
            if (sdkBb != null) {
                bb = new BoundingBox(sdkBb.left(), sdkBb.top(), sdkBb.width(), sdkBb.height());
            }
            if (block.geometry().polygon() != null) {
                polygon = block.geometry().polygon().stream()
                        .map(p -> new PolygonPoint(p.x(), p.y()))
                        .toList();
            }
        }

        List<BlockRelationship> relationships = List.of();
        if (block.hasRelationships()) {
            relationships = block.relationships().stream()
                    .map(r -> new BlockRelationship(
                            r.typeAsString(),
                            r.ids() != null ? r.ids() : List.of()))
                    .toList();
        }

        List<String> entityTypes = List.of();
        if (block.hasEntityTypes()) {
            entityTypes = block.entityTypes().stream()
                    .map(Enum::name)
                    .toList();
        }

        SelectionStatus ss = block.selectionStatus();
        String selectionStatus = (ss != null && ss != SelectionStatus.UNKNOWN_TO_SDK_VERSION)
                ? ss.name() : null;

        TextType tt = block.textType();
        String textType = (tt != null && tt != TextType.UNKNOWN_TO_SDK_VERSION)
                ? tt.name() : null;

        return new WordBlock(
                block.id(),
                block.blockTypeAsString(),
                block.text(),
                block.page(),
                block.confidence(),
                bb,
                polygon,
                relationships,
                entityTypes,
                selectionStatus,
                textType,
                block.rowIndex(),
                block.columnIndex(),
                block.rowSpan(),
                block.columnSpan()
        );
    }

    /** Absolute pixel coordinates given page dimensions. Null if no bounding box. */
    public AbsoluteBounds toAbsolute(int pageWidth, int pageHeight) {
        if (boundingBox == null) return null;
        return new AbsoluteBounds(
                Math.round(boundingBox.left() * pageWidth),
                Math.round(boundingBox.top() * pageHeight),
                Math.round(boundingBox.width() * pageWidth),
                Math.round(boundingBox.height() * pageHeight)
        );
    }

    public record BoundingBox(float left, float top, float width, float height) {}
    public record PolygonPoint(float x, float y) {}
    public record BlockRelationship(String type, List<String> ids) {}
    public record AbsoluteBounds(int left, int top, int width, int height) {}
}
