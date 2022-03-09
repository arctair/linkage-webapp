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
      <div>
        zone ({zoneModel.id}) <button onClick={createGroup}>+</button>
      </div>
      {zoneModel?.groups.map(Group)}
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
        {name} ({id}) <button onClick={() => createLink(id)}>+</button>
      </div>
      {links.map(Link)}
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
