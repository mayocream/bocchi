import { Theme, Button, Heading, Text, Flex, Container } from '@radix-ui/themes'

export default function WaitlistPage() {
  const discordInviteLink = 'https://discord.gg/gatVnbYSNV'

  return (
    <Theme appearance='light' accentColor='blue'>
      <main className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <Container size='2'>
          <Flex
            direction='column'
            gap='4'
            className='bg-white p-8 rounded-lg shadow-md'
          >
            <Heading size='8' className='text-center'>
              クラシックTwitterが開発中！
            </Heading>
            <Text size='4' className='text-center text-gray-600'>
              クラシックTwitterの最新情報を受け取り、コミュニティと交流しましょう。
            </Text>

            <Flex justify='center' className='mt-4'>
              <Button
                asChild
                size='3'
                className='bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-full transition duration-300'
              >
                <a
                  href={discordInviteLink}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Discordに参加
                </a>
              </Button>
            </Flex>

            <Text size='2' className='text-center text-gray-500 mt-4'>
              クリックするとDiscordの招待ページに移動します。
            </Text>
          </Flex>
        </Container>
      </main>
    </Theme>
  )
}
