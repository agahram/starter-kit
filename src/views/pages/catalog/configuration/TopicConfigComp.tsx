import { Breadcrumbs, Link, Stack } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { GridColDef } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import React, { use, useEffect, useState } from 'react'
import { object } from 'yup'
import Breadcrumb from 'src/views/pages/catalog/configuration/Breadcrumb'
import SearchComp from 'src/views/pages/catalog/SearchComp'
import { useTopic } from 'src/context/TopicsContext'
import CustomChip from 'src/@core/components/mui/chip'
import Loader from '../Loader'
import { set } from 'nprogress'
import Router, { useRouter } from 'next/router'
import { auto } from '@popperjs/core'
import { useConnection } from 'src/context/ConnectionsContext'

// ** Data Import

interface Props {
  topicName: string
}

const columns: GridColDef[] = [
  {
    flex: 0.1,
    field: 'name',
    minWidth: 280,
    headerName: 'Name'
  },
  {
    flex: 0.25,
    minWidth: 80,
    field: 'value',
    headerName: 'Value'
  }
]

export default function TopicConfigComp({ topicName }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const { getTopicConfig, getTopic, topic, rows, isLoading, loadingConfig, getTopicSize, topicSize, loadingTopicSize } =
    useTopic()

  const [currentData, setCurrentData] = useState([
    {
      name: '',
      value: ''
    }
  ])
  const [retentionTime, setRetentionTime] = useState(0)
  const [topicSizeConfig, setTopicSizeConfig] = useState('')
  // let topicSize = ''
  let data: any = []

  useEffect(() => {
    if (topicName) {
      getTopicConfig(topicName)
      getTopic(topicName)
      getTopicSize()
    }
  }, [topicName])

  useEffect(() => {
    let retention = 0
    if (rows) {
      const val = Object.values(rows).find(item => item)

      if (val?.entries) {
        const finalObj = Object.values(val.entries)

        data = finalObj.map((obj: any) => {
          if (obj.name === 'retention.ms') {
            retention = obj.value / 86400000
          }

          return {
            name: obj.name,
            value: obj.value
          }
        })
        setRetentionTime(retention)
        setCurrentData(data)
      }
    }
  }, [rows])

  useEffect(() => {
    let sizeObj = ''
    let size = 0
    let count = 0
    let sizeName = ''
    if (topicSize) {
      let sizeData: any = []
      const obj = Object.values(topicSize)
      sizeData = obj.map(el => {
        if (el.name === topicName) {
          for (let i = 0; i < el.partitions.length; i++) {
            size += el.partitions[i].size
          }
          while (size > 1000) {
            size /= 1000
            count += 1
          }
          // return size
          if (count == 0) {
            sizeName = 'bytes'
            sizeObj = size + ' ' + sizeName
          } else if (count == 1) {
            sizeName = 'kilobytes'
            sizeObj = size + ' ' + sizeName
          } else if (count == 2) {
            sizeName = 'megabytes'
            sizeObj = size + ' ' + sizeName
          } else if (count == 3) {
            sizeName = 'gigabytes'
            sizeObj = size + ' ' + sizeName
          }
        }
      })
      setTopicSizeConfig(sizeObj)
    }
  }, [topicSize])

  useEffect(() => {
    const val = Object.values(rows).find(item => item)
    if (val) {
      const finalObj = Object.values(val.entries)
      let search_data = finalObj.filter((row: any) => {
        return row.name.toLowerCase().includes(query.toLowerCase())
      })
      let newData = search_data.map((obj: any) => {
        return {
          name: obj.name,
          value: obj.value
        }
      })
      setCurrentData(newData)
    }
  }, [query])

  return (
    <>
      {!isLoading && !loadingConfig ? (
        <>
          <Card sx={{ padding: 4, marginBottom: 2 }}>
            <Breadcrumb />
          </Card>
          <Stack direction='row' spacing={2} sx={{ marginBottom: 2, display: 'flex' }}>
            <Card sx={{ width: 300, padding: 4 }}>
              <Box sx={{ alignItems: 'center' }}>
                <Link
                  key='2'
                  color='inherit'
                  // href='/browser'
                  onClick={() =>
                    router.push({
                      pathname: '/browser',
                      query: { name: topicName }
                    })
                  }
                >
                  <p style={{ cursor: 'default' }}>Records</p>
                </Link>
                <CustomChip label={topic!.recordsCount} skin='light' color='primary' />
              </Box>
            </Card>
            <Card sx={{ width: 300, padding: 4 }}>
              <p>Partitions</p>
              <CustomChip label={topic!.partitions.length} skin='light' color='primary' />
            </Card>
            {loadingTopicSize ? (
              <Loader />
            ) : (
              <Card sx={{ width: 300, padding: 4 }}>
                <p>Topic Size</p>
                <CustomChip label={topicSizeConfig} skin='light' color='primary' />
              </Card>
            )}
            <Card sx={{ width: 300, padding: 4 }}>
              <p>Retention</p>
              <CustomChip label={retentionTime + ' days'} skin='light' color='primary' />
            </Card>
            <Card sx={{ width: 300, padding: 4 }}>
              <p>Replication Factor</p>
              <CustomChip label={topic!.replicationFactor} skin='light' color='primary' />
            </Card>
          </Stack>
          <Card>
            <SearchComp setQuery={setQuery} />
            <Box sx={{ height: 700 }}>
              <DataGrid columns={columns} rows={currentData} getRowId={item => item.name} />
            </Box>
          </Card>
        </>
      ) : (
        <Loader />
      )}
    </>
  )
}
