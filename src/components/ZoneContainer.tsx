import { useEffect, useState } from 'react'
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
        zone <button onClick={createGroup}>+</button>
      </div>
      {zoneModel?.groups.map((groupModel) => (
        <Group key={groupModel.id} {...groupModel} />
      ))}
    </div>
  ) : (
    <Loading />
  )
}

function Group({ id, name, links }: GroupModel) {
  const {
    operations: { createLink, setGroupName },
  } = useZone()
  const [isEditMode, setEditMode] = useState(false)
  return (
    <div style={{ marginLeft: '0.5rem' }}>
      <div>
        {isEditMode ? (
          <input
            value={name}
            onChange={(e) => setGroupName(id, e.target.value)}
          />
        ) : (
          name
        )}{' '}
        <button onClick={() => setEditMode(!isEditMode)}>
          {isEditMode ? 'save' : 'edit'}
        </button>{' '}
        <button onClick={() => createLink(id)}>+</button>
      </div>
      {links.map((linkModel) => (
        <Link key={linkModel.id} {...linkModel} />
      ))}
    </div>
  )
}

function Link({ id, text, href }: LinkModel) {
  const {
    operations: { setLinkText, setLinkHref },
  } = useZone()
  const [isEditMode, setEditMode] = useState(false)
  return (
    <div style={{ marginLeft: '0.5rem' }}>
      {isEditMode ? (
        <>
          <input
            value={text}
            onChange={(e) => setLinkText(id, e.target.value)}
          />{' '}
          <input
            value={href}
            onChange={(e) => setLinkHref(id, e.target.value)}
          />
        </>
      ) : (
        <>
          <a href={href} children={text} />
        </>
      )}{' '}
      <button onClick={() => setEditMode(!isEditMode)}>
        {isEditMode ? 'save' : 'edit'}
      </button>
    </div>
  )
}

function Loading() {
  return <>loading</>
}
