import { bangumi } from '@/lib/bangumi'
import { useState, useEffect } from 'react'
import {
  XStack,
  YStack,
  Image,
  Input,
  Card,
  Spinner,
  SizableText,
} from 'tamagui'
import { FlatList } from 'react-native'

export default function Search() {
  const [searchText, setSearchText] = useState('')
  const [result, setResult] = useState<any[]>([])
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(false)

  const search = async (query: string, resetResults = false) => {
    if (!query || loading) return

    setLoading(true)

    const currentOffset = resetResults ? 0 : offset

    const response = await bangumi(
      '/v0/search/subjects',
      {
        limit: '20',
        offset: currentOffset.toString(),
      },
      {
        keyword: query,
      }
    )

    const newItems = response?.data || []

    if (resetResults) {
      setResult(newItems)
    } else {
      setResult((prev) => [...prev, ...newItems])
    }

    setOffset(currentOffset + newItems.length)
    setLoading(false)
  }

  // Reset and search when text changes
  useEffect(() => {
    if (searchText) {
      search(searchText, true)
    } else {
      setResult([])
      setOffset(0)
    }
  }, [searchText])

  return (
    <YStack fullscreen backgroundColor='$background'>
      <XStack padding='$3' alignItems='center'>
        <Input
          flex={1}
          placeholder='作品を検索'
          theme='blue'
          borderRadius='$10'
          paddingLeft='$3'
          value={searchText}
          onChangeText={setSearchText}
        />
      </XStack>

      <FlatList
        data={result}
        renderItem={({ item }) => (
          <Card
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
                source={{ uri: item.image }}
                aspectRatio={2 / 3}
                width='100%'
              />
            </Card>
            <SizableText size='$2' fontWeight='bold'>
              {item.name}
            </SizableText>
          </Card>
        )}
        keyExtractor={(item) => item.id}
        numColumns={3}
        onEndReached={() => search(searchText)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <Spinner size='small' /> : null}
      />
    </YStack>
  )
}
