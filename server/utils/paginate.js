export default async function paginate (
  Model, page = 1, limit = 25, options, callback
) {
  const { query = {}, fields, populate = '', populateFields } = options
  const total = await Model.count()
  const searchResults = await Model.count(query)

  if (!searchResults) {
    return callback(404)
  }

  const maxLimit = 100
  const currentLimit = limit > maxLimit ? maxLimit : limit;
  const pagesTotal = Math.ceil(Math.min(searchResults, total) / currentLimit)
  const currentPage =
    Math.ceil(page > pagesTotal ? pagesTotal : (page < 1 ? 1 : page));

  return Model
    .find(query, fields)
    .skip((currentPage - 1) * limit)
    .limit(currentLimit)
    .populate(populate, populateFields)
    .exec((err, data) => callback(
      err, data, {
        total,
        searchResults,
        page: currentPage,
        pagesTotal,
        limit: currentLimit,
      }
    ))
}
