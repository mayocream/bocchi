import { ErrorMessage } from '@/components/input'
import { userService } from '@/lib/api'
import { LoginRequest } from '@/lib/bocchi_pb'
import { useAuthStore } from '@/lib/state'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, router, Stack } from 'expo-router'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { View, Image, Form, Input, Button, Separator } from 'tamagui'
import { z } from 'zod'

const schema = z.object({
  handle: z.union([z.string().email(), z.string().min(3)]),
  password: z.string(),
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
      handle: '',
      password: '',
    },
  })
  const authStore = useAuthStore()

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      let request = new LoginRequest()
      if (data.handle.includes('@')) {
        request.setEmail(data.handle)
      } else {
        request.setUsername(data.handle)
      }
      request.setPassword(data.password)
      const response = await userService.login(request)
      authStore.setAccessToken(response.getToken())

      router.replace('/')
    } catch (e) {
      console.error('Failed to login:', e)
      setError('handle', {
        type: 'manual',
        message: 'メールアドレスまたはパスワードが違います',
      })
    }
  }

  return (
    <View flex={1} justifyContent='center' alignItems='center'>
      <Stack.Screen
        options={{
          title: 'ログイン',
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
              placeholder='ユーザー名またはメールアドレス'
              keyboardType='email-address'
              onChangeText={onChange}
              {...props}
            />
          )}
          name='handle'
        />
        <ErrorMessage errors={errors} name='handle' />

        <Controller
          control={control}
          render={({ field: { onChange, ...props } }) => (
            <Input
              placeholder='パスワード'
              secureTextEntry
              onChangeText={onChange}
              {...props}
            />
          )}
          name='password'
        />
        <ErrorMessage errors={errors} name='password' />

        <Form.Trigger asChild>
          <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
            ログイン
          </Button>
        </Form.Trigger>

        <Separator />

        <Link href='/sign-up' replace asChild>
          {/* Known issue: Text is underscored on web */}
          <Button variant='outlined'>新規登録</Button>
        </Link>
      </Form>
    </View>
  )
}
