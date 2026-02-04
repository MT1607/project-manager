import arcjet, { shield, detectBot, tokenBucket, validateEmail } from '@arcjet/node';
import dotenv from 'dotenv';

dotenv.config();

const aj = arcjet({
  // Get your site key from https://app.arcjet.com and set it as an environment
  // variable rather than hard coding.
  key: process.env.ARCJET_KEY,
  characteristics: ['ip.src', 'http.request.headers.x-appwrite-user-id'], // Track requests by IP and Appwrite user
  rules: [
    shield({ mode: 'LIVE' }),
    detectBot({
      mode: 'LIVE',
      allow: ['CATEGORY:SEARCH_ENGINE'],
    }),
    tokenBucket({
      mode: 'LIVE',
      refillRate: 5, // Refill 5 tokens per interval
      interval: 10, // Refill every 10 seconds
      capacity: 10, // Bucket capacity of 10 tokens
    }),
    validateEmail({
      mode: 'LIVE',
      deny: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS'],
      conditions: (req) =>{
        // Only validate email if it's provided in the request body
        let bodyData = {};
        try {
            if (req.body) {
                bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            }
        } catch (e) {
            return false; // If body can't be parsed, skip email validation
        }
        return !!bodyData?.email;
      }
    }),
  ],
});

export default aj;
