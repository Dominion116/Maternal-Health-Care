import app from './app';
import { env } from './config/env';

app.listen(Number(env.PORT), () => {
  console.log(`MamaGuide API running on http://localhost:${env.PORT}`);
  console.log(`Swagger docs: http://localhost:${env.PORT}/api-docs`);
});
