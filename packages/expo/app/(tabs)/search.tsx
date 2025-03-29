import { useState, useEffect } from 'react'
import {
  XStack,
  YStack,
  Input,
  Card,
  Spinner,
  SizableText,
  Button,
} from 'tamagui'
import { FlatList } from 'react-native'
import { router } from 'expo-router'
import { tmdb } from '@/lib/tmdb'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import { Star } from '@tamagui/lucide-icons'

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

export default function Search() {
  const [searchText, setSearchText] = useState('')
  const [result, setResult] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  async function searchAnime(query, page) {
    if (loading) return

    try {
      setLoading(true)

      const params: any = {
        page: page.toString(),
        include_adult: 'false',
        language: 'ja-JP',
        with_genres: '16', // Animation genre
        with_origin_country: 'JP', // Japanese origin
        sort_by: 'first_air_date.desc', // only for discover endpoint
      }

      // Add query if provided
      if (query.trim()) {
        params.query = query
      }

      // Use search or discover endpoint based on query presence
      const endpoint = query.trim() ? '/search/tv' : '/discover/tv'
      const response = await tmdb(endpoint, params)

      // filter results to include only anime
      const filteredResults = response.results.filter(
        (item) =>
          item.poster_path &&
          item.genre_ids.includes(16) &&
          item.original_language.startsWith('ja')
      )

      setCurrentPage(page)
      setTotalPages(response.total_pages)
      setResult(page === 1 ? filteredResults : [...result, ...filteredResults])
    } catch (error) {
      console.error('Error searching anime:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    searchAnime('', 1)
  }, [])

  function renderItem({ item }) {
    const posterUrl = item.poster_path
      ? `https://image.tmdb.org/t/p/w780${item.poster_path}`
      : null

    return (
      <Card
        onPress={() => router.push(`/tv/${item.id}`)}
        flex={1}
        minWidth='30%'
        maxWidth='33%'
        margin='$0.5'
        padding='$2'
        borderRadius='$4'
        borderColor='$borderColor'
        borderWidth={1}
      >
        {/* Poster image */}
        <Card overflow='hidden' borderRadius='$3' marginBottom='$2'>
          <Image
            source={posterUrl}
            style={{ width: '100%', aspectRatio: 1 / 1.5 }}
            placeholder={{ blurhash }}
          />
        </Card>

        {/* Title */}
        <SizableText
          size='$2'
          fontWeight='bold'
          numberOfLines={2}
          ellipsizeMode='tail'
        >
          {item.name}
        </SizableText>

        {/* Rating and year */}
        <XStack alignItems='center' gap='$2' marginTop='$1'>
          <XStack alignItems='center' gap='$0.5'>
            <Star size={12} color='gold' fill='gold' />
            <SizableText size='$1'>
              {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
            </SizableText>
          </XStack>

          {item.first_air_date && (
            <SizableText size='$1'>
              {item.first_air_date.substring(0, 4)}
            </SizableText>
          )}
        </XStack>
      </Card>
    )
  }

  return (
    <YStack backgroundColor='$background'>
      {/* Search */}
      <XStack padding='$3' gap='$2'>
        <Input
          flex={1}
          placeholder='作品を検索'
          theme='blue'
          borderRadius='$10'
          paddingLeft='$3'
          onChangeText={setSearchText}
          onSubmitEditing={() => {
            setCurrentPage(1)
            searchAnime(searchText, 1)
          }}
        />
        <Button
          theme='blue'
          onPress={() => {
            setCurrentPage(1)
            searchAnime(searchText, 1)
          }}
        >
          検索
        </Button>
      </XStack>

      {/* Results */}
      <FlashList
        estimatedItemSize={200}
        data={result}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        onEndReached={() => {
          if (loading || currentPage >= totalPages) return
          searchAnime(searchText, currentPage + 1)
        }}
        onEndReachedThreshold={0.05}
        ListFooterComponent={loading ? <Spinner /> : null}
        ListEmptyComponent={
          <YStack height={200} justifyContent='center' alignItems='center'>
            <SizableText>結果がありません</SizableText>
          </YStack>
        }
        contentContainerStyle={{ padding: 4 }}
        showsVerticalScrollIndicator={false}
      />
    </YStack>
  )
}
