/* eslint-disable no-await-in-loop,camelcase */
import {
  baserowCreate,
  baserowMarkMissing,
  getBaserowData,
  getNetlifyData,
} from '../../../helpers';

/**
 * `nf` prefix stand for Netlify
 * `br` prefix stand for Baserow
 */

const main = async () => {
  const report = {};

  const nfSites = await getNetlifyData();
  const brRows = await getBaserowData();

  const nfIds = nfSites.map(({ site_id }) => site_id);
  const brIds = brRows.map(({ site_id }) => site_id);

  report.nfCount = nfIds.length;
  report.brCount = brIds.length;

  /**
   * Create Baserow rows for `site_id` not existing in table
   */
  const rowsToCreate = nfSites.filter(({ site_id }) => !brIds.includes(site_id));

  let batchMaxCount = 10;
  const batchSize = 2;
  const creationResponses = [];

  batchMaxCount = 10;
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

  console.log('creationResponses:', creationResponses.length);
  report.creations = creationResponses.length;

  /**
   * Update Baserow rows data for sites having changed since last check
   */

  // @TODO

  /**
   * Update Baserow rows `missing_since` field for sites not available anymore on Netlify
   */
  const nfMissing = brIds
    .filter(site_id => !nfIds.includes(site_id))
    .map(nfSiteId => {
      // Return row only if missing_since is falsy
      const brRow = brRows.find(({ site_id: brSiteId }) => brSiteId === nfSiteId);
      return !brRow.missing_since && brRow;
    })
    .filter(Boolean);

  const updateMissingResponses = [];

  batchMaxCount = 4;
  while (nfMissing.length && batchMaxCount--) { // eslint-disable-line no-plusplus
    await new Promise(r => setTimeout(r, 200)); // eslint-disable-line no-promise-executor-return

    try {
      const responses = await Promise.all(nfMissing.splice(0, batchSize).map(baserowMarkMissing));
      updateMissingResponses.push(...responses);
    } catch (err) {
      console.error(err);
      break;
    }
  }

  console.log('updateMissingResponses:', updateMissingResponses.length);
  report.markedMissing = updateMissingResponses.length;

  /**
   * Create a summary of actions done
   */

  // @TODO

  /**
   * Build http response based on summary
   */
  return new Response(
    JSON.stringify(report, null, 2),
    { headers: { 'Content-Type': 'application/json' } },
  );
};

export default main;
