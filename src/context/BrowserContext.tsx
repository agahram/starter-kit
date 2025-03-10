import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { Topic } from './TopicsContext'
import { log } from 'console'

export interface Browser {
  timestamp: string
  partitions: number
  key: string
  value: string
  offset: number
}

export interface Produce {
  topic: string
  key: any
  value: string
  headers: [{ key: string; value: string }]
}

interface InterfaceBrowser {
  browsers: Browser[]
  browserTopics: Topic[]
  recordsCount: number
  produceMessage: (obj: Produce) => void
  searchByPartitions: (topicName: string, partition: number) => void
  searchByKeys: (searchRequest: string[], topicName: string, searchChoice: string) => void
  searchByHeaders: (searchRequest: string[], topicName: string, searchChoice: string) => void
  searchByDatetime: (topicName: string, time1: any, time2: any) => void
  handlePagination: (pagination: { page: number; pageSize: number }, topicName: string) => void
  consumeMessages: (topicName: string) => void
  getRecordsCount: (topicName: string) => void
  getBrowserTopics: () => void
  isLoading: boolean
  loading: boolean
  searchLoad: boolean
  produceLoad: boolean
}

interface Props {
  children?: ReactNode
}

const InitialValue = {
  browsers: [],
  browserTopics: [],
  recordsCount: 0,
  produceMessage: (obj: Produce) => null,
  searchByPartitions: (topicName: string, partition: number) => null,
  searchByKeys: (searchRequest: string[], topicName: string, searchChoice: string) => null,
  searchByHeaders: (searchRequest: string[], topicName: string, searchChoice: string) => null,
  searchByDatetime: (topicName: string, time1: any, time2: any) => null,
  handlePagination: (pagination: { page: number; pageSize: number }, topicName: string) => null,
  consumeMessages: (topicName: string) => null,
  getRecordsCount: (topicName: string) => null,
  getBrowserTopics: () => null,
  isLoading: false,
  loading: false,
  searchLoad: false,
  produceLoad: false
}

const BrowserContext = createContext<InterfaceBrowser>(InitialValue)

const BrowserProvider = ({ children }: Props) => {
  const [browsers, setBrowsers] = useState<Browser[]>([])
  const [browserTopics, setBrowserTopics] = useState<Topic[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchLoad, setSearchLoad] = useState(false)
  const [recordsCount, setRecordsCount] = useState(0)
  const [produceLoad, setProduceLoad] = useState(false)

  const getBrowserTopics = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`http://localhost:5000/api/KafkaAdmin/get-topics?hideInternal=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      let data = await response.json()
      setBrowserTopics(data)
      setIsLoading(false)
    } catch (err: any) {
      console.log(err.message)
    }
  }

  const produceMessage = async (obj: Produce) => {
    try {
      setProduceLoad(true)
      const response = await fetch(`http://localhost:5000/api/KafkaAdmin/produce-message`, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        // setTimeout(() => {
        //   handlePagination({ page: 0, pageSize: 5 }, obj.topic)
        //   getRecordsCount(obj.topic)
        //   setProduceLoad(false)
        // }, 7000)
        handlePagination({ page: 0, pageSize: 5 }, obj.topic)
        getRecordsCount(obj.topic)
        setProduceLoad(false)
      }
    } catch (err: any) {
      console.log(err.message)
    }
  }

  const handlePagination = async (pagination: { page: number; pageSize: number }, topicName: string) => {
    try {
      setLoading(true)
      const response = await fetch(
        `http://localhost:5000/api/KafkaAdmin/get-specific-pages?topic=${topicName}&pageSize=${
          pagination.pageSize
        }&pageNumber=${pagination.page + 1}
      `,
        {
          method: 'GET'
        }
      )
      let data = await response.json()
      console.log('pagination data:', data)
      setBrowsers(data)
      setLoading(false)
    } catch (err: any) {
      console.log(err.message)
    }
  }

  const searchByPartitions = async (topicName: string, partition: number) => {
    try {
      setSearchLoad(true)
      const response = await fetch(
        `http://localhost:5000/api/KafkaAdmin/search-by-partitions?topic=${topicName}&partition=${partition}`,
        {
          method: 'GET'
        }
      )
      let data = await response.json()
      setBrowsers(data)
      setSearchLoad(false)
    } catch (err: any) {
      console.log(err.message)
    }
  }

  const searchByKeys = async (searchRequest: string[], topicName: string, searchChoice: string) => {
    try {
      setSearchLoad(true)
      let searchOption = 0
      if (searchChoice === 'contained') {
        searchOption = 1
      } else {
        searchOption = 2
      }
      const response = await fetch(`http://localhost:5000/api/KafkaAdmin/search-by-keys`, {
        method: 'POST',
        body: JSON.stringify({
          listOfKeys: searchRequest,
          topic: topicName,
          searchOption: searchOption
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      let data = await response.json()
      setBrowsers(data)
      console.log('search by keys', data)

      setSearchLoad(false)
    } catch (err: any) {
      console.log(err.message)
    }
  }

  const searchByHeaders = async (searchRequest: string[], topicName: string, searchChoice: string) => {
    try {
      setSearchLoad(true)
      let searchOption = 0
      if (searchChoice === 'contaned') {
        searchOption = 1
      } else {
        searchOption = 2
      }
      const response = await fetch(`http://localhost:5000/api/KafkaAdmin/search-by-headers`, {
        method: 'POST',
        body: JSON.stringify({
          listOfKeys: searchRequest,
          topic: topicName,
          searchOption: searchOption
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      let data = await response.json()
      setBrowsers(data)
      setSearchLoad(false)
    } catch (err: any) {
      console.log(err.message)
    }
  }

  const searchByDatetime = async (topicName: string, time1: any, time2: any) => {
    try {
      setSearchLoad(true)
      const response = await fetch(
        `http://localhost:5000/api/KafkaAdmin/search-by-timestamps?time1=${time1}&time2=${time2}&topic=${topicName}`,
        {
          method: 'GET'
        }
      )
      let data = await response.json()
      setBrowsers(data)
      setSearchLoad(false)
    } catch (err: any) {
      console.log(err.message)
    }
  }

  const consumeMessages = async (topicName: string) => {
    try {
      setLoading(true)
      const response = await fetch(
        `http://localhost:5000/api/KafkaAdmin/consume-messages-from-beginning?topicName=${topicName}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      let data = await response.json()
      setBrowsers(data)
      setLoading(false)
      return data
    } catch (err: any) {
      console.log(err.message)
    }
  }

  const getRecordsCount = async (topicName: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/KafkaAdmin/get-topic-records-count?topicName=${topicName}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      let data = await response.json()
      setRecordsCount(data)
      console.log('-----', data)

      return data
    } catch (err: any) {
      console.log(err.message)
    }
  }

  return (
    <BrowserContext.Provider
      value={{
        browsers,
        browserTopics,
        recordsCount,
        produceMessage,
        searchByPartitions,
        searchByKeys,
        searchByHeaders,
        searchByDatetime,
        handlePagination,
        consumeMessages,
        getRecordsCount,
        getBrowserTopics,
        isLoading,
        loading,
        searchLoad,
        produceLoad
      }}
    >
      {children}
    </BrowserContext.Provider>
  )
}

function useBrowser() {
  const context = useContext(BrowserContext)
  if (context === undefined) throw new Error('BrowserContext was used outside of the BrowserProvider')
  return context
}

export { useBrowser, BrowserProvider }
