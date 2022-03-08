import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface Zone {}

export default function App() {
  const [[id, zone], setIdAndZone] = useState<[string, Zone]>(['', {}])
  return (
    <div style={{ height: '100%' }}>
      <div>linkage</div>
      {id ? (
        `${id}: ${JSON.stringify(zone)}`
      ) : (
        <button
          onClick={async () => {
            const id = uuidv4()
            const response = await fetch(
              `https://linkage-api.cruftbusters.com/v1/zones/${id}`,
              {
                method: 'POST',
              },
            )
            const zone = await response.json()
            setIdAndZone([id, zone])
          }}
        >
          create your linkage
        </button>
      )}
    </div>
  )
}
