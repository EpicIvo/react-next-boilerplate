import React from 'react'
import DynamicComponent from '../components/DynamicComponent'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import Storyblok, { useStoryblok } from '../lib/storyblok'

export default function Page({ story, preview }) {
  const enableBridge = true // load the storyblok bridge everywhere
  // const enableBridge = preview; // enable bridge only in prevew mode
  story = useStoryblok(story, enableBridge)

  return (
    <div className={styles.container}>
      <Head>
        <title>{story ? story.name : 'My Site'}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <header>
        <h1>{story ? story.name : 'My Site'}</h1>
      </header>

      <DynamicComponent blok={story.content} />
    </div>
  )
}

export async function getServerSideProps({ query, params, preview = false }) {
  // join the slug array used in Next.js catch-all routes
  let slug = params.slug ? params.slug.join('/') : '/'

  let sbParams = {
    // change to `published` to load the published version
    version: 'published' // or published
  }

  if (preview) {
    // set the version to draft in the preview mode
    sbParams.version = 'draft'
    sbParams.cv = Date.now()
  }

  let { data } = await Storyblok.get(
    `cdn/stories/${slug}?from_release=${query._storyblok_release}`,
    sbParams
  )

  return {
    props: {
      story: data ? data.story : null,
      preview
    }
  }
}
