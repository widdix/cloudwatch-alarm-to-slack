# CloudWatch Alarm to Slack

Read the full [blog post on cloudonaut.io](https://cloudonaut.io/cloudwatch-alarm-to-slack)

Or use [marbot, a chatbot ensuring you never miss an alert from Amazon Web Services including CloudWatch](https://marbot.io/).

## Slack setup

1. Start by setting up an incoming webhook integration in your Slack workspace: https://my.slack.com/services/new/incoming-webhook/
2. Select a channel or create a new one
3. Click on *Add Incoming WebHooks integration*
4. You are redirected to a new page where you can see your *Webhook URL*. Copy the value, you will need it soon.

## AWS setup

1. create a S3 bucket for SAM (replace `$UniqueSuffix` with e.g. your username): `aws s3 mb s3://cw-to-slack-$UniqueSuffix`
2. Install Node.js dependencies: `npm install`
2. package the Lambda function code (replace `$UniqueSuffix` with e.g. your username): `aws cloudformation package --s3-bucket cw-to-slack-$UniqueSuffix  --template-file template.yml --output-template-file template.sam.yml`
3. Deploy the CloudFormation stack (replace `$WebhookURL` with your URL from Slack): `aws cloudformation deploy --parameter-overrides "WebhookURL=$WebhookURL" --template-file template.sam.yml --stack-name cw-to-slack --capabilities CAPABILITY_IAM`
