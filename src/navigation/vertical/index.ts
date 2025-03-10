// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { useConnection } from 'src/context/ConnectionsContext'

const navigation = (): VerticalNavItemsType => {
  const { isConnected } = useConnection()
  let arr = [
    {
      title: 'Connections',
      path: '/connections',
      icon: 'mdi:access-point'
    }
  ]
  if (isConnected) {
    arr.push(
      {
        title: 'Catalog',
        path: '/catalog',
        icon: 'mdi:abacus'
      },
      {
        title: 'Browser',
        path: '/browser',
        icon: 'mdi:account-details'
      },
      {
        title: 'Consumers',
        path: '/consumers',
        icon: 'mdi:account-group'
      }
    )
  }
  return arr
}

export default navigation
