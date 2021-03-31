import { Button, Grid, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import Layout from '../src/Layout'
import { useRouter } from 'next/router'
import { getAllQuotes } from '../lib/quotes'
import Head from 'next/head'
import Link from 'next/link'

const useStyles = makeStyles({
    root: {
        textAlign: 'center',
        flexGrow: 1
    }
})

const addQuoteLink =
    'https://github.com/lukadev-0/random-quote-machine/blob/master/README.md#add-your-own-quote'

export default function Index({ quotes }) {
    const classes = useStyles()
    const router = useRouter()

    function handleClick() {
        const id = Math.floor(Math.random() * quotes.length)

        router.push(`/quotes/${id}`)
    }

    return (
        <Layout>
            <Head>
                <title>Random Quote Machine</title>
                <meta property="og:title" content="Random Quote Machine" />
                <meta
                    property="og:description"
                    content="Get a random quote."
                />
            </Head>
            <Grid container className={classes.root} direction="column" alignItems="center">
                <Grid item xs></Grid>
                <Grid item>
                    <Typography variant="h4">
                        Random Quote Machine
                    </Typography>
                    <Typography>
                        Gives you a random quote from a list of quotes.
                    </Typography>
                </Grid>
                <Grid item xs></Grid>
                <Grid item container spacing={2} justify="center">
                    <Grid item>
                        <Link
                            href={addQuoteLink}
                            passHref
                        >
                            <Button variant="outlined" color="primary">
                                Add Quote
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item>
                        <Button onClick={handleClick} variant="contained" color="primary">
                            Get Quote
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Layout>
    )
}

export async function getStaticProps() {
    const quotes = await getAllQuotes()

    return {
        props: {
            quotes
        }
    }
}