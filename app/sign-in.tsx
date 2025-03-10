import { Link, Stack } from 'expo-router'
import { View, Image, Form, Input, Button, Separator } from 'tamagui'

export default function SignIn() {
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
        <Input
          placeholder='メールまたはユーザー名'
          keyboardType='email-address'
        />
        <Input placeholder='パスワード' secureTextEntry />
        <Form.Trigger asChild>
          <Button>ログイン</Button>
        </Form.Trigger>

        <Separator />

        <Link href='/sign-up' replace asChild>
          <Button variant='outlined'>新規登録</Button>
        </Link>
      </Form>
    </View>
  )
}
