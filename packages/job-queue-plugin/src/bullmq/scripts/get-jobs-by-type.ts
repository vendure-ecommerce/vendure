// language=Lua
import { CustomScriptDefinition } from '../types';

const script = `--[[
  Get job ids per provided states and filter by name - Optimized version using indexed structure
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
local totalResults = 0

redis.log(redis.LOG_NOTICE, 'Filter name: "' .. filterName .. '"')
redis.log(redis.LOG_NOTICE, 'Filter name length: ' .. tostring(#filterName))

-- Function to count jobs in a sorted set
local function countJobsInSortedSet(key)
    return rcall('ZCARD', key) or 0
end

-- Function to count jobs in a list
local function countJobsInList(key)
    return rcall('LLEN', key) or 0
end

-- Function to get jobs from a sorted set
local function getJobsFromSortedSet(key, start, count)
    local items = rcall('ZREVRANGE', key, start, start + count - 1)
    if items then
        for _, jobId in ipairs(items) do
            table.insert(results, jobId)
        end
    end
    return #items
end

-- Function to get jobs from a list
local function getJobsFromList(key, start, count)
    local items = rcall('LRANGE', key, start, start + count - 1)
    if items then
        for _, jobId in ipairs(items) do
            table.insert(results, jobId)
        end
    end
    return #items
end

-- First count total jobs
if filterName ~= "" then
    local indexedKey = prefix .. 'queue:' .. filterName
    redis.log(redis.LOG_NOTICE, 'Checking indexed key: ' .. indexedKey)
    redis.log(redis.LOG_NOTICE, 'Indexed key exists: ' .. tostring(rcall('EXISTS', indexedKey)))
    if rcall('EXISTS', indexedKey) == 1 then
        redis.log(redis.LOG_NOTICE, 'Found indexed key, counting jobs')
        totalResults = countJobsInSortedSet(indexedKey)
    else
        redis.log(redis.LOG_NOTICE, 'Indexed key not found, returning empty result')
        return {0, {}}
    end
else
    -- No filter, count all types
    for i = 4, #ARGV do
        local key = prefix .. ARGV[i]
        local keyType = rcall('TYPE', key).ok
        redis.log(redis.LOG_NOTICE, 'Counting key: ' .. key .. ' of type: ' .. keyType)
        
        if keyType == 'zset' then
            totalResults = totalResults + countJobsInSortedSet(key)
        elseif keyType == 'list' then
            totalResults = totalResults + countJobsInList(key)
        end
    end
end

-- Now collect results for the requested page
if filterName ~= "" then
    local indexedKey = prefix .. 'queue:' .. filterName
    if rcall('EXISTS', indexedKey) == 1 then
        getJobsFromSortedSet(indexedKey, rangeStart, rangeEnd)
    else
        -- If no indexed key exists for the filter name, return empty results
        return {0, {}}
    end
else
    -- No filter, process all types
    for i = 4, #ARGV do
        local key = prefix .. ARGV[i]
        local keyType = rcall('TYPE', key).ok
        
        if keyType == 'zset' then
            getJobsFromSortedSet(key, rangeStart, rangeEnd)
        elseif keyType == 'list' then
            getJobsFromList(key, rangeStart, rangeEnd)
        end
        
        if #results >= rangeEnd then
            break
        end
    end
end

return {totalResults, results}
`;

export const getJobsByType: CustomScriptDefinition<
    [totalItems: number, jobIds: string[]],
    [rangeStart: number, rangeEnd: number, queueName: string | undefined, ...states: string[]]
> = {
    script,
    numberOfKeys: 1,
    name: 'getJobsByType',
};
