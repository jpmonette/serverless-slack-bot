import * as cheerio from 'cheerio';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import { URL } from 'url';

import { sendOpportunity } from './dataServices/slack';

const app = new Koa();

// The HTTP server is listening on the PORT, provided by Up
const { PORT = 6666 } = process.env;

// SOAP response sent back on request to Salesforce
const SOAP_RESPONSE = 
`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body>
    <notificationsResponse xmlns="http://soap.sforce.com/2005/09/outbound">
      <Ack>true</Ack>
    </notificationsResponse>
  </soapenv:Body>
</soapenv:Envelope>`;

// Setting up Koa to parse as text the text/xml body sent by the Outbound Message
app.use(bodyParser({
  enableTypes: ['text'],
  extendTypes: { text: ['text/xml'] }
}));

/**
 * Server handler - this is where we are processing requests to the server
 * @param ctx Request context
 */
const handler = (ctx: Koa.Context) => {
  const { rawBody } = ctx.request;

  if (!rawBody) return;

  sendOpportunity(parseRequest(rawBody))
    .then(response => {
      ctx.type = 'text/xml'
      ctx.body = SOAP_RESPONSE;

      console.log('Message posted successfuly!');
    })
    .catch(err => {
      ctx.type = 'text/xml'
      ctx.body = SOAP_RESPONSE;

      console.log('Error when posting message:', err.message);
    });
}

/**
 * Parsing the Outbound Message
 * @param rawBody
 */
const parseRequest = (rawBody: string): Options => {
  const $ = cheerio.load(rawBody);
  const url = $('EnterpriseUrl').text();
  const instanceUrl = new URL(url).origin;

  const parseField = (field: string) => $(`sf\\:${field}`).text();

  return {
    instanceUrl,
    id: parseField('Id'),
    name: parseField('Name'),
    closeDate: parseField('CloseDate'),
    amount: parseField('Amount'),
  }
}

app.use(handler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
