import { tmdb } from '@/lib/tmdb'
import { useEffect, useState } from 'react'
import {
  XStack,
  YStack,
  ScrollView,
  Image,
  Input,
  Card,
  Text,
  SizableText,
} from 'tamagui'

export default function TrendingAnime() {
  const [newTvShows, setNewTvShows] = useState<any>()
  const [onAirTvShows, setOnAirTvShows] = useState<any>()
  const [searchResult, setSearchResult] = useState<any>()

  const search = async (text: string) => {
    if (text.trim().length === 0) {
      setSearchResult(null)
      return
    }

    setSearchResult(
      await tmdb('/search/tv', {
        language: 'ja',
        query: text,
        include_adult: 'true',
      })
    )
  }

  const getTrending = async () => {
    setNewTvShows(
      await tmdb('/discover/tv', {
        sort_by: 'first_air_date.desc',
        language: 'ja',
        with_keywords: '210024-anime',
      })
    )

    setOnAirTvShows(
      await tmdb('/discover/tv', {
        'first_air_date.lte': new Date().toISOString(),
        sort_by: 'first_air_date.desc',
        language: 'ja',
        with_keywords: '210024-anime',
      })
    )
  }

  useEffect(() => {
    getTrending()
  }, [])

  const AnimeCard = ({ data }: { data: any }) => {
    return (
      <Card
        marginHorizontal='$0.5'
        marginBottom='$4'
        padding='$3'
        borderRadius='$4'
        borderColor='$borderColor'
        borderWidth={1}
        backgroundColor='transparent'
      >
        <XStack gap='$3' marginBottom='$2'>
          <YStack flex={1}>
            <Text fontWeight='bold'>{data?.original_name}</Text>
          </YStack>
        </XStack>

        {data?.overview && (
          <Text marginBottom='$2' numberOfLines={3}>
            {data?.overview}
          </Text>
        )}

        {(data?.backdrop_path || data?.poster_path) && (
          <Card overflow='hidden' borderRadius='$3' marginBottom='$2'>
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${
                  data?.backdrop_path || data?.poster_path
                }`,
              }}
              aspectRatio={16 / 9}
            />
          </Card>
        )}
      </Card>
    )
  }

  return (
    <YStack fullscreen backgroundColor='$background'>
      <XStack padding='$3' alignItems='center' gap='$2'>
        <Input
          flex={1}
          placeholder='アニメを検索'
          theme='blue'
          borderRadius='$10'
          paddingLeft='$3'
          borderWidth={0}
          keyboardType='web-search'
          onChangeText={(text) => search(text)}
        />
      </XStack>

      <ScrollView showsVerticalScrollIndicator={false} flex={1}>
        <YStack padding='$2'>
          {searchResult?.results.map((item: any) => (
            <AnimeCard key={item.id} data={item} />
          ))}

          <SizableText size='$6' padding='$2'>
            新着アニメ
          </SizableText>

          {newTvShows?.results
            .filter((item: any) => item?.backdrop_path || item?.poster_path)
            .map((item: any) => (
              <AnimeCard key={item.id} data={item} />
            ))}

          <SizableText size='$6' padding='$2'>
            放送中アニメ
          </SizableText>

          {onAirTvShows?.results
            .filter((item: any) => item?.backdrop_path || item?.poster_path)
            .map((item: any) => (
              <AnimeCard key={item.id} data={item} />
            ))}
        </YStack>
      </ScrollView>
    </YStack>
  )
}
