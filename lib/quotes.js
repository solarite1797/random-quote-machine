import { readFile } from 'fs/promises'
import { parse } from 'yaml'
import { join } from 'path'

export async function getAllQuotes() {
    const file = await readFile(join(process.cwd(), 'quotes.yaml'), {
        encoding: 'utf-8'
    })

    return parse(file)
}

export async function getQuote(i) {
    const quotes = await getAllQuotes()

    const next = (Number(i) + 1) % quotes.length

    return {
        ...quotes[i],
        next
    }
}