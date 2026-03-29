package ivygate.demo.service.contract;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.textract.TextractClient;
import software.amazon.awssdk.services.textract.model.Block;
import software.amazon.awssdk.services.textract.model.BlockType;
import software.amazon.awssdk.services.textract.model.DocumentLocation;
import software.amazon.awssdk.services.textract.model.GetDocumentTextDetectionRequest;
import software.amazon.awssdk.services.textract.model.GetDocumentTextDetectionResponse;
import software.amazon.awssdk.services.textract.model.JobStatus;
import software.amazon.awssdk.services.textract.model.Relationship;
import software.amazon.awssdk.services.textract.model.RelationshipType;
import software.amazon.awssdk.services.textract.model.S3Object;
import software.amazon.awssdk.services.textract.model.StartDocumentTextDetectionRequest;

public class ContractParser implements AutoCloseable {

    private static final long POLL_INTERVAL_MS = 1_000;

    private final TextractClient textractClient;
    private final S3Client s3Client;
    private final String bucket;

    public ContractParser(TextractClient textractClient, S3Client s3Client, String bucket) {
        this.textractClient = textractClient;
        this.s3Client = s3Client;
        this.bucket = bucket;
    }

    /**
     * Uploads the PDF to S3 at the given key, runs async Textract text detection,
     * and returns words grouped into lines via Textract's LINE→WORD relationships.
     * The S3 object is NOT deleted — the caller is responsible for its lifecycle.
     *
     * @param inputStream raw PDF bytes
     * @param s3Key       full S3 key to upload to (caller controls naming)
     * @return lines of words in reading order
     */
    public List<List<WordBlock>> extractLines(InputStream inputStream, String s3Key) throws IOException {
        s3Client.putObject(
            PutObjectRequest.builder()
                .bucket(bucket)
                .key(s3Key)
                .contentType("application/pdf")
                .build(),
            RequestBody.fromBytes(inputStream.readAllBytes())
        );

        try {
            String jobId = textractClient.startDocumentTextDetection(
                StartDocumentTextDetectionRequest.builder()
                    .documentLocation(DocumentLocation.builder()
                        .s3Object(S3Object.builder().bucket(bucket).name(s3Key).build())
                        .build())
                    .build()
            ).jobId();

            return collectLines(jobId);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("Interrupted while waiting for Textract job", e);
        }
    }

    private List<List<WordBlock>> collectLines(String jobId) throws IOException, InterruptedException {
        Map<String, Block> blockMap = new HashMap<>();
        List<Block> lineBlocks = new ArrayList<>();
        String nextToken = null;

        while (true) {
            var reqBuilder = GetDocumentTextDetectionRequest.builder().jobId(jobId);
            if (nextToken != null) reqBuilder.nextToken(nextToken);

            GetDocumentTextDetectionResponse response =
                textractClient.getDocumentTextDetection(reqBuilder.build());
            JobStatus status = response.jobStatus();

            if (status == JobStatus.FAILED) {
                throw new IOException("Textract job failed: " + response.statusMessage());
            }

            if (status == JobStatus.IN_PROGRESS) {
                Thread.sleep(POLL_INTERVAL_MS);
                continue;
            }

            for (Block block : response.blocks()) {
                blockMap.put(block.id(), block);
                if (BlockType.LINE.equals(block.blockType())) {
                    lineBlocks.add(block);
                }
            }

            nextToken = response.nextToken();
            if (nextToken == null) break;
        }

        List<List<WordBlock>> lines = new ArrayList<>();
        for (Block lineBlock : lineBlocks) {
            List<WordBlock> wordsInLine = new ArrayList<>();
            if (lineBlock.hasRelationships()) {
                for (Relationship rel : lineBlock.relationships()) {
                    if (RelationshipType.CHILD.equals(rel.type())) {
                        for (String childId : rel.ids()) {
                            Block wordBlock = blockMap.get(childId);
                            if (wordBlock != null && BlockType.WORD.equals(wordBlock.blockType())) {
                                wordsInLine.add(WordBlock.fromBlock(wordBlock));
                            }
                        }
                    }
                }
            }
            lines.add(wordsInLine);
        }

        return lines;
    }

    @Override
    public void close() {
        textractClient.close();
        s3Client.close();
    }
}
