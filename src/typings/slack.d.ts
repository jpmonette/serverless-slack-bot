// Type definitions for node-slack-sdk
// Project: https://github.com/slackapi/node-slack-sdk
// Definitions by: Bilal Aijazi <https://github.com/bmajz>

declare module '@slack/client' {

  class WebClient {
    constructor(token: string);

    chat: WebApiChat;
  }

  interface WebApiChat {
    postMessage(channel: string, text: string, opts?: ChatPostMessageParams): Promise<ChatPostMessageResult>;
  }

  // Web API Parameters and results
  // https://api.slack.com/web
  interface WebApiResult {
    ok: boolean;
    error?: string;
  }

  interface ChatPostMessageParams {
    attachments: MessageAttachment[];
    channel: string;
    username: string;
    icon_url: string;
  }

  interface ChatPostMessageResult extends WebApiResult {
    ts: string;
    channel: string;
    message: string;
  }

  // Slack Message and Attachment information
  // https://api.slack.com/docs/message-attachments

  interface MessageAttachment {
    fallback: string;
    fields: MessageAttachmentField[];
    actions: MessageActions[];
  }

  interface MessageAttachmentField {
    title: string;
    value: string;
    short: boolean;
  }

  interface MessageActions {
    name: string;
    text: string;
    type: 'button';
    style: 'default' | 'primary' | 'danger';
    value: string;
  }

}