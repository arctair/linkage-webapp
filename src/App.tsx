import { Route, Routes, useNavigate } from 'react-router'
import ZoneContainer from './components/ZoneContainer'
import ZoneProvider, { useZone } from './components/ZoneProvider'

export default function App() {
  return (
    <div>
      <div>linkage</div>
      <ZoneProvider>
        <Routes>
          <Route path="/v1/zones/:id" element={<ZoneContainer />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </ZoneProvider>
    </div>
  )
}

function Landing() {
  const navigate = useNavigate()
  const {
    operations: { create },
  } = useZone()
  return (
    <button
      onClick={async () => {
        const id = await create()
        navigate(`/v1/zones/${id}`)
      }}
    >
      create your linkage
    </button>
  )
}
