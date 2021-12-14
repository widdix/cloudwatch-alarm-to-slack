const request = require('request-promise-native');

const sendMessage = (message) => {
  return request({
    method: 'POST',
    url: process.env.WEBHOOK_URL,
    body: message,
    json: true,
  })
    .then((body) => {
      if (body === 'ok') {
        return {};
      } else {
        throw new Error(body);
      }
    });
};

const processRecord = (record) => {
  const subject = record.Sns.Subject;
  const message = JSON.parse(record.Sns.Message);
  return sendMessage({
    text: subject,
    attachments: [{
      text: message.NewStateReason,
      fields: [{
       title: 'Description',
       value: message.AlarmDescription,
       short: false,
     }, {
        title: 'Time',
        value: message.StateChangeTime,
        short: true,
      }, {
        title: 'Alarm',
        value: message.AlarmName,
        short: true,
      }, {
        title: 'Account',
        value: message.AWSAccountId,
        short: true,
      }, {
        title: 'Region',
        value: message.Region,
        short: true,
      }],
    }],
  });
};

/*
example event:
{
  "Records": [{
     "EventSource": "aws:sns",
     "EventVersion": "1.0",
     "EventSubscriptionArn": "arn:aws:sns:us-east-1:XXX:cw-to-slack-Topic-1B8S548158492:a0e76b10-796e-471d-82d3-0510fc89ad93",
     "Sns": {
        "Type": "Notification",
        "MessageId": "[...]",
        "TopicArn": "arn:aws:sns:us-east-1:XXX:cw-to-slack-Topic-1B8S548158492",
        "Subject": "ALARM: \"cw-to-slack-Alarm-9THDKWBS1876\" in US East (N. Virginia)",
        "Message": "{\"AlarmName\":\"cw-to-slack-Alarm-9THDKWBS1876\",\"AlarmDescription\":null,\"AWSAccountId\":\"XXX\",\"NewStateValue\":\"ALARM\",\"NewStateReason\":\"Threshold Crossed: 1 datapoint [3.22 (29/10/17 13:20:00)] was greater than the threshold (1.0).\",\"StateChangeTime\":\"2017-10-30T13:20:35.831+0000\",\"Region\":\"US East (N. Virginia)\",\"OldStateValue\":\"INSUFFICIENT_DATA\",\"Trigger\":{\"MetricName\":\"EstimatedCharges\",\"Namespace\":\"AWS/Billing\",\"StatisticType\":\"Statistic\",\"Statistic\":\"MAXIMUM\",\"Unit\":null,\"Dimensions\":[{\"name\":\"Currency\",\"value\":\"USD\"}],\"Period\":86400,\"EvaluationPeriods\":1,\"ComparisonOperator\":\"GreaterThanThreshold\",\"Threshold\":1.0,\"TreatMissingData\":\"\",\"EvaluateLowSampleCountPercentile\":\"\"}}",
        "Timestamp": "2017-10-30T13:20:35.855Z",
        "SignatureVersion": "1",
        "Signature": "[...]",
        "SigningCertUrl": "[...]",
        "UnsubscribeUrl": "[...]",
        "MessageAttributes": {}
     }
  }]
}
*/
exports.event = (event, context, cb) => {
  console.log(`event received: ${JSON.stringify(event)}`);
  Promise.all(event.Records.map(processRecord))
    .then(() => cb(null))
    .catch((err) => cb(err));
};
