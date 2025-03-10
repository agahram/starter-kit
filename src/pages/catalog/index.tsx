import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { Topic, useTopic } from 'src/context/TopicsContext'
import CreateTopic from 'src/views/pages/catalog/CreateTopic'
import Loader from 'src/views/pages/catalog/Loader'
import MoreButton from 'src/views/pages/catalog/MoreButton'
import SearchComp from 'src/views/pages/catalog/SearchComp'
import TopicConfig from 'src/views/pages/catalog/configuration/TopicConfig'
import ExportFile from 'src/views/pages/catalog/ExportFile'
import ImportFile from 'src/views/pages/catalog/ImportFile'
import { TextField } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { maxWidth } from '@mui/system'

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Topic',
    width: 300,
    renderCell: ({ row }: any) => {
      return <TopicConfig name={row.name} />
    }
  },
  { field: 'partitions', headerName: 'Partition', width: 280 },
  {
    field: 'replicationFactor',
    headerName: 'Replicas',
    width: 250
  },
  {
    field: 'topicSize',
    headerName: 'Topic Size',
    width: 250
  },
  {
    field: 'more',
    headerName: '',
    width: 80,
    renderCell: ({ row }: any) => {
      return <MoreButton name={row.name} />
    }
  }
]

export default function index() {
  const [query, setQuery] = useState('')
  const { topics, isLoading, getTopics, getTopicSize, topicSize, loadingTopicSize } = useTopic()
  const [currentData, setCurrentData] = useState<Topic[]>([])

  let size = 0
  let sizeName = ''
  let count = 0

  useEffect(() => {
    getTopics()
  }, [])

  useEffect(() => {
    getTopicSize()
  }, [isLoading])

  useEffect(() => {
    if (topics !== null && typeof topics === 'object') {
      let data: any = []
      const val = Object.values(topics)
      data = val.map((obj: any) => {
        count = 0
        size = 0
        sizeName = ''
        let sizeObj = topicSize.find(i => i.name === obj.name)

        for (let i = 0; i < sizeObj?.partitions.length!; i++) {
          size += sizeObj!.partitions[i].size
        }

        while (size > 1000) {
          size /= 1000
          count += 1
        }
        if (count == 0) {
          sizeName = 'bytes'
        } else if (count == 1) {
          sizeName = 'kilobytes'
        } else if (count == 2) {
          sizeName = 'megabytes'
        } else if (count == 3) {
          sizeName = 'gigabytes'
        }
        return {
          name: obj.name,
          replicationFactor: obj.replicationFactor,
          partitions: obj.partitions.length,
          topicSize: `${size} ${sizeName}`
        }
      })
      setCurrentData(data)
    } else {
      console.log('obj is null or undefined')
    }
  }, [topics, topicSize])
  useEffect(() => {
    let search_data = topics.filter((topic: any) => {
      return topic.name.toLowerCase().includes(query.toLowerCase())
    })
    let newData = search_data.map((obj: any) => {
      count = 0
      size = 0
      sizeName = ''
      for (let i = 0; i < obj.partitions.length; i++) {
        size += obj.partitions[i].size
      }
      while (size > 1000) {
        size /= 1000
        count += 1
      }

      if (count == 0) {
        sizeName = 'bytes'
      } else if (count == 1) {
        sizeName = 'kilobytes'
      } else if (count == 2) {
        sizeName = 'megabytes'
      } else if (count == 3) {
        sizeName = 'gigabytes'
      }
      return {
        name: obj.name,
        replicationFactor: obj.replicationFactor,
        partitions: obj.partitions.length,
        topicSize: `${size} ${sizeName}`
      }
    })
    setCurrentData(newData)
  }, [query])
  return (
    <>
      <Stack direction='row' spacing={1} sx={{ display: 'flex', alignItems: 'right', justifyContent: 'right' }}>
        <ExportFile data={currentData} />
        <ImportFile />
        <CreateTopic />
      </Stack>
      {isLoading ? (
        <Loader />
      ) : (
        <Card sx={{ marginTop: 3 }}>
          <Box
            sx={{
              gap: 2,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'stretch',
              justifyContent: 'start'
            }}
          >
            <Box sx={{ padding: 3, marginBottom: -2 }}>
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
                  width: 300,
                  '& .MuiInputBase-root > svg': {
                    mr: 2
                  },
                  padding: 2
                }}
              />
            </Box>
          </Box>
          <DataGrid
            autoHeight
            columns={columns}
            rows={currentData}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 50 }
              }
            }}
            pageSizeOptions={[5, 10, 20, 50, 100]}
            getRowId={item => item.name}
          />
        </Card>
      )}
    </>
  )
}
