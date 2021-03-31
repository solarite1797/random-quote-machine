import { Button, Grid, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { getAllQuotes, getQuote } from '../../lib/quotes'
import Layout from '../../src/Layout'
import Link from 'next/link'
import Head from 'next/head'

const useStyles = makeStyles(theme => ({
    root: {
        textAlign: 'center',
        flexGrow: 1,
        maxWidth: theme.breakpoints.values.md
    },
    caption: {
        textAlign: 'right'
    }
}))

export default function Quote({ quote }) {
    const classes = useStyles()

    const nextQuote = `/quotes/${quote.next}`

    return (
        <Layout>
            <Head>
                <title>Random Quote Machine</title>
                <meta property="og:title" content="Random Quote Machine" />
                <meta property='og:type' content='article' />
                <meta
                    property="og:description"
                    content={quote.quote}
                />
            </Head>
            <Grid container className={classes.root} direction="column" alignItems="center">
                <Grid item xs></Grid>
                <Grid item>
                    <blockquote>
                        <Typography>
                            {'\u201C'}{quote.quote}{'\u201D'}
                        </Typography>
                    </blockquote>
                    <figcaption className={classes.caption}>— {quote.name}</figcaption>
                </Grid>
                <Grid item xs></Grid>
                <Grid item container spacing={2} justify="center">
                    <Grid item>
                        <Link href={nextQuote} passHref>
                            <Button variant="contained" color="primary">
                                Next Quote
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </Grid>
        </Layout>
    )
}

export async function getStaticProps({ params }) {
    const quote = await getQuote(params.id)

    return {
        props: { quote }
    }
}

export async function getStaticPaths() {
    const quotes = await getAllQuotes()

    return {
        paths: quotes.map((_, i) => {
            return {
                params: { id: i.toString() }
            }
        }),
        fallback: false
    }
}