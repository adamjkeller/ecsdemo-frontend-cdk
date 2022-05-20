import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { ECSDemoFrontend } from '../src/lib/frontend';

test('Snapshot', () => {
  const app = new App();

  const devEnv = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  };

  const stack = new ECSDemoFrontend(app, 'ECSWorkshopFrontend', {
    env: devEnv,
  });

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});
