import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { setTimeout } from 'timers'
import { boolean, string } from 'yup'

interface Connection {
  connectionName: string
  bootStrapServer: string
  connectionId?: number
}
interface Props {
  children?: ReactNode
}
interface InterfaceConnection {
  connections: Connection[] | null
  getConnections: () => void
  addConnections: (connection: Connection) => void
  deleteConnection: (id: number) => void
  editConnection: (connection: Connection) => void
  checkConnection: (bootStrapServer: string) => null | Promise<void> | Promise<Response>
  testConnection: boolean
  setTestConnection: (testConnection: boolean) => void
  getClusterInfo: () => void
  rows: undefined | { [s: string]: any }
  isConnected: string
  setIsConnected: (arg: string) => void
}

const InitialValue = {
  connections: [],
  getConnections: () => null,
  addConnections: (connection: Connection) => null,
  deleteConnection: (id: number) => null,
  editConnection: (connection: Connection) => null,
  checkConnection: (bootStrapServer: string) => null,
  testConnection: false,
  setTestConnection: (testConnection: boolean) => null,
  getClusterInfo: () => null,
  rows: undefined,
  isConnected: '',
  setIsConnected: (arg: string) => null
}

const ConnectionContext = createContext<InterfaceConnection>(InitialValue)

const ConnectionProvider = ({ children }: Props) => {
  const [connections, setConnections] = useState<Connection[]>([])
  const [testConnection, setTestConnection] = useState(false)
  const [rows, setRows] = useState()
  const [isConnected, setIsConnected] = useState('')

  const addConnections = async (connection: Connection) => {
    // async function fetchConnections() {
    console.log(connection)
    try {
      const response = await fetch('http://localhost:5000/api/KafkaCluster/create-connection', {
        method: 'POST',
        body: JSON.stringify(connection),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          console.log('RES', response)

          return response.json()
        })
        .then(data => console.log('DATA', data))
    } catch (err: any) {
      console.log(err.message)
    }
    setTimeout(async () => {
      let data = await getConnections()
      setConnections(data)
    }, 100)
  }

  const getConnections = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/KafkaCluster/get-connections', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      let data = await response.json()
      setConnections(data)
      return data
    } catch (err: any) {
      console.log(err.message)
    }
  }

  const deleteConnection = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/KafkaCluster/delete-connection?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      let data = await response.json()
    } catch (err: any) {
      console.log(err.message)
    }
    setConnections(await getConnections())
  }
  const checkConnection = async (bootStrapServer: string) => {
    const response = await fetch(`http://localhost:5000/api/KafkaCluster/check-connection?address=${bootStrapServer}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (response.ok) {
      setIsConnected(bootStrapServer)
    } else {
      setIsConnected('')
    }

    return response
  }
  const editConnection = async (connection: Connection) => {
    console.log(connection)
    const response = await fetch('http://localhost:5000/api/KafkaCluster/update-connection', {
      method: 'PUT',
      body: JSON.stringify(connection),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    let data = await getConnections()
    setConnections(data)
  }

  const getClusterInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/KafkaCluster/get-cluster-info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      let data = await response.json()
      setRows(data)
      // console.log(data)
      return data
    } catch (err: any) {
      console.log(err.message)
    }
  }
  useEffect(() => {
    getClusterInfo()
  }, [])
  return (
    <ConnectionContext.Provider
      value={{
        connections,
        getConnections,
        deleteConnection,
        editConnection,
        addConnections,
        checkConnection,
        testConnection,
        setTestConnection,
        getClusterInfo,
        rows,
        isConnected,
        setIsConnected
      }}
    >
      {children}
    </ConnectionContext.Provider>
  )
}

function useConnection() {
  const context = useContext(ConnectionContext)
  if (context === undefined) throw new Error('ConnectionContext was used outside of the ConnectionProvider')
  return context
}

export { useConnection, ConnectionProvider }
