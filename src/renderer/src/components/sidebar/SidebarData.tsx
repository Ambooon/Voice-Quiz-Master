import { GoTasklist } from 'react-icons/go'
import { MdDashboard, MdOutlineHistoryEdu } from 'react-icons/md'
import { SiMicrosoftacademic } from 'react-icons/si'

export const SidebarData = [
  {
    title: 'Quiz Room',
    path: '/',
    icon: <MdDashboard />
  },
  {
    title: 'Quiz Management',
    path: '/quiz-management',
    icon: <SiMicrosoftacademic />
  },
  {
    title: 'Questions & Answer Set',
    path: '/qa-management',
    icon: <GoTasklist />
  },
  {
    title: 'Quiz History',
    path: '/quiz-history',
    icon: <MdOutlineHistoryEdu />
  }
]
