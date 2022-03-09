import { useEffect } from 'react'
import { useParams } from 'react-router'
import { GroupModel, LinkModel, useZone } from './ZoneProvider'

export default function Zone() {
  const {
    state: { zoneModel },
    operations: { createGroup, setPathID },
  } = useZone()
  const { id: pathID } = useParams()
  useEffect(() => {
    setPathID(pathID)
  }, [setPathID, pathID])
  return zoneModel ? (
    <div style={{ marginLeft: '0.5rem' }}>
      <div>zone ({zoneModel.id})</div>
      {zoneModel?.groups.map(Group)}
      <button onClick={createGroup}>create group</button>
    </div>
  ) : (
    <Loading />
  )
}

function Group({ id, name, links }: GroupModel) {
  const {
    operations: { createLink },
  } = useZone()
  return (
    <div style={{ marginLeft: '0.5rem' }}>
      <div>
        {name} ({id})
      </div>
      {links.map(Link)}
      <button onClick={() => createLink(id)}>create link</button>
    </div>
  )
}

function Link({ id, text, href }: LinkModel) {
  return (
    <a
      style={{ marginLeft: '0.5rem', display: 'block' }}
      href={href}
      children={`${text} (${id})`}
    />
  )
}

function Loading() {
  return <>loading</>
}
