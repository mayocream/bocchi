import { Link, Stack } from 'expo-router'
import { View, Image, Form, Input, Button, Separator } from 'tamagui'

export default function SignUp() {
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
        <Input placeholder='ユーザー名' />
        <Input placeholder='メールアドレス' keyboardType='email-address' />
        <Input placeholder='パスワード' secureTextEntry />
        <Input placeholder='パスワードの確認' secureTextEntry />
        <Form.Trigger asChild>
          <Button>新規登録</Button>
        </Form.Trigger>

        <Separator />

        <Link href='/sign-in' replace asChild>
          <Button variant='outlined'>ログイン</Button>
        </Link>
      </Form>
    </View>
  )
}
