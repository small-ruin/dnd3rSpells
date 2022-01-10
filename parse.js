const { readFile, writeFileSync, appendFile, readdirSync } = require('fs')
const { join } = require('path')

const rst = {}
const carry = []

function readLine(line) {
    if (/^\*\*(?!持续时间|法术抗力|距离|施法材料|施法时间|范围|豁免检定|等级|变化系|预言系|塑能系|施法器材|法术成分|完美奥术|注：|献祭|时效|\*|（|XP).+\*\*$/.exec(line)) {
        line = line.replace(/\s|\*/g, '')
        if (carry.length === 2) {
            rst[carry[0]] = carry[1]
        }
        carry.length = 0
        carry[0] = line
    } else {
        const cline = line.replace(/\*|\||-{3,}/g, '').replace(/\r|\n/, '').trim().replace(/\s{4,}/g, '\t')
        if (!cline) return
        if (!carry[1])
            carry[1] = cline
        else
            carry[1] += '\r\n' + cline
    }
}

function main() {
    let count = 0
    readdirSync(__dirname).forEach(f => {
        if (/.md/.exec(f) && f !== 'README.md') {
            count++
            readFile(join(__dirname, f), (err, content) => {
                if (err) throw err
                content = content.toString().split('\n').filter(i => i).map(i => i.trim())
                content.forEach(readLine)
                count--

                if (count === 0) {
                    console.log('写入法术', Object.keys(rst).length, '个')
                    writeFileSync('3r_spells.json', JSON.stringify(rst))
                }
            })
        }
    })



}

main()