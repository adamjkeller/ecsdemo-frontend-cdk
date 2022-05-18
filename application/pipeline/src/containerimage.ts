import { Construct, Stack, StackProps } from "@aws-cdk/core";
import * as ecr from "@aws-cdk/aws-ecr";

export class ContainerImage extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    new ecr.CfnPublicRepository(this, "PublicRepository", {
      repositoryName: "ecsdemo",
      repositoryCatalogData: {
        UsageText: "This is a sample usage text.",
        AboutText: "This is a sample about text.",
        OperatingSystems: ["Linux", "Windows"],
        Architectures: ["x86", "ARM"],
        RepositoryDescription: "This is a sample repository description.",
      },
    });
  }
}
