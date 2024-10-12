local M = {}

function M.map(tbl, f)
    local t = {}
    for k,v in pairs(tbl) do
        t[k] = f(v)
    end
    return t
end

function M.sequence(start, stop)
    local t = {}
    for i=start,stop do
        table.insert(t, i)
    end
    return t
end

function ternary(cond, t, f)
    if cond then return t else return f end
end

return M
