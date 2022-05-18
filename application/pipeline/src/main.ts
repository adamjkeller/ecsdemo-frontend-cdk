import { App } from "@aws-cdk/core";
import { PipelineStack } from "./pipeline";

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new PipelineStack(app, "buildpipeline", { env: devEnv });

app.synth();
