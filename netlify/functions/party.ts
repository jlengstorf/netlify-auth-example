import { HandlerEvent, HandlerResponse, getSecrets } from '@netlify/functions';
import fetch from 'node-fetch';

export async function handler(event: HandlerEvent): Promise<HandlerResponse> {
  const body = JSON.parse(event.body || '{}');
  const secrets = await getSecrets();

  if (!secrets.spotify?.bearerToken) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message:
          'Please enable Spotify in your Netlify Auth Management settings: https://app.netlify.com/user/labs',
      }),
    };
  }

  // send a POST request to the Spotify API to start playing a song
  const response = await fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${secrets.spotify.bearerToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      uris: ['spotify:track:4cOdK2wGLETKBW3PvgPWqT'],
    }),
  });

  if (response.status !== 204) {
    const data: any = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify({ message: data.error.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(body),
  };
}
