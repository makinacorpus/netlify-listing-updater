/**
 * Regular `fetch()` function but with Baserow Authorization header
 */
const baserowFetch = (url, { headers = {}, ...options } = {}) => fetch(
  url,
  {
    headers: {
      Authorization: `Token ${process.env.BASEROW_TOKEN}`,
      ...headers,
    },
    ...options,
  },
);

/**
 * Get first page of Baserow rows
 * @todo Manage pagination
 */
export const getBaserowData = async () => {
  const response = await baserowFetch(
    `https://api.baserow.io/api/database/rows/table/${process.env.BASEROW_TABLE}/?user_field_names=true`,
  );

  const { results = [] } = await response.json() || {};

  return results;
};

/**
 * Create Baserow row from `netlifySite` object
 * @todo Improve error management
 */
export const baserowCreate = async netlifySite => {
  const response = await baserowFetch(
    `https://api.baserow.io/api/database/rows/table/${process.env.BASEROW_TABLE}/?user_field_names=true`,
    {
      method: 'POST',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify(netlifySite),
    },
  );

  if (response.status >= 400) {
    const err = await response.text();
    console.error(JSON.stringify(netlifySite, null, 2));
    throw err;
  }

  return response;
};

/**
 * Create simplified object from Netlify site data (to be inserted in Baserow)
 * @todo Manage pagination
 * @todo Manage rate limit (delay queries)
 */
export const getNetlifyData = async () => {
  const response = await fetch(
    'https://api.netlify.com/api/v1/sites',
    { headers: { Authorization: `Bearer ${process.env.NETLIFY_TOKEN}` } },
  );
  const sites = await response.json();
  // const total = response.headers.get('Total');
  // const rateLimit = response.headers.get('X-Ratelimit-Remaining');

  /* eslint-disable camelcase */
  return sites.map(({
    site_id,
    name,
    admin_url,
    url,
    ssl_url,
    screenshot_url,
    published_deploy, // {}
    build_settings, // {}
    default_domain,
    created_at: nf_created,
    updated_at: nf_updated,
  } = {}) => {
    const row = {
      site_id,
      name,
      admin_url,
      url,
      ssl_url,
      default_domain,
      screenshot_url,
      last_publish: published_deploy?.published_at,
      nf_created,
      nf_updated,
    };

    if (build_settings?.repo_url) {
      row.build_provider_url = `${build_settings?.repo_url}#${build_settings?.repo_branch}`;
    }

    if (published_deploy?.title) {
      row.last_message = published_deploy?.title;
    }
    /* eslint-enable camelcase */

    return row;
  });
};
