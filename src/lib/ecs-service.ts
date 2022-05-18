import { Construct } from "constructs";
import { RemovalPolicy, Stack } from "aws-cdk-lib";
import { Platform } from "./platform";

import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecsPatterns from "aws-cdk-lib/aws-ecs-patterns";
import * as iam from "aws-cdk-lib/aws-iam";
import * as logs from "aws-cdk-lib/aws-logs";

export interface ECSServiceProps {
  containerPort: number;
  cpu?: number;
  memoryReservation?: number;
  enableServiceMesh?: boolean;
}

export class ECSService extends Construct {
  constructor(scope: Construct, id: string, props: ECSServiceProps) {
    super(scope, id);

    const platform = new Platform(this, "frontend");

    const deployEnv = this.node.tryGetContext("deployEnv") ?? "dev";

    const taskLogGroup = new logs.LogGroup(this, "FrontendSvcLogGrp", {
      removalPolicy: RemovalPolicy.DESTROY,
      retention: logs.RetentionDays.THREE_DAYS,
    });

    const frontendService =
      new ecsPatterns.ApplicationLoadBalancedFargateService(
        this,
        "ECSWorkshopFrontend",
        {
          serviceName: "ecsdemo-frontend",
          cluster: platform.ecsCluster,
          cpu: props.cpu ?? 256,
          memoryLimitMiB: props.memoryReservation ?? 1024,
          taskImageOptions: {
            image: ecs.ContainerImage.fromAsset("./application"),
            containerPort: props.containerPort,
            environment: {
              CRYSTAL_URL: "http://ecsdemo-crystal.service.local:3000/crystal",
              NODEJS_URL: "http://ecsdemo-nodejs.service.local:3000",
              REGION: Stack.of(this).region,
            },
            logDriver: ecs.LogDriver.awsLogs({
              streamPrefix: `ecsworkshop-frontend-${deployEnv}`,
              logGroup: taskLogGroup,
            }),
          },
        }
      );

    frontendService.taskDefinition.taskRole.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ["ec2:DescribeSubnets"],
        resources: ["*"],
      })
    );

    frontendService.service.connections.allowTo(
      platform.sharedSecGrp3000,
      ec2.Port.tcpRange(props.containerPort, props.containerPort)
    );
  }
}
