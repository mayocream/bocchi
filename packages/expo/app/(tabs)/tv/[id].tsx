import { tmdb } from '@/lib/tmdb'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  YStack,
  XStack,
  Separator,
  SizableText,
  ToggleGroup,
  Text,
  Avatar,
  ScrollView,
  Button,
  Image,
  Paragraph,
} from 'tamagui'
import { REVIEW_STATUS } from '@/lib/types'
import {
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  Repeat,
  Star,
  TrendingUp,
  Tv,
  Users,
} from '@tamagui/lucide-icons'

export default function TvShow() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [data, setData] = useState<any>(null)
  const [credits, setCredits] = useState<any>(null)
  const [similar, setSimilar] = useState<any>(null)
  const [reviewStatus, setReviewStatus] = useState<REVIEW_STATUS | null>(null)
  const [liked, setLiked] = useState(false)
  const [retweeted, setRetweeted] = useState(false)

  // Load TV show data and additional details
  useEffect(() => {
    // Get main TV show data
    tmdb(`/tv/${id}`, { language: 'ja-JP' }).then(setData)

    // Get cast and crew
    tmdb(`/tv/${id}/credits`, { language: 'ja-JP' }).then(setCredits)

    // Get similar shows
    tmdb(`/tv/${id}/similar`, { language: 'ja-JP' }).then(setSimilar)
  }, [id])

  // Format date to Twitter style
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Calculate runtime display
  const formatRuntime = (minutes) => {
    if (!minutes) return ''
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours > 0 ? `${hours}時間` : ''}${mins > 0 ? ` ${mins}分` : ''}`
  }

  // Format voting as percentage
  const formatRating = (vote) => {
    if (!vote) return '評価なし'
    return `${Math.round(vote * 10)}%`
  }

  return (
    <ScrollView backgroundColor='#f5f8fa'>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Header Banner */}
      <YStack backgroundColor='#1DA1F2' height={150}>
        {data?.backdrop_path && (
          <Image
            source={{ uri: `https://tmdb.org/t/p/w780${data?.backdrop_path}` }}
            width='100%'
            height={150}
            opacity={0.8}
          />
        )}
      </YStack>

      {/* Profile Card */}
      <YStack
        backgroundColor='white'
        borderRadius={4}
        margin='$4'
        marginTop={-60}
        borderWidth={1}
        borderColor='#e1e8ed'
      >
        {/* Show info */}
        <XStack padding='$4' gap='$4' alignItems='flex-start'>
          <Image
            source={{ uri: `https://tmdb.org/t/p/w780${data?.poster_path}` }}
            width={200}
            height={200 * 1.5}
            borderRadius={4}
          />

          <YStack flex={1}>
            <SizableText size='$6' fontWeight='bold' color='#14171a'>
              {data?.name}
            </SizableText>

            {data?.tagline && (
              <SizableText color='#14171a'>{data.tagline}</SizableText>
            )}

            {/* Twitter bio-like metadata */}
            <XStack marginTop='$2' flexWrap='wrap' gap='$3'>
              {data?.status && (
                <XStack alignItems='center' gap='$1'>
                  <Tv size={14} color='#657786' />
                  <SizableText size='$2' color='#657786'>
                    {data.status}
                  </SizableText>
                </XStack>
              )}
              {data?.networks && data.networks.length > 0 && (
                <XStack alignItems='center' gap='$1'>
                  <TrendingUp size={14} color='#657786' />
                  <SizableText size='$2' color='#657786'>
                    {data.networks[0].name}
                  </SizableText>
                </XStack>
              )}
              {data?.vote_average > 0 && (
                <XStack alignItems='center' gap='$1'>
                  <Star size={14} color='#657786' />
                  <SizableText size='$2' color='#657786'>
                    {formatRating(data.vote_average)}
                  </SizableText>
                </XStack>
              )}
              {data?.first_air_date && (
                <XStack alignItems='center' gap='$1'>
                  <Calendar size={14} color='#657786' />
                  <SizableText size='$2' color='#657786'>
                    {formatDate(data.first_air_date)}
                  </SizableText>
                </XStack>
              )}
            </XStack>
          </YStack>
        </XStack>

        {/* Twitter follow button style toggle */}
        <YStack padding='$4' paddingTop={0}>
          <ToggleGroup
            type='single'
            orientation='horizontal'
            disableDeactivation
            backgroundColor='white'
            borderColor='#aab8c2'
            borderWidth={1}
            borderRadius='$full'
            onValueChange={(value) => setReviewStatus(value as REVIEW_STATUS)}
          >
            {[
              REVIEW_STATUS.TODO,
              REVIEW_STATUS.READING,
              REVIEW_STATUS.READ,
            ].map((type) => (
              <ToggleGroup.Item
                key={type}
                value={type}
                backgroundColor={
                  type === reviewStatus ? '#1DA1F2' : 'transparent'
                }
                flex={1}
                paddingVertical='$2'
                borderRadius='$full'
              >
                <Text
                  textAlign='center'
                  color={type === reviewStatus ? 'white' : '#657786'}
                  fontWeight={type === reviewStatus ? 'bold' : 'normal'}
                >
                  {type === REVIEW_STATUS.TODO && '見たい'}
                  {type === REVIEW_STATUS.READING && '見てる'}
                  {type === REVIEW_STATUS.READ && '見た'}
                </Text>
              </ToggleGroup.Item>
            ))}
          </ToggleGroup>
        </YStack>
      </YStack>

      {/* Main Tweet-like Card */}
      <YStack
        backgroundColor='white'
        padding='$4'
        margin='$4'
        marginTop='$2'
        borderRadius={4}
        borderWidth={1}
        borderColor='#e1e8ed'
      >
        {/* Show metadata */}
        <XStack gap='$4' marginBottom='$2' flexWrap='wrap'>
          {data?.episode_run_time && data.episode_run_time.length > 0 && (
            <YStack>
              <SizableText color='#657786'>放送時間</SizableText>
              <XStack alignItems='center' gap='$1'>
                <Clock size={14} color='#14171a' />
                <SizableText fontWeight='500' color='#14171a'>
                  {formatRuntime(data.episode_run_time[0])}
                </SizableText>
              </XStack>
            </YStack>
          )}

          {data?.number_of_episodes && (
            <YStack>
              <SizableText color='#657786'>エピソード数</SizableText>
              <SizableText fontWeight='500' color='#14171a'>
                {data.number_of_episodes}
              </SizableText>
            </YStack>
          )}

          {data?.number_of_seasons && (
            <YStack>
              <SizableText color='#657786'>シーズン数</SizableText>
              <SizableText fontWeight='500' color='#14171a'>
                {data.number_of_seasons}
              </SizableText>
            </YStack>
          )}

          {data?.popularity && (
            <YStack>
              <SizableText color='#657786'>人気度</SizableText>
              <XStack alignItems='center' gap='$1'>
                <Users size={14} color='#14171a' />
                <SizableText fontWeight='500' color='#14171a'>
                  {Math.round(data.popularity).toLocaleString()}
                </SizableText>
              </XStack>
            </YStack>
          )}
        </XStack>

        {/* Overview */}
        {data?.overview && (
          <YStack gap='$2' marginTop='$2'>
            <SizableText color='#14171a' fontWeight='400' lineHeight={22}>
              {data.overview}
            </SizableText>
          </YStack>
        )}

        {/* Tweet metadata */}
        <SizableText marginTop='$2' color='#657786' size='$2'>
          {formatDate(data?.first_air_date)} ·{' '}
          {data?.origin_country?.join(', ')} ·{' '}
          {data?.original_language === 'ja'
            ? '日本語'
            : data?.original_language}
        </SizableText>
      </YStack>

      {/* Cast & Crew as Follows/Following */}
      {credits?.cast && credits.cast.length > 0 && (
        <YStack
          backgroundColor='white'
          padding='$4'
          margin='$4'
          marginTop='$2'
          borderRadius={4}
          borderWidth={1}
          borderColor='#e1e8ed'
        >
          <SizableText fontWeight='bold' color='#14171a' marginBottom='$3'>
            キャスト
          </SizableText>
          <XStack flexWrap='wrap' gap='$4'>
            {credits.cast.map((person) => (
              <YStack key={person.id} alignItems='center' width={67}>
                <Avatar
                  circular
                  size='$6'
                  backgroundColor='#e1e8ed'
                  borderColor='#e1e8ed'
                  borderWidth={0.5}
                >
                  {person.profile_path ? (
                    <Avatar.Image
                      source={{
                        uri: `https://tmdb.org/t/p/w185${person.profile_path}`,
                      }}
                    />
                  ) : (
                    <Avatar.Fallback backgroundColor='#657786' />
                  )}
                </Avatar>
                <SizableText
                  size='$2'
                  color='#14171a'
                  textAlign='center'
                  marginTop='$1'
                  numberOfLines={1}
                >
                  {person.name}
                </SizableText>
                <SizableText
                  size='$1'
                  color='#657786'
                  textAlign='center'
                  numberOfLines={1}
                >
                  {person.character}
                </SizableText>
              </YStack>
            ))}
          </XStack>
        </YStack>
      )}

      {/* Genres as hashtags */}
      {data?.genres && data.genres.length > 0 && (
        <YStack
          backgroundColor='white'
          padding='$4'
          margin='$4'
          marginTop='$2'
          borderRadius={4}
          borderWidth={1}
          borderColor='#e1e8ed'
        >
          <SizableText color='#657786' marginBottom='$2'>
            ジャンル
          </SizableText>
          <XStack flexWrap='wrap' gap='$2'>
            {data.genres.map((genre) => (
              <YStack
                key={genre.id}
                backgroundColor='#EFF3F5'
                paddingHorizontal='$2'
                paddingVertical='$1'
                borderRadius='$full'
              >
                <SizableText color='#1DA1F2' size='$2'>
                  #{genre.name}
                </SizableText>
              </YStack>
            ))}
          </XStack>
        </YStack>
      )}

      {/* Similar shows as "You might like" */}
      {similar?.results && similar.results.length > 0 && (
        <YStack
          backgroundColor='white'
          padding='$4'
          margin='$4'
          marginTop='$2'
          marginBottom='$4'
          borderRadius={4}
          borderWidth={1}
          borderColor='#e1e8ed'
        >
          <SizableText fontWeight='bold' color='#14171a' marginBottom='$3'>
            おすすめの番組
          </SizableText>

          {similar.results.slice(0, 3).map((show) => (
            <YStack key={show.id} marginBottom='$3'>
              <XStack gap='$3'>
                <Avatar size='$5' borderRadius='$2'>
                  {show.poster_path ? (
                    <Avatar.Image
                      source={{
                        uri: `https://tmdb.org/t/p/w185${show.poster_path}`,
                      }}
                    />
                  ) : (
                    <Avatar.Fallback backgroundColor='#1DA1F2' />
                  )}
                </Avatar>

                <YStack flex={1}>
                  <SizableText fontWeight='bold' color='#14171a'>
                    {show.name}
                  </SizableText>
                  <SizableText size='$2' color='#657786'>
                    {formatDate(show.first_air_date)} •{' '}
                    {formatRating(show.vote_average)}
                  </SizableText>
                  <Paragraph
                    size='$2'
                    color='#14171a'
                    numberOfLines={2}
                    marginTop='$1'
                  >
                    {show.overview}
                  </Paragraph>
                </YStack>
              </XStack>
            </YStack>
          ))}
        </YStack>
      )}
    </ScrollView>
  )
}
