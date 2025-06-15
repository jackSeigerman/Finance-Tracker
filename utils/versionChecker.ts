import version from '../version.json';

const url = 'https://raw.githubusercontent.com/jackSeigerman/FinanceManagerReact/refs/heads/Master/version.json';

function fetchWithTimeout(resource: RequestInfo, options: RequestInit = {}, timeout = 5000): Promise<Response> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timeout')), timeout);
    fetch(resource, options)
      .then(response => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// returns a 0 if the local tag matches the remote tag,
// returns a 1 if the local tag does not match the remote tag,  
// returns a 2 if there was an error fetching the remote tag (no connection, etc.)
export async function checkTagStatus(): Promise<0 | 1 | 2> {
  try {
    const response = await fetchWithTimeout(url, { cache: 'no-store' }, 5000);
    if (!response.ok) throw new Error('Non-200 response');

    const encoded = (await response.text()).trim();
    const remoteTag = JSON.parse(encoded);

    console.log(`Remote tag: ${remoteTag.version}, Local version: ${version.version}`);
    return remoteTag.version === version.version ? 0 : 1;
  } catch (error) {
    console.log('Fetch error:', error instanceof Error ? error.message : String(error));
    return 2;
  }
}
