import * as cdk from "@aws-cdk/core";
import * as pipelines from "@aws-cdk/pipelines";
import { ContainerImage } from "./containerimage";

class ContainerImageStack extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    new ContainerImage(this, "Test");
  }
}

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const pipeline = new pipelines.CodePipeline(this, "Pipeline", {
      selfMutation: true, // if you want to deploy fast, set to false so the pipeline skips the self mutation step
      synth: new pipelines.ShellStep("Synth", {
        input: pipelines.CodePipelineSource.connection(
          "aws-containers/ecsdemo-frontend",
          "main",
          {
            connectionArn:
              "arn:aws:codestar-connections:us-west-2:104646680767:connection/4099e272-1ac2-4b68-a43a-f3aa6d44778b",
          }
        ),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    });

    pipeline.addStage(
      new ContainerImageStack(this, "Prod", {
        env: props.env,
      })
    );
  }
}
