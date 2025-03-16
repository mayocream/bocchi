import { Link, router, Stack } from 'expo-router'
import { View, Image, Form, Input, Button, Separator } from 'tamagui'
import { z } from 'zod'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ErrorMessage } from '@/components/input'
import { createUserWithEmailAndPassword } from '@firebase/auth'
import { auth } from '@/lib/auth'
import { Alert } from 'react-native'

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8).max(255),
    passwordConfirmation: z.string().min(8).max(255),
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
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  })
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password)
      router.replace('/')
    } catch (e) {
      Alert.alert('エラー', String(e))
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
          <Button onPress={handleSubmit(onSubmit)}>新規登録</Button>
        </Form.Trigger>

        <Separator marginVertical='$2' />

        <Link href='/sign-in' replace asChild>
          <Button variant='outlined'>ログイン</Button>
        </Link>
      </Form>
    </View>
  )
}
