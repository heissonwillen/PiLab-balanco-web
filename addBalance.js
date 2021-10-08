require('util').inspect.defaultOptions.depth = null

const balances = []

const addBalance = (arr, id, children) => {
    if (id === '0' && arr.length == 0) {
        balances.push(children[0])
    } else {
        arr.forEach(balance => {
            if (balance.id === id) {
                balance.children = [...(balance.children || []), ...children]
            } else {
                addBalance(balance.children || [], id, children)
            }
        })
    }
}

addBalance(balances, '0', [{ id: '1', name: 'Ativos', value: 0 }])
addBalance(balances, '1', [{ id: '2', name: 'Ativo Circulante', value: 0 }])
console.log(balances)