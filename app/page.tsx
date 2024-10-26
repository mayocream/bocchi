import Timeline from './timeline'

export default async function Page () {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/tweets`,
    {
      headers: {
        accept: 'application/json',
      },
    }
  )
  const tweets = await response.json()

  return <Timeline tweets={tweets} />
}
