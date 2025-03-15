import { ErrorMessage } from '@/components/input'
import { AuthenticationService } from '@/lib/api'
import { LoginRequest } from '@/lib/bocchi_pb'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Stack } from 'expo-router'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { View, Image, Form, Input, Button, Separator } from 'tamagui'
import { z } from 'zod'

const schema = z.object({
  handle: z.union([z.string().email(), z.string().min(3).max(20)]),
  password: z.string().min(8).max(255),
})

type FormData = z.infer<typeof schema>

export default function SignIn() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      handle: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    let request = new LoginRequest()
    if (data.handle.includes('@')) {
      request.setEmail(data.handle)
    } else {
      request.setUsername(data.handle)
    }
    request.setPassword(data.password)

    try {
      const response = await AuthenticationService.login(request)
      console.log(response.getAccessToken())
    } catch (error) {
      console.error(error)
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
              placeholder='メールまたはユーザー名'
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
          <Button onPress={handleSubmit(onSubmit)}>ログイン</Button>
        </Form.Trigger>

        <Separator />

        <Link href='/sign-up' replace asChild>
          <Button variant='outlined'>新規登録</Button>
        </Link>
      </Form>
    </View>
  )
}
