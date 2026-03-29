package ivygate.demo.service.contract;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.textract.TextractClient;
import software.amazon.awssdk.services.textract.model.Block;
import software.amazon.awssdk.services.textract.model.DocumentLocation;
import software.amazon.awssdk.services.textract.model.GetDocumentTextDetectionRequest;
import software.amazon.awssdk.services.textract.model.GetDocumentTextDetectionResponse;
import software.amazon.awssdk.services.textract.model.JobStatus;
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
     * Uploads the PDF to S3, runs async Textract text detection, collects all
     * word blocks across every page, then deletes the temp S3 object.
     *
     * @param inputStream raw PDF bytes
     * @return all words in document order with normalized bounding boxes
     */
    public List<WordBlock> extractWords(InputStream inputStream, String sub) throws IOException {
        String key = String.format("uploads/%s/%s.pdf", sub, UUID.randomUUID());

        System.out.printf("%s - %s%n", key, bucket);

        s3Client.putObject(
            PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType("application/pdf")
                .build(),
            RequestBody.fromBytes(inputStream.readAllBytes())
        );

        try {
            String jobId = textractClient.startDocumentTextDetection(
                StartDocumentTextDetectionRequest.builder()
                    .documentLocation(DocumentLocation.builder()
                        .s3Object(S3Object.builder().bucket(bucket).name(key).build())
                        .build())
                    .build()
            ).jobId();

            return collectWords(jobId);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("Interrupted while waiting for Textract job", e);
        }
    }

    private List<WordBlock> collectWords(String jobId) throws IOException, InterruptedException {
        List<WordBlock> words = new ArrayList<>();
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

            // SUCCEEDED or PARTIAL_SUCCESS — collect all blocks
            for (Block block : response.blocks()) {
                words.add(WordBlock.fromBlock(block));
            }

            nextToken = response.nextToken();
            if (nextToken == null) break;
        }

        return words;
    }

    @Override
    public void close() {
        textractClient.close();
        s3Client.close();
    }
}
