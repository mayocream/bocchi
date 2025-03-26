import { useFonts } from 'expo-font'
import { useEffect } from 'react'
import Loading from './loading'

export default function FontLoader({
  children,
}: {
  children: React.ReactNode
}) {
  const [loaded, error] = useFonts({
    NotoSansCJK: require('../assets/fonts/NotoSansCJK.otf'),
  })

  useEffect(() => {
    if (loaded && !error) {
      console.info('Fonts loaded')
    }

    if (error) {
      console.error('Fonts failed to load')
    }
  }, [loaded, error])

  if (!loaded && !error) {
    return <Loading />
  }

  return <>{children}</>
}
