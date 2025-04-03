import { tmdb } from '@/lib/tmdb'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  YStack,
  XStack,
  SizableText,
  ToggleGroup,
  Text,
  Avatar,
  ScrollView,
  Paragraph,
} from 'tamagui'
import { WATCH_STATUS } from '@/lib/types'
import {
  Calendar,
  Clock,
  Star,
  TrendingUp,
  Tv,
  Users,
  Briefcase,
} from '@tamagui/lucide-icons'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/lib/state'
import { Image } from 'expo-image'
import { ImageViewer } from '@/components/image-viewer'
import { Platform, Pressable } from 'react-native'

export default function TvShow() {
  const { user } = useUserStore()
  const { id } = useLocalSearchParams<{ id: string }>()
  const [data, setData] = useState<any>(null)
  const [credits, setCredits] = useState<any>(null)
  const [similar, setSimilar] = useState<any>(null)
  const [images, setImages] = useState<any>(null)
  const [watchStatus, setWatchStatus] = useState<WATCH_STATUS | null>(null)

  // Load TV show data and additional details
  useEffect(() => {
    // Get main TV show data
    tmdb(`/tv/${id}`, { language: 'ja-JP' }).then(setData)

    // Get cast and crew
    tmdb(`/tv/${id}/credits`, { language: 'ja-JP' }).then(setCredits)

    // Get similar shows
    tmdb(`/tv/${id}/similar`, { language: 'ja-JP' }).then(setSimilar)

    // Get images
    tmdb(`/tv/${id}/images`, { include_image_language: 'ja,null' }).then(
      setImages
    )
  }, [id])

  // Load watch status
  useEffect(() => {
    supabase
      .from('watch_status')
      .select()
      .eq('tmdb_id', id)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          console.log('Watch status:', data)
          setWatchStatus(data.status as WATCH_STATUS)
        }
      })
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
    <ScrollView backgroundColor='#f5f8fa' showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: data?.name,
        }}
      />

      {/* Header Banner */}
      <YStack backgroundColor='#1DA1F2' height={150}>
        {data?.backdrop_path && (
          <Image
            source={{ uri: `https://tmdb.org/t/p/w1280${data?.backdrop_path}` }}
            style={{
              width: '100%',
              height: 150,
              opacity: 0.8,
            }}
          />
        )}
      </YStack>

      {/* Profile Card */}
      <YStack
        opacity={0.93}
        backgroundColor='white'
        borderRadius={4}
        margin='$4'
        marginTop={-60}
        borderWidth={1}
        borderColor='#e1e8ed'
      >
        {/* Show info */}
        <XStack padding='$4' gap='$4' alignItems='flex-start'>
          <XStack flex={1} width='40%' $platform-web={{ height: 300 }}>
            <ImageViewer
              source={{ uri: `https://tmdb.org/t/p/w1280${data?.poster_path}` }}
              style={{
                borderRadius: 1,
                width: '100%',
                height: Platform.OS === 'web' ? '100%' : undefined,
                aspectRatio: 1 / 1.5,
              }}
            />
          </XStack>

          <YStack flex={1} width='60%'>
            {/* Show logo */}
            {images?.logos.length > 0 && (
              <Image
                source={{
                  uri: `https://tmdb.org/t/p/w1280${images.logos[0].file_path}`,
                }}
                style={{
                  height: 100,
                  width: '100%',
                  borderRadius: 4,
                }}
                contentFit='contain'
              />
            )}

            {images?.logos.length === 0 && (
              <SizableText size='$6' fontWeight='bold' color='#14171a'>
                {data?.name}
              </SizableText>
            )}

            {data?.tagline && (
              <SizableText color='#14171a'>{data.tagline}</SizableText>
            )}

            {/* Show logo if available */}
            {data?.networks &&
              data.networks.length > 0 &&
              data.networks[0].logo_path && (
                <Image
                  source={{
                    uri: `https://tmdb.org/t/p/w1280${data.networks[0].logo_path}`,
                  }}
                  style={{
                    width: 80,
                    height: 30,
                    marginTop: 8,
                  }}
                  contentFit='contain'
                />
              )}

            {/* Twitter bio-like metadata */}
            <XStack marginTop='$2' flexWrap='wrap' gap='$2'>
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
        {user && (
          <YStack padding='$4' paddingTop={0}>
            <ToggleGroup
              type='single'
              orientation='horizontal'
              disableDeactivation
              borderColor='#aab8c2'
              borderWidth={1}
              borderRadius='$full'
              onValueChange={(value) => {
                setWatchStatus(value as WATCH_STATUS)
                supabase
                  .from('watch_status')
                  .insert({
                    user_id: user?.id,
                    tmdb_id: id,
                    status: value,
                  })
                  .then((res) => {
                    console.info('Inserted watch status:', res)
                  })
              }}
            >
              {[
                WATCH_STATUS.WANT,
                WATCH_STATUS.WATCHING,
                WATCH_STATUS.WATCHED,
              ].map((type) => (
                <ToggleGroup.Item
                  key={type}
                  value={type}
                  backgroundColor={
                    type === watchStatus ? '#1DA1F2' : 'transparent'
                  }
                  flex={1}
                  paddingVertical='$2'
                  borderRadius='$full'
                  hoverStyle={{
                    backgroundColor:
                      type === watchStatus ? '#1DA1F2' : '#e1e8ed',
                  }}
                  focusStyle={{
                    backgroundColor: '#1DA1F2',
                  }}
                >
                  <Text
                    textAlign='center'
                    color={type === watchStatus ? 'white' : '#657786'}
                    fontWeight={type === watchStatus ? 'bold' : 'normal'}
                  >
                    {type === WATCH_STATUS.WANT && '見たい'}
                    {type === WATCH_STATUS.WATCHING && '見てる'}
                    {type === WATCH_STATUS.WATCHED && '見た'}
                  </Text>
                </ToggleGroup.Item>
              ))}
            </ToggleGroup>
          </YStack>
        )}
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
          {data?.episode_run_time?.length > 0 && (
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

          {data?.number_of_episodes !== undefined && (
            <YStack>
              <SizableText color='#657786'>エピソード数</SizableText>
              <SizableText fontWeight='500' color='#14171a'>
                {data.number_of_episodes}
              </SizableText>
            </YStack>
          )}

          {data?.number_of_seasons !== undefined && (
            <YStack>
              <SizableText color='#657786'>シーズン数</SizableText>
              <SizableText fontWeight='500' color='#14171a'>
                {data.number_of_seasons}
              </SizableText>
            </YStack>
          )}

          {data?.popularity !== undefined && (
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
        {data?.overview !== undefined && (
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

      {/* All Crew */}
      {credits?.crew.length > 0 && (
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
            スタッフ
          </SizableText>

          {/* Group crew by department */}
          {Object.entries(
            credits.crew.reduce((acc, person) => {
              if (!acc[person.department]) {
                acc[person.department] = []
              }
              acc[person.department].push(person)
              return acc
            }, {})
          ).map(([department, people]: any) => (
            <YStack key={department} marginBottom='$4'>
              <SizableText color='#14171a' fontWeight='600' marginVertical='$2'>
                {department}
              </SizableText>
              <XStack flexWrap='wrap' gap='$4'>
                {people.map((person) => (
                  <YStack
                    key={`${person.id}-${person.job}`}
                    alignItems='center'
                    width={67}
                  >
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
                      numberOfLines={2}
                    >
                      {person.job}
                    </SizableText>
                  </YStack>
                ))}
              </XStack>
            </YStack>
          ))}
        </YStack>
      )}

      {/* Production Companies */}
      {data?.production_companies !== undefined &&
        data.production_companies.length > 0 && (
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
              制作会社
            </SizableText>
            <XStack flexWrap='wrap' gap='$4'>
              {data.production_companies.map((company) => (
                <YStack key={company.id} alignItems='center' width={80}>
                  <YStack
                    height={60}
                    width={80}
                    alignItems='center'
                    justifyContent='center'
                  >
                    {company.logo_path ? (
                      <Image
                        source={{
                          uri: `https://tmdb.org/t/p/w154${company.logo_path}`,
                        }}
                        style={{
                          width: 70,
                          height: 50,
                        }}
                        contentFit='contain'
                      />
                    ) : (
                      <XStack
                        width={50}
                        height={50}
                        backgroundColor='#e1e8ed'
                        alignItems='center'
                        justifyContent='center'
                        borderRadius='$2'
                      >
                        <Briefcase size={24} color='#657786' />
                      </XStack>
                    )}
                  </YStack>
                  <SizableText
                    size='$2'
                    color='#14171a'
                    textAlign='center'
                    marginTop='$1'
                    numberOfLines={2}
                  >
                    {company.name}
                  </SizableText>
                </YStack>
              ))}
            </XStack>
          </YStack>
        )}

      {/* Cast & Crew as Follows/Following */}
      {credits?.cast.length > 0 && (
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
                  numberOfLines={2}
                >
                  {person.character}
                </SizableText>
              </YStack>
            ))}
          </XStack>
        </YStack>
      )}

      {/* Genres as hashtags */}
      {data?.genres.length > 0 && (
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
      {similar?.results.length > 0 && (
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

          {similar.results
            .filter((show) => show.genre_ids.includes(16))
            .map((show) => (
              <Pressable
                onPress={() => router.push(`/tv/${show.id}`)}
                key={show.id}
              >
                <YStack marginBottom='$3'>
                  <XStack gap='$3'>
                    <Avatar size='$5' borderRadius='$2'>
                      {show.poster_path ? (
                        <Avatar.Image
                          source={{
                            uri: `https://tmdb.org/t/p/w154${show.poster_path}`,
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
              </Pressable>
            ))}
        </YStack>
      )}
    </ScrollView>
  )
}
