import { HandlerEvent, HandlerResponse, getSecrets } from '@netlify/functions';
import fetch from 'node-fetch';

export async function handler(event: HandlerEvent): Promise<HandlerResponse> {
  const body = JSON.parse(event.body || '{}');
  const secrets = await getSecrets();

  if (!secrets.spotify?.bearerToken) {
    return {
      statusCode: 401,
      body: 'Please enable Spotify in your Netlify Auth Management settings: https://app.netlify.com/user/labs',
    };
  }

  // send a POST request to the Spotify API to start playing a song
  const result = await fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: {
      Authorization: `bearer ${secrets.spotify.bearerToken}`,
    },
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ body, result }),
  };
}
