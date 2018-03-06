import { WebClient } from '@slack/client';

const { SLACK_CHANNEL, SLACK_TOKEN } = process.env;

const web = new WebClient(SLACK_TOKEN);

/**
 * Sending the Opportunity to the Slack channel
 * @param options Params required to post the message to Slack.
 */
export const sendOpportunity = (options: Options): Promise<any> => {
  return web.chat.postMessage(SLACK_CHANNEL, `📣 *New Opportunity*`, {
    "channel": SLACK_CHANNEL,
    "username": 'MavensBot',
    "icon_url": "https://avatars0.githubusercontent.com/u/701774",
    "attachments": [
      {
        "fallback": "Opportunity Details",
        "fields": [{
          "title": "Name",
          "value": options.name,
          "short": true
        },
        {
          "title": "Amount",
          "value": `$ ${options.amount}`,
          "short": true
        },
        {
          "title": "Close Date",
          "value": options.closeDate,
          "short": true
        }
        ],
        "actions": [
          {
            "name": "View Opportunity",
            "type": "button",
            "text": "View Opportunity 💵",
            "style": "primary",
            "value": `${options.instanceUrl}/${options.id}`
          }
        ]
      }
    ]
  });
};
