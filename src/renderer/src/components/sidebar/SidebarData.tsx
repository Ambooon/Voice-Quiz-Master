import { FaPeopleGroup } from 'react-icons/fa6'
import { GoTasklist } from 'react-icons/go'
import { MdDashboard, MdOutlineHistoryEdu } from 'react-icons/md'

export const SidebarData = [
  {
    title: 'Home',
    path: '/',
    icon: <MdDashboard />
  },
  {
    title: 'Questions & Answer',
    path: '/qa-management',
    icon: <GoTasklist />
  },
  {
    title: 'Participants',
    path: '/participant-management',
    icon: <FaPeopleGroup />
  },
  {
    title: 'Quiz History',
    path: '/quiz-history',
    icon: <MdOutlineHistoryEdu />
  }
]
