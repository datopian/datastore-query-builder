const axios = require('axios')
const LARGE_DATASET_THRESHOLD = 1000000

async function printLargeDatasets() {
  // get the list of all packages
  let allDatasets = ['electricitysupplierspergridarea', 'fixedresidualconsumption']

  try {
    allDatasets = (await axios
      .get('https://api.energidataservice.dk/package_list')
    ).data.result
    // console.log('All datasets:\n' + allDatasets)
  } catch (e) {
    console.error(e)
  }

  // find large datasets
  let largeDatasets = []
  for (let dataset of allDatasets) {
    // get the total row count (count using index only scan)
    // more info on how it works here https://www.citusdata.com/blog/2016/10/12/count-performance/#distinct_counts_exact_index
    const sql = `
      SELECT COUNT(*) AS _count
        FROM (SELECT DISTINCT "_id" FROM "${dataset}") t
      `.replace(/[\n\s]+/g, ' ')

    let rowCount = 0
    try {
      rowCount = Number((await axios
        .get('https://api.energidataservice.dk/datastore_search_sql?sql=' + sql)
      ).data.result.records[0]._count)
      console.log(dataset + ': ' + JSON.stringify(rowCount))

      if (rowCount > LARGE_DATASET_THRESHOLD) {
        largeDatasets.push(dataset)
      }
    } catch (e) {
      console.error(e)
    }

  }

  console.log('Large datasets:\n' + JSON.stringify(largeDatasets, null, 2))
}

printLargeDatasets()
