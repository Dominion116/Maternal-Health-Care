import app from './app';
import { env } from './config/env';
import { warmupClassifier } from './ml/classifier';

app.listen(Number(env.PORT), () => {
  console.log(`MamaGuide API running on http://localhost:${env.PORT}`);
  console.log(`Swagger docs: http://localhost:${env.PORT}/api-docs`);

  // Load the classification head + Universal Sentence Encoder base model in
  // the background so the first chat request doesn't pay the ~30s download.
  warmupClassifier()
    .then(() => console.log('Intent classifier warmed up.'))
    .catch((err) => console.error('Classifier warmup failed:', err.message));
});
