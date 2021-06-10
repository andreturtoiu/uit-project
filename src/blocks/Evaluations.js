function evalSelect(df, params) {
    const { labels } = params  //labels da prendere
    if(!labels){
        return df
    }
    if (labels) {
        return df.select(...labels)
    }
    return df
}

function evalFilter(df, params) {
    if (!params) {
        return df
    }
    const { begin, end } = params
    return df.filter(row => row.get('date') >= begin && row.get('date') <= end)
}

function evalGroupStat(group, col, stat){
    switch(stat){
        case 'sum':
            return group.stat.sum(col)
        case 'min':
            return group.stat.min(col)
        case 'max':
            return group.stat.max(col)
        case 'mean':
            return group.stat.mean(col)
        default:
            return group.stat.sum(col)
    }
}

function evalResample(df, params) {
    if (!params) {
        return df
    }

    var df_resample = df.withColumn('date', (row) => truncDate(params.sample, row.get('date')))
    var df_grouped = df_resample.groupBy('date')
    var cols = df_resample.listColumns().filter(l => l !== 'date')
    console.log("COLS", cols)
    var dfs = cols.map(col => df_grouped.aggregate(group=>evalGroupStat(group, col, params.stat)).rename('aggregation', col))
    dfs.forEach(df => df.show())
    dfs = dfs.reduce((p, a) => p.join(a, ['date']))
    return dfs
}

function truncDate(sample, date) {
    var substr_len
    switch (sample) {
        case 'year':
            substr_len = 4; break;
        case 'month':
            substr_len = 7; break;
        case 'day':
            substr_len = 10; break;
        case 'hour':
            substr_len = 13; break;
        case 'minute':
            substr_len = 16; break;
        default:
            substr_len = 19
    }
    console.log(sample, substr_len, date.slice(0, substr_len))
    return date.slice(0, substr_len)
}

function evalPreprocessing(df, params) {
    if (!params) {
        return df
    }
    const { prpFun } = params
    const labels = df.listColumns()
    switch (prpFun) {
        case 'log':
            return labels.reduce((part_df, l) => {
                if (l === 'date') {
                    return part_df
                }
                return part_df.map(row => row.set(l, Math.log(row.get(l))));
            }, df)
        case 'exp':
            return labels.reduce((part_df, l) => {
                if (l === 'date') {
                    return part_df
                }
                return part_df.map(row => row.set(l, Math.exp(row.get(l))));
            }, df)
        default:
            return df
    }
}

function evalAggregate(df, params) {
    console.log("EVAL AGGREGATE", df, params)
    if (!params) {
        console.log("EVAL AGG RETURN DF FOR NOT PARAMS")
        return df
    }
    console.log("EVAL AGG PARAMS", params)
    const { aggFun, labels } = params
    const evalFun = (fun) => {
        console.log("EVAL AGG - EVAL FUN", fun)
        switch (fun) {
            case 'sum':
                return (partial, a) => (partial + a)
            case 'min':
                return (partial, a) => (partial < a ? partial : a)
            default:
                return (partial, a) => (partial)
        }
    }

    const newLabels = labels.filter((label) => label !== "date")
    if (newLabels.length < 2) {
        return df
    }
    const agg_col = 'agg_' + newLabels.join('_')
    var agg_df = df.withColumn(agg_col,
        (row) => {
            var values = newLabels.map(l => row.get(l))
            return values.reduce(evalFun(aggFun));
        })
    newLabels.forEach(l => {
        agg_df = agg_df.drop(l)
    })

    agg_df.show()

    return agg_df
}
function evalMergeReduce(df, df2) {
    console.log("EVAL MERGE! DF1")
    df.show()
    console.log("EVAL MERGE! DF2")
    df2.show()
    const df_cols = df.listColumns()
    const df2_cols = df2.listColumns().filter(col => col !== 'date')
    //rename df2 cols
    var df2_renamed = df2
    df2_cols.forEach(col => {
        var new_col_name = col
        while(true){
            if (df_cols.includes(new_col_name)) {
                new_col_name = new_col_name + "_2"
            }
            else{
                break
            }
        }
        df2_renamed = df2_renamed.rename(col, new_col_name)
    });
    console.log("EVAL MERGE! DF RENAMED")
    df2_renamed.show()
    const res = df.innerJoin(df2_renamed, ["date"])
    res.show()
    return res
}

function evalMerge(dfs) {
    return dfs.reduce( (part, a) => evalMergeReduce(part, a) )
}

export {
    evalSelect, //ok
    evalFilter, //ok
    evalResample,
    evalPreprocessing,
    evalAggregate, //ok
    evalMerge  //gestita con rename, è ok
}