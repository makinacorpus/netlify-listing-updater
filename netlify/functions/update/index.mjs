/* eslint-disable no-await-in-loop,camelcase */
import {
  baserowCreate,
  getBaserowData,
  getNetlifyData,
} from '../../../helpers';

const main = async () => {
  const netlifySites = await getNetlifyData();
  const brRows = await getBaserowData();

  const brIds = brRows.map(({ site_id }) => site_id);

  /**
   * Create Baserow rows for `site_id` not existing in table
   */
  const rowsToCreate = netlifySites.filter(({ site_id }) => !brIds.includes(site_id));

  let batchMaxCount = 10;
  const batchSize = 2;
  const creationResponses = [];

  while (rowsToCreate.length && batchMaxCount--) { // eslint-disable-line no-plusplus
    await new Promise(r => setTimeout(r, 200)); // eslint-disable-line no-promise-executor-return

    try {
      const responses = await Promise.all(rowsToCreate.splice(0, batchSize).map(baserowCreate));
      creationResponses.push(...responses);
    } catch (err) {
      console.error(err);
      break;
    }
  }

  console.log(creationResponses);

  /**
   * Update Baserow rows data for sites having changed since last check
   */

  // @TODO

  /**
   * Update Baserow rows `deleted` field sites not available anymore on Netlify
   */

  // @TODO

  /**
   * Create a summary of actions done
   */

  // @TODO

  /**
   * Build http response based on summary
   */
  return new Response('Hello, world!');
};

export default main;
