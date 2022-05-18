import { App } from "aws-cdk-lib";
import { ECSDemoFrontend } from "../lib/frontend";

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new ECSDemoFrontend(app, "ecsworkshop-frontend", { env: devEnv });

app.synth();
