import {
  XStack,
  YStack,
  Text,
  Image,
  ScrollView,
  Circle,
  Separator,
  Button,
} from 'tamagui'

export default function Profile() {
  // Mock data
  const profile = {
    name: 'Jane Doe',
    handle: '@janedoe',
    bio: 'Software developer | Coffee enthusiast | Hiking lover',
    location: 'San Francisco, CA',
    website: 'janedoe.dev',
    joinDate: 'Joined March 2020',
    following: 245,
    followers: 1028,
    tweets: [
      {
        id: 1,
        content:
          'Just shipped a new feature to production! 🚀 #coding #developer',
        likes: 42,
        retweets: 7,
        comments: 3,
        time: '2h',
      },
      {
        id: 2,
        content:
          'Beautiful hike this weekend at Mount Tamalpais. The views were incredible! 🏞️ #hiking #weekend',
        likes: 86,
        retweets: 12,
        comments: 5,
        time: '1d',
      },
      {
        id: 3,
        content:
          'Working on a new Tamagui project and loving the developer experience so far!',
        likes: 24,
        retweets: 4,
        comments: 2,
        time: '2d',
      },
    ],
  }

  return <ScrollView></ScrollView>
}
