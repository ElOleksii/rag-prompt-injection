import { FeatureExtractionPipeline, pipeline } from '@huggingface/transformers';

let extractorPromise: Promise<FeatureExtractionPipeline> | null = null;

export function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2',
    );
  }
  return extractorPromise;
}
