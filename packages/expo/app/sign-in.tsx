import { ErrorMessage } from '@/components/input'
import { supabase } from '@/lib/supabase'
import { zodResolver } from '@hookform/resolvers/zod'
import { router, Stack } from 'expo-router'
import { Helmet } from 'react-helmet-async'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { Form, Input, Button, XStack, YStack, H3, Text } from 'tamagui'
import { z } from 'zod'
import { Image } from 'expo-image'
import Tagline from '@/components/tagline'

const schema = z.object({
  email: z.string().email('メールアドレスが無効です'),
  password: z.string().min(8, 'パスワードは8文字以上である必要があります'),
})

type FormData = z.infer<typeof schema>

export default function SignIn() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const onSubmit: SubmitHandler<FormData> = async (form) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) {
      return setError('email', {
        type: 'manual',
        message: error.message,
      })
    }

    router.replace('/')
  }

  return (
    <YStack>
      <Helmet>
        <title>ログイン</title>
      </Helmet>
      <Stack.Screen
        options={{
          title: 'ログイン',
        }}
      />
      <XStack
        flex={1}
        justifyContent='center'
        alignItems='center'
        backgroundColor='$background'
      >
        <Tagline />
        <XStack width={600} justifyContent='center'>
          <YStack width={350} alignItems='center' padding={20}>
            <Image
              source={require('../assets/images/logo.png')}
              style={{ height: 80, width: 80, marginBottom: 15 }}
            />

            <H3 fontWeight={600} color='#292f33' marginBottom={8}>
              ログイン
            </H3>

            <Text color='#66757f' fontSize={14} marginBottom={20}>
              Eki にログインして会話に参加しましょう。
            </Text>

            <Form gap={12} width='100%'>
              <Controller
                control={control}
                render={({ field: { onChange, ...props } }) => (
                  <Input
                    placeholder='メールアドレス'
                    keyboardType='email-address'
                    onChangeText={onChange}
                    borderColor='#e1e8ed'
                    borderRadius={4}
                    height={40}
                    fontSize={14}
                    {...props}
                  />
                )}
                name='email'
              />
              <ErrorMessage errors={errors} name='email' />

              <Controller
                control={control}
                render={({ field: { onChange, ...props } }) => (
                  <Input
                    placeholder='パスワード'
                    secureTextEntry
                    onChangeText={onChange}
                    borderColor='#e1e8ed'
                    borderRadius={4}
                    height={40}
                    fontSize={14}
                    {...props}
                  />
                )}
                name='password'
              />
              <ErrorMessage errors={errors} name='password' />

              <Form.Trigger asChild>
                <Button
                  onPress={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  backgroundColor='#1da1f2'
                  color='#fff'
                  fontWeight={600}
                  fontSize={14}
                  borderRadius={100}
                  height={36}
                  marginTop={10}
                  hoverStyle={{ backgroundColor: '#0c85d0' }}
                >
                  ログイン
                </Button>
              </Form.Trigger>

              <XStack
                justifyContent='space-between'
                alignItems='center'
                marginVertical={15}
              >
                <YStack height={1} backgroundColor='#e1e8ed' flex={1} />
                <Text color='#657786' fontSize={12} paddingHorizontal={10}>
                  または
                </Text>
                <YStack height={1} backgroundColor='#e1e8ed' flex={1} />
              </XStack>

              <Button
                variant='outlined'
                onPress={() => router.push('/sign-up')}
                backgroundColor='#fff'
                color='#1da1f2'
                borderWidth={1}
                borderColor='#1da1f2'
                fontWeight={600}
                fontSize={14}
                borderRadius={100}
                height={36}
                hoverStyle={{ backgroundColor: '#e8f5fe' }}
              >
                新規登録
              </Button>
            </Form>
          </YStack>
        </XStack>
      </XStack>
    </YStack>
  )
}
