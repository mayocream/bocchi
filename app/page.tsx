import {
  Theme,
  Container,
  Flex,
  Box,
  Text,
  Button,
  Grid,
  Card,
  Section,
  Separator,
} from '@radix-ui/themes'
import {
  ChevronRightIcon,
  CodeSandboxLogoIcon,
  RocketIcon,
  LightningBoltIcon,
  MixerHorizontalIcon,
  AccessibilityIcon,
  HeartIcon,
} from '@radix-ui/react-icons'
import { Noto_Serif_JP, Noto_Sans_JP } from 'next/font/google'
import * as motion from 'framer-motion/client'

const NotoSerifJP = Noto_Serif_JP({ weight: '600', subsets: ['latin'] })
const NotoSansJP = Noto_Sans_JP({ weight: ['400', '700'], subsets: ['latin'] })

const GradientText = ({ children, gradient }) => (
  <span
    style={{
      background: gradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      display: 'inline-block',
    }}
  >
    {children}
  </span>
)

const Hero = () => (
  <Section size={{ initial: '2', sm: '3' }} pb={{ initial: '6', sm: '9' }}>
    <Flex direction='column' align='center' gap='6'>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Text
          size={{ initial: '8', sm: '9' }}
          weight='bold'
          align='center'
          className={NotoSerifJP.className}
          style={{ maxWidth: '20ch' }}
        >
          <GradientText gradient='linear-gradient(135deg, #4CAF50, #8BC34A, #2E8B57)'>
            クリエイターのための Twitter
          </GradientText>
        </Text>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <Text
          size={{ initial: '4', sm: '5' }}
          align='center'
          style={{ maxWidth: '50ch' }}
          className={NotoSansJP.className}
        >
          Twitter JP
          は、クリエイターのための新しいソーシャルメディアプラットフォームです。
          <p>
            <b>昔ながらの Twitter とおなじように。</b>
          </p>
        </Text>
      </motion.div>
      <Flex gap='4' wrap='wrap' justify='center'>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            asChild
            size={{ initial: '3', sm: '4' }}
            style={{ background: 'linear-gradient(135deg, #4CAF50, #8BC34A)' }}
          >
            <a href='/dashboard'>
              始めましょう
              <ChevronRightIcon />
            </a>
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            asChild
            size={{ initial: '3', sm: '4' }}
            variant='soft'
            style={{ color: '#2E8B57' }}
          >
            <a
              href='https://discord.gg/gatVnbYSNV'
              rel='noopener noreferrer'
              target='_blank'
            >
              Discord に参加
            </a>
          </Button>
        </motion.div>
      </Flex>
    </Flex>
  </Section>
)

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <Card
      style={{
        backdropFilter: 'blur(10px)',
        transition: 'background 0.3s ease',
      }}
    >
      <Flex direction='column' gap='2'>
        <Box style={{ color: '#4CAF50' }}>
          <Icon width={24} height={24} />
        </Box>
        <Text
          size={{ initial: '5', sm: '6' }}
          weight='bold'
          className={NotoSansJP.className}
          style={{ color: '#2E8B57' }}
        >
          {title}
        </Text>
        <Text size={{ initial: '2', sm: '3' }} className={NotoSansJP.className}>
          {description}
        </Text>
      </Flex>
    </Card>
  )
}

const Features = () => (
  <Section size={{ initial: '2', sm: '3' }}>
    <Text
      size={{ initial: '7', sm: '8' }}
      weight='bold'
      mb='6'
      className={NotoSerifJP.className}
      style={{ color: '#2E8B57' }}
    >
      <GradientText gradient='linear-gradient(135deg, #2E8B57, #4CAF50)'>
        主な特徴
      </GradientText>
    </Text>
    <Grid className='mt-4' columns={{ initial: '1', sm: '2', lg: '3' }} gap='6'>
      <FeatureCard
        icon={CodeSandboxLogoIcon}
        title='サーバーレス'
        description='インフラストラクチャの管理不要。スケーラブルで効率的な運用が可能です。'
      />
      <FeatureCard
        icon={RocketIcon}
        title='Cloudflare CDN'
        description='世界中のエッジロケーションを活用し、高速なコンテンツ配信を実現。'
      />
      <FeatureCard
        icon={LightningBoltIcon}
        title='高パフォーマンス'
        description='最適化された設計により、高速な応答時間とスムーズな操作性を提供。'
      />
      <FeatureCard
        icon={HeartIcon}
        title='永久無料'
        description='基本機能は永久に無料。追加コストなしで始められます。'
      />
      <FeatureCard
        icon={MixerHorizontalIcon}
        title='カスタマイズ可能'
        description='柔軟な設定オプションにより、ニーズに合わせた調整が可能。'
      />
      <FeatureCard
        icon={AccessibilityIcon}
        title='アクセシビリティ'
        description='すべてのユーザーに配慮した設計。誰もが使いやすいインターフェース。'
      />
    </Grid>
  </Section>
)

const Footer = () => (
  <Box py='6'>
    <Separator
      size='4'
      mb='6'
      style={{ background: 'linear-gradient(to right, #A5D6A7, #81C784)' }}
    />
    <Flex justify='between' align='center' wrap='wrap' gap='4'>
      <Text size='2' className={NotoSansJP.className}>
        © 2024 Mayo
      </Text>
      <Flex gap='4'>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button asChild variant='ghost' size='2' style={{ color: '#2E8B57' }}>
            <a href='https://github.com/mayocream/twitter'>GitHub</a>
          </Button>
        </motion.div>
      </Flex>
    </Flex>
  </Box>
)

export default function Home() {
  return (
    <Theme accentColor='green' grayColor='sand' radius='large' scaling='95%'>
      <Box
        className='p-5'
        style={{
          background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
          minHeight: '100vh',
        }}
      >
        <Container size='4'>
          <Flex justify='between' align='center' py='4' wrap='wrap' gap='4'>
            <Text
              size='6'
              weight='bold'
              className={NotoSansJP.className}
              style={{ color: '#2E8B57' }}
            >
              <GradientText gradient='linear-gradient(135deg, #2E8B57, #4CAF50)'>
                Twitter
              </GradientText>
            </Text>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                asChild
                variant='solid'
                size={{ initial: '2', sm: '3' }}
                style={{
                  background: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
                }}
              >
                <a href='/dashboard'>開発パネル</a>
              </Button>
            </motion.div>
          </Flex>

          <Box>
            <Hero />
            <Features />
          </Box>

          <Footer />
        </Container>
      </Box>
    </Theme>
  )
}
