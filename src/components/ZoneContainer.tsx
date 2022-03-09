import { useEffect } from 'react'
import { useParams } from 'react-router'
import { useZone, ZoneModel } from './ZoneProvider'

export default function ZoneContainer() {
  const {
    state: { id, zoneModel: zone, loading },
    operations: { setPathID },
  } = useZone()
  const { id: pathID } = useParams()
  useEffect(() => {
    setPathID(pathID)
  }, [setPathID, pathID])
  return loading ? <Loading /> : <Zone id={id} zone={zone} />
}

interface ZoneProps {
  id: string
  zone: ZoneModel
}
function Zone({ id, zone }: ZoneProps) {
  return (
    <>
      {id}: {JSON.stringify(zone)}
    </>
  )
}

function Loading() {
  return <>loading</>
}
