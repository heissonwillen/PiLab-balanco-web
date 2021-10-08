const express = require("express")
const fs = require('fs')
const parse = require('csv-parse')

const app = express()

app.use(express.json())

const nestBalance = (arr, id, children) => {
    if (id === '0' && arr.length == 0) {
        arr.push(children[0])
    } else {
        arr.forEach(balance => {
            if (balance.id === id) {
                balance.children = [...(balance.children || []), ...children]
            } else {
                nestBalance(balance.children || [], id, children)
            }
        })
    }
}

app.get("/balance", (req, res) => {
    balanceList = []
    nestedBalances = []
    fs.createReadStream('categories.csv')
        .pipe(parse({ delimiter: '\t' }))
        .on('data', balRow => {
            balanceList.push(balRow)
        }).on('end', () => {
            fs.createReadStream('releases.csv')
                .pipe(parse({ delimiter: '\t' }))
                .on('data', rlsRow => {
                    balanceList.forEach(balRow => {
                        balRow[3] = parseInt(balRow[3])
                        if (balRow[0] == rlsRow[3]) {
                            balRow[3] += parseInt(rlsRow[1]) * parseInt(rlsRow[2])
                        }
                    })
                }).on('end', () => {
                    balanceList.forEach(row => {
                        const [id, name, father_id, initial_value] = row
                        nestBalance(nestedBalances, father_id, [{ id: id, name: name, value: initial_value }])
                    })
                    res.send(nestedBalances)
                })
        })
})


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))