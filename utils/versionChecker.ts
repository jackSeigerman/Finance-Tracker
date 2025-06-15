import version from '../version.json';
const url = 'https://raw.githubusercontent.com/jackSeigerman/FinanceManagerReact/refs/heads/Master/version.json';

// returns a 0 if the local tag matches the remote tag,
// returns a 1 if the local tag does not match the remote tag,  
// returns a 2 if there was an error fetching the remote tag (no connection, etc.)
export async function checkTagStatus(): Promise<0 | 1 | 2> {
  try {
    const response = await fetch(url, { cache: 'no-store' }); // avoid caching
    if (!response.ok) throw new Error('Non-200 response');

    const encoded = (await response.text()).trim();

    const remoteTag = JSON.parse(encoded);

    console.log(`Remote tag: ${remoteTag.version}, Local version: ${version.version}`);
    return remoteTag.version === version.version ? 0 : 1;
  } catch (error) {
    return 2;
  }
}