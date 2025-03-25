import { useState, useEffect } from 'react'
import {
  XStack,
  YStack,
  Input,
  Card,
  Spinner,
  SizableText,
  Tabs,
} from 'tamagui'
import { FlatList } from 'react-native'
import { router } from 'expo-router'
import { tmdb } from '@/lib/tmdb'
import { alert } from '@/lib/alert'
import { googleBooks } from '@/lib/google-books'
import { Image } from 'expo-image'

type Category = 'TV' | 'BOOKS'

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

export default function Search() {
  const [searchText, setSearchText] = useState('')
  const [result, setResult] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Category>('TV')

  async function searchTvShows(query: string, page: number) {
    if (!query.trim()) return

    try {
      setLoading(true)
      const response = await tmdb('/search/tv', {
        query,
        page: page.toString(),
        include_adult: 'true',
        language: 'ja-JP',
      })
      setResult((prev) =>
        page === 1 ? response.results : [...prev, ...response.results]
      )
    } catch (error) {
      alert('TV番組の検索中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  async function searchBooks(query: string, offset: number) {
    if (!query.trim()) return

    try {
      setLoading(true)
      const response = await googleBooks('/volumes', {
        q: query,
        startIndex: offset.toString(),
        maxResults: '20',
      })
      setResult((prev) =>
        offset === 0
          ? response.items || []
          : [...prev, ...(response.items || [])]
      )
    } catch (error) {
      alert('本の検索中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  function handleSearch() {
    if (!searchText.trim()) return

    setResult([])
    if (activeCategory === 'TV') {
      searchTvShows(searchText, 1)
    } else if (activeCategory === 'BOOKS') {
      searchBooks(searchText, 0)
    }
  }

  function handleLoadMore() {
    if (loading || !searchText.trim()) return

    if (activeCategory === 'TV') {
      const nextPage = Math.floor(result.length / 20) + 1
      searchTvShows(searchText, nextPage)
    } else if (activeCategory === 'BOOKS') {
      const offset = result.length
      searchBooks(searchText, offset)
    }
  }

  useEffect(() => {
    if (searchText.trim()) {
      setResult([])
      handleSearch()
    }
  }, [activeCategory])

  // Load default data
  useEffect(() => {
    setSearchText('百合')
    handleSearch()
  }, [])

  function renderItem({ item }: { item: any }) {
    const isTvShow = 'name' in item
    const link = isTvShow ? `/tv/${item.id}` : `/book/${item.id}`
    const name = isTvShow ? item.name : item.volumeInfo.title
    const posterPath = isTvShow
      ? `https://image.tmdb.org/t/p/w780${item.poster_path}`
      : item.volumeInfo.imageLinks?.thumbnail

    return (
      <Card
        onPress={() => router.push(link as any)}
        flex={1}
        minWidth='30%'
        maxWidth='33%'
        margin='$0.5'
        padding='$3'
        borderRadius='$4'
        borderColor='$borderColor'
        borderWidth={1}
        backgroundColor='transparent'
      >
        <Card overflow='hidden' borderRadius='$3' marginBottom='$2'>
          <Image
            source={posterPath}
            contentFit='cover'
            style={{ flex: 1, width: '100%', aspectRatio: 1 / 1.5 }}
            placeholder={{ blurhash }}
          />
        </Card>
        <SizableText
          size='$2'
          fontWeight='bold'
          numberOfLines={2}
          ellipsizeMode='tail'
        >
          {name}
        </SizableText>
      </Card>
    )
  }

  return (
    <YStack fullscreen backgroundColor='$background'>
      <XStack padding='$3' alignItems='center'>
        <Input
          flex={1}
          placeholder='作品を検索'
          theme='blue'
          borderRadius='$10'
          paddingLeft='$3'
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
      </XStack>

      <Tabs
        defaultValue='TV'
        orientation='horizontal'
        flexDirection='column'
        flex={1}
        borderRadius='$4'
        borderWidth='$0'
      >
        <Tabs.List
          disablePassBorderRadius='bottom'
          backgroundColor='$background'
          paddingHorizontal='$3'
          marginBottom='$2'
        >
          <Tabs.Tab
            flex={1}
            value='TV'
            onPress={() => setActiveCategory('TV')}
            backgroundColor={activeCategory === 'TV' ? '$blue5' : 'transparent'}
            borderRadius='$4'
          >
            <SizableText color={activeCategory === 'TV' ? '$color' : '$blue10'}>
              TV
            </SizableText>
          </Tabs.Tab>
          <Tabs.Tab
            flex={1}
            value='BOOKS'
            onPress={() => setActiveCategory('BOOKS')}
            backgroundColor={
              activeCategory === 'BOOKS' ? '$blue5' : 'transparent'
            }
            borderRadius='$4'
          >
            <SizableText
              color={activeCategory === 'BOOKS' ? '$color' : '$blue10'}
            >
              本
            </SizableText>
          </Tabs.Tab>
        </Tabs.List>

        <FlatList
          data={result}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <Spinner size='small' /> : null}
          contentContainerStyle={{ padding: 4 }}
        />
      </Tabs>
    </YStack>
  )
}
