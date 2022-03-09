import { Route, Routes, useNavigate } from 'react-router'
import ZoneContainer from './components/ZoneContainer'
import { useZone } from './components/ZoneProvider'

export default function App() {
  const navigate = useNavigate()
  const {
    operations: { create },
  } = useZone()
  return (
    <div>
      <div>
        <a href="/">linkage</a>{' '}
        <button
          onClick={async () => {
            const id = await create()
            navigate(`/v1/zones/${id}`)
          }}
        >
          +
        </button>
      </div>
      <Routes>
        <Route path="/v1/zones/:id" element={<ZoneContainer />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </div>
  )
}

function Landing() {
  return <>welcome to linkage. create a zone with the + button above</>
}
