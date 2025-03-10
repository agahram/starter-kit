import { collapseClasses } from '@mui/material'
import { color } from '@mui/system'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useTopic } from 'src/context/TopicsContext'

interface Props {
  name: string
}

export default function TopicConfig({ name }: Props) {
  const router = useRouter()
  return (
    <a
      style={{ color: '#5C61E6', fontWeight: 500, cursor: 'default' }}
      onClick={() => router.push(`/catalog/configuration/${name}`)}
    >
      {name}
    </a>
  )
}
