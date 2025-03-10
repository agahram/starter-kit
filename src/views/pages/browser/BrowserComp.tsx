import React, { ChangeEvent, useEffect, useState } from 'react'
import TableComp from './TableComp'
import {
  Box,
  Button,
  ButtonProps,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  styled
} from '@mui/material'
import { useBrowser } from 'src/context/BrowserContext'
import Loader from '../catalog/Loader'
import ProduceComp from './ProduceComp'
import { v4 as uuidv4 } from 'uuid'
import { auto } from '@popperjs/core'
import Icon from 'src/@core/components/icon'

export interface BrowserTopic {
  id: any
  name: string
}

export default function BrowserComp(props: { topicName: string | string[] | undefined }) {
  const { isLoading, consumeMessages, handlePagination, getRecordsCount } = useBrowser()
  const { browserTopics, getBrowserTopics } = useBrowser()
  const [currentTopics, setCurrentTopics] = useState<BrowserTopic[]>()
  const [name, setName] = useState('')
  const [isClicked, setIsClicked] = useState(false)
  const [fetchClick, setFetchClick] = useState(false)
  const [searchClick, setSearchClick] = useState<boolean>(false)
  const [query, setQuery] = useState('')
  const [style, setStyle] = useState({ hover: false })

  useEffect(() => {
    if (props.topicName) {
      handleClick(props.topicName as string)
    }
  }, [])

  useEffect(() => {
    getBrowserTopics()
  }, [])

  useEffect(() => {
    let data: any = []
    if (browserTopics !== null && typeof browserTopics === 'object') {
      const val = Object.values(browserTopics)
      data = val.map((obj: any) => {
        return {
          name: obj.name,
          id: uuidv4()
        }
      })
      setCurrentTopics(data)
    }
  }, [browserTopics])

  useEffect(() => {
    let search_data = browserTopics.filter((browserTopic: any) => {
      return browserTopic.name.toLowerCase().includes(query.toLowerCase())
    })
    let newData = search_data.map((obj: any) => {
      return {
        name: obj.name,
        id: uuidv4()
      }
    })
    setCurrentTopics(newData)
  }, [query])

  function handleClick(name: string) {
    setStyle({ hover: true })
    setIsClicked(true)
    setName(name)
  }
  function handleFetch() {
    setFetchClick(true)
  }

  useEffect(() => {
    if (name) {
      setSearchClick(false)
      handlePagination({ page: 0, pageSize: 5 }, name)
      getRecordsCount(name)
      setFetchClick(false)
    }
  }, [fetchClick])

  return (
    <div>
      <Box sx={{ justifyContent: 'right', display: 'flex', marginBottom: 3 }}>
        <ProduceComp topicName={name} />
        <Button variant='contained' color='primary' onClick={() => handleFetch()}>
          <svg xmlns='http://www.w3.org/2000/svg' width='1.5em' height='1.5em' viewBox='0 0 256 256'>
            <path
              fill='currentColor'
              d='M232.4 114.49L88.32 26.35a16 16 0 0 0-16.2-.3A15.86 15.86 0 0 0 64 39.87v176.26A15.94 15.94 0 0 0 80 232a16.07 16.07 0 0 0 8.36-2.35l144.04-88.14a15.81 15.81 0 0 0 0-27ZM80 215.94V40l143.83 88Z'
            ></path>
          </svg>
          &nbsp;Fetch
        </Button>
      </Box>
      {isLoading ? (
        <Box sx={{ marginTop: 30 }}>
          <Loader />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Card sx={{ width: auto, minWidth: 280, minHeight: 400, marginRight: 5, position: 'left', padding: 5 }}>
            <CardContent sx={{ pt: 8, display: 'flex', alignItems: 'left', flexDirection: 'column', paddingTop: -5 }}>
              <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'left', marginLeft: -4 }}>
                <Typography variant='h6' sx={{ color: '#5C61E6', marginTop: -5 }}>
                  Topics
                </Typography>
              </Box>
              <TextField
                size='small'
                value={query}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
                placeholder='Search'
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 2, display: 'flex' }}>
                      <Icon icon='mdi:magnify' />
                    </Box>
                  )
                }}
                sx={{
                  width: 250,
                  '& .MuiInputBase-root > svg': {
                    mr: 2
                  },
                  marginTop: 2,
                  marginBottom: -3,
                  marginLeft: -6
                }}
              />

              <br />
              {currentTopics?.map(el => {
                return (
                  <div key={el.id}>
                    <Button
                      variant='text'
                      color='secondary'
                      onClick={() => handleClick(el.name)}
                      sx={{
                        textTransform: 'none',
                        fontSize: '15px',
                        marginLeft: -20,
                        minWidth: 350
                        // backgroundColor: style.hover ? '#6D788D' : '#FFF'
                      }}
                      // onMouseEnter={() => setStyle({ hover: true })}
                      // onMouseLeave={() => setStyle({ hover: false })}
                    >
                      {el.name}
                    </Button>
                  </div>
                )
              })}
            </CardContent>
          </Card>
          {isClicked || fetchClick ? (
            <TableComp topicName={name} searchClick={searchClick} setSearchClick={setSearchClick} />
          ) : (
            <Box sx={{ width: '100%', height: 500 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                <h2>Select a data stream or view from the left</h2>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </div>
  )
}
