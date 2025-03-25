import { Link, router, Stack } from 'expo-router'
import { View, Form, Input, Button, Separator } from 'tamagui'
import { z } from 'zod'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ErrorMessage } from '@/components/input'
import { Helmet } from 'react-helmet-async'
import { supabase } from '@/lib/supabase'
import { Image } from 'expo-image'

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
    <View flex={1} justifyContent='center' alignItems='center'>
      <Helmet>
        <title>新規登録</title>
      </Helmet>
      <Stack.Screen
        options={{
          title: '新規登録',
        }}
      />
      <Image
        source={require('../assets/images/logo.png')}
        style={{ height: 140, width: 140 }}
      />
      <Form gap={10} width={300}>
        <Controller
          control={control}
          render={({ field: { onChange, ...props } }) => (
            <Input
              onChangeText={onChange}
              placeholder='ユーザー名'
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
              {...props}
            />
          )}
          name='passwordConfirmation'
        />
        <ErrorMessage name='passwordConfirmation' errors={errors} />

        <Form.Trigger asChild>
          <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
            新規登録
          </Button>
        </Form.Trigger>

        <Separator marginVertical='$2' />

        <Link href='/sign-in' replace asChild>
          <Button variant='outlined'>ログイン</Button>
        </Link>
      </Form>
    </View>
  )
}
