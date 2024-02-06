// language=Lua
import { CustomScriptDefinition } from '../types';

const script = `--[[
  Get job ids per provided states and filter by name
    Input:
      KEYS[1]    'prefix'
      ARGV[1]    start
      ARGV[2]    end
      ARGV[3]    filterName
      ARGV[4...] types
]]
local rcall = redis.call
local prefix = KEYS[1]
local rangeStart = tonumber(ARGV[1])
local rangeEnd = tonumber(ARGV[2])
local filterName = ARGV[3]
local results = {}

local targetSets = {}

-- Initialize an empty array to hold the sets to unionize. The "completed" and "failed" lists
-- are sorted sets
local setsToUnionize = {}
local typesInUnion = {}

-- Initialize an empty array to hold lists to include. The "active" and "wait" lists are
-- regular lists
local listsToInclude = {}


-- Iterate through ARGV starting from the first element (ARGV[1]) up to the end
for i = 4, #ARGV do
    local setKey = prefix .. ARGV[i]

    -- Check if the setKey is valid (e.g., it exists and is a sorted set)
    local targetExists = redis.call('EXISTS', setKey)
    local listType = redis.call('TYPE', setKey).ok

    if targetExists == 1 and listType == 'zset' then
        -- Add the valid set to the array
        table.insert(setsToUnionize, setKey)
        table.insert(typesInUnion, ARGV[i])
    end
    if targetExists == 1 and listType == 'list' then
        -- Add the valid set to the array
        table.insert(listsToInclude, setKey)
        table.insert(typesInUnion, ARGV[i])
    end
end

-- Define the destination key for the concatenated sorted set
local tempSortedSetUnionKey = prefix .. 'union:' .. table.concat(typesInUnion, ':');

if #listsToInclude  == 0 and #setsToUnionize == 0 then
    return {0, {}}
end

-- Check if there are valid sets to unionize
if #setsToUnionize > 0 then
    -- Use ZUNIONSTORE to concatenate the valid sorted sets into the destination key
    local numSets = #setsToUnionize
    redis.call('ZUNIONSTORE', tempSortedSetUnionKey, numSets, unpack(setsToUnionize))
end

local originalResults = rcall("ZREVRANGE", tempSortedSetUnionKey, 0, -1)


if #listsToInclude > 0 then
    for _, listKey in ipairs(listsToInclude) do
        local list = rcall("LRANGE", listKey, 0, -1)
        for _, jobId in ipairs(list) do
            table.insert(originalResults, jobId)
        end
    end
end


-- Define a custom comparison function for sorting in descending order
local function compareDescending(a, b)
    return tonumber(a) > tonumber(b)
end

-- Sort the table in descending order
table.sort(originalResults, compareDescending)

local filteredResults = {}
local totalResults = 0

for _, job in ipairs(originalResults) do
  local jobName = rcall("HGET", prefix .. job, "name");
  if filterName ~= "" and jobName == filterName then
    if rangeStart <= totalResults and #filteredResults < rangeEnd then
      table.insert(filteredResults, job)
    end
    totalResults = totalResults + 1
  elseif filterName == "" then
    if rangeStart <= totalResults and #filteredResults < rangeEnd then
      table.insert(filteredResults, job)
    end
    totalResults = totalResults + 1
  end
end

rcall("DEL", tempSortedSetUnionKey)

return {totalResults, filteredResults}
`;

export const getJobsByType: CustomScriptDefinition<
    [totalItems: number, jobIds: string[]],
    [rangeStart: number, rangeEnd: number, queueName: string | undefined, ...states: string[]]
> = {
    script,
    numberOfKeys: 1,
    name: 'getJobsByType',
};
