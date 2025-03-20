import { Link, router, Stack } from 'expo-router'
import { View, Image, Form, Input, Button, Separator } from 'tamagui'
import { z } from 'zod'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ErrorMessage } from '@/components/input'
import { userService } from '@/lib/api'
import { RegisterRequest } from '@/lib/bocchi_pb'
import { useAuthStore } from '@/lib/state'

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

  const authStore = useAuthStore()

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const request = new RegisterRequest()
      request.setUsername(data.username)
      request.setEmail(data.email)
      request.setPassword(data.password)
      const response = await userService.register(request)
      authStore.setAccessToken(response.getToken())

      router.replace('/')
    } catch (e) {
      console.error('Failed to register:', e)
      setError('username', {
        type: 'manual',
        message: 'ユーザー名が既に使用されています',
      })
    }
  }

  return (
    <View flex={1} justifyContent='center' alignItems='center'>
      <Stack.Screen
        options={{
          title: '新規登録',
        }}
      />
      <Image
        source={require('../assets/images/logo.png')}
        width={140}
        height={140}
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
