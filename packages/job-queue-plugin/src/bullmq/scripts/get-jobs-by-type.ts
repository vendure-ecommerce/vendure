// language=Lua
export const getJobsByTypeScript = `
--[[
  Get paginated job ids across all queues for provided states, including queue name, and return total job count
  Input:
    ARGV[1]    start
    ARGV[2]    end
    ARGV[3...] states (e.g., "completed", "failed", "active", etc.)
    KEYS[...]  List of queues
]]

local start = tonumber(ARGV[1])
local stop = tonumber(ARGV[2])
local combinedKey = 'temp:union:all_states'

-- Initialize arrays to handle sorted sets and lists
local setsToUnionize = {}
local jobIdsWithQueueNames = {}

-- Iterate over all queue names (KEYS) and states (ARGV[3..n])
for i = 1, #KEYS do
  local queueName = KEYS[i] -- Queue name
  for j = 3, #ARGV do
    local state = ARGV[j]
    local setKey = queueName .. ':' .. state
    local keyType = redis.call('TYPE', setKey).ok

    -- Handle sorted sets (e.g., completed, failed)
    if keyType == 'zset' and redis.call('EXISTS', setKey) == 1 then
      table.insert(setsToUnionize, setKey)
    end

    -- Handle lists (e.g., wait, active)
    if keyType == 'list' and redis.call('EXISTS', setKey) == 1 then
      local listItems = redis.call('LRANGE', setKey, 0, -1)
      for _, jobId in ipairs(listItems) do
        -- Append queue name to jobId from lists
        table.insert(jobIdsWithQueueNames, queueName .. ':' .. jobId)
      end
    end
  end
end

-- If no valid sets or lists were found, return an empty result with total count 0
if #setsToUnionize == 0 and #jobIdsWithQueueNames == 0 then
  return {0, {}}
end

-- Union all sorted sets into a temporary sorted set (if there are any sorted sets)
if #setsToUnionize > 0 then
  redis.call('ZUNIONSTORE', combinedKey, #setsToUnionize, unpack(setsToUnionize))
end

-- Get job ids from the sorted set (if any) and append the queue name for each job
if #setsToUnionize > 0 then
  local jobIdsFromSets = redis.call('ZREVRANGE', combinedKey, 0, -1)
  for _, jobId in ipairs(jobIdsFromSets) do
    -- Append queue name to jobId from sorted sets
    for i = 1, #KEYS do
      local queueName = KEYS[i]
      local setKey = queueName .. ':' .. ARGV[3] -- Assuming the same state across all queues
      if redis.call('ZSCORE', setKey, jobId) then
        table.insert(jobIdsWithQueueNames, queueName .. ':' .. jobId)
        break
      end
    end
  end
end

-- Sort all job ids in descending order (to mimic ZREVRANGE behavior)
table.sort(jobIdsWithQueueNames, function(a, b)
  local jobIdA = tonumber(a:match(':(%d+)$')) or 0 -- Safely extract and convert job ID to number, fallback to 0
  local jobIdB = tonumber(b:match(':(%d+)$')) or 0 -- Safely extract and convert job ID to number, fallback to 0
  return jobIdA > jobIdB
end)

-- Get the total number of jobs
local totalJobs = #jobIdsWithQueueNames

-- Paginate the results
local paginatedJobIds = {}
for i = start + 1, math.min(stop + 1, totalJobs) do
  table.insert(paginatedJobIds, jobIdsWithQueueNames[i])
end

-- Cleanup the temporary sorted set
redis.call('DEL', combinedKey)

-- Return the total job count and the paginated job ids
return {totalJobs, paginatedJobIds}
`;
