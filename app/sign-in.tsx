import { ErrorMessage } from '@/components/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, router, Stack } from 'expo-router'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { View, Image, Form, Input, Button, Separator } from 'tamagui'
import { z } from 'zod'
import { getAuth, signInWithEmailAndPassword } from '@firebase/auth'
import { Alert } from 'react-native'
import { auth } from '@/lib/auth'

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
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
      email: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
      router.replace('/')
    } catch (e) {
      Alert.alert('エラー', String(e))
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
              placeholder='メールアドレス'
              keyboardType='email-address'
              onChangeText={onChange}
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
