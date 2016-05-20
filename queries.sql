-- reviews retrieval
-- SELECT review.id, review.hostel_id, review.sentiments, max_sentence_nbr
-- FROM review
-- INNER JOIN (
  -- SELECT id, max(sentence_nbr::int) as max_sentence_nbr
  -- FROM (
    -- SELECT id, jsonb_array_elements(review_attributes->'positions')->>'sentence' sentence_nbr
    -- FROM (
      -- SELECT id, review_attributes
      -- FROM (
        -- SELECT id, jsonb_array_elements(attributes) review_attributes
        -- FROM review
      -- ) attributes_proj
      -- WHERE review_attributes->>'attribute_name' = ANY('{party,location}')
    -- ) _
  -- ) _
-- GROUP BY id) max_sentiments ON review.id = max_sentiments.id
-- WHERE review.hostel_id = ANY('{1,2,3,4,5,6,7,8,9,10,11,12,13,14,15}')
-- ORDER BY hostel_id, (review.sentiments->>max_sentence_nbr)::int desc;

-- tags retrieval
-- SELECT hostel_id, tag, rating, total_rating
-- FROM (
  -- SELECT a.name AS tag, ha.rating, h.id AS hostel_id, SUM(ha.rating) OVER (PARTITION BY h.id) AS total_rating
  -- FROM hostel AS h
  -- INNER JOIN hostel_attribute AS ha ON h.id = ha.hostel_id
  -- INNER JOIN attribute AS a         ON a.id = ha.attribute_id
  -- WHERE h.id = ANY('{1,2,3,4,5,6,7,8,9,10,11,12,13,14,15}')
  -- ORDER BY h.id, ha.rating DESC
-- ) _
-- WHERE tag = ANY('{location, party}');

-- not exactly percentile, just buckets in terms of quantity over whole result set, e.g. 3571 results, aprox 35 results per bucket
SELECT hostel_id, tag, rating, percentile
FROM (
  SELECT a.name AS tag, ha.rating, h.id AS hostel_id, ntile(100) over (order by ha.rating) as percentile
  FROM hostel AS h
  INNER JOIN hostel_attribute AS ha ON h.id = ha.hostel_id
  INNER JOIN attribute AS a         ON a.id = ha.attribute_id
  WHERE h.id = ANY('{1,2,3,4,5,6,7,8,9,10,11,12,13,14,15}')
  ORDER BY h.id, ha.rating DESC
) _
WHERE tag = ANY('{location, party, beer}');
