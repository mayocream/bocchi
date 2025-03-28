import { Link, router, Stack } from 'expo-router'
import {
  View,
  Form,
  Input,
  Button,
  Separator,
  YStack,
  XStack,
  H3,
  Text,
} from 'tamagui'
import { z } from 'zod'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ErrorMessage } from '@/components/input'
import { Helmet } from 'react-helmet-async'
import { supabase } from '@/lib/supabase'
import { Image } from 'expo-image'
import Tagline from '@/components/tagline'

const schema = z
  .object({
    username: z
      .string()
      .min(3, 'ユーザー名は3文字以上で入力してください')
      .max(20, 'ユーザー名は20文字以下で入力してください')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'ユーザー名は半角英数字とアンダースコアのみ使用できます'
      ),
    email: z.string().email('正しいメールアドレスを入力してください'),
    password: z
      .string()
      .min(8, 'パスワードは8文字以上で入力してください')
      .max(255, 'パスワードは255文字以下で入力してください'),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'パスワードが一致しません',
  })
  .refine(
    async (form) => {
      const { data } = await supabase
        .from('profiles')
        .select()
        .eq('username', form.username)

      return data === null || data.length === 0
    },
    {
      path: ['username'],
      message: 'ユーザー名が既に使用されています',
    }
  )

type FormData = z.infer<typeof schema>

export default function SignUp() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  })

  const onSubmit: SubmitHandler<FormData> = async (form) => {
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          username: form.username,
          name: '',
        },
      },
    })

    if (error) {
      setError('email', {
        type: 'manual',
        message: error.message,
      })
      return
    }

    router.replace('/')
  }

  return (
    <>
      <Helmet>
        <title>新規登録</title>
      </Helmet>
      <Stack.Screen
        options={{
          title: '新規登録',
        }}
      />
      <XStack
        fullscreen
        flex={1}
        justifyContent='center'
        alignItems='center'
        backgroundColor='$background'
      >
        <Tagline />
        <YStack width={600} justifyContent='center' alignItems='center'>
          <YStack width={350} alignItems='center' padding={20}>
            <Image
              source={require('../assets/images/logo.png')}
              style={{ height: 80, width: 80, marginBottom: 15 }}
            />

            <H3 fontWeight={600} color='#292f33' marginBottom={8}>
              アカウントを作成
            </H3>

            <Text color='#66757f' fontSize={14} marginBottom={20}>
              Eki に登録して会話に参加しましょう。
            </Text>

            <Form gap={12} width='100%'>
              <Controller
                control={control}
                render={({ field: { onChange, ...props } }) => (
                  <Input
                    onChangeText={onChange}
                    placeholder='ユーザー名'
                    borderColor='#e1e8ed'
                    borderRadius={4}
                    height={40}
                    fontSize={14}
                    {...props}
                  />
                )}
                name='username'
              />
              <ErrorMessage name='username' errors={errors} />

              <Controller
                control={control}
                render={({ field: { onChange, ...props } }) => (
                  <Input
                    onChangeText={onChange}
                    placeholder='メールアドレス'
                    keyboardType='email-address'
                    borderColor='#e1e8ed'
                    borderRadius={4}
                    height={40}
                    fontSize={14}
                    {...props}
                  />
                )}
                name='email'
              />
              <ErrorMessage name='email' errors={errors} />

              <Controller
                control={control}
                render={({ field: { onChange, ...props } }) => (
                  <Input
                    onChangeText={onChange}
                    placeholder='パスワード'
                    secureTextEntry
                    borderColor='#e1e8ed'
                    borderRadius={4}
                    height={40}
                    fontSize={14}
                    {...props}
                  />
                )}
                name='password'
              />
              <ErrorMessage name='password' errors={errors} />

              <Controller
                control={control}
                render={({ field: { onChange, ...props } }) => (
                  <Input
                    onChangeText={onChange}
                    placeholder='パスワードの確認'
                    secureTextEntry
                    borderColor='#e1e8ed'
                    borderRadius={4}
                    height={40}
                    fontSize={14}
                    {...props}
                  />
                )}
                name='passwordConfirmation'
              />
              <ErrorMessage name='passwordConfirmation' errors={errors} />

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
                  新規登録
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
                onPress={() => router.push('/sign-in')}
                variant='outlined'
                backgroundColor='#fff'
                color='#1da1f2'
                borderWidth={1}
                borderColor='#1da1f2'
                fontWeight={600}
                fontSize={14}
                borderRadius={100}
                height={36}
              >
                ログイン
              </Button>
            </Form>
          </YStack>
        </YStack>
      </XStack>
    </>
  )
}
