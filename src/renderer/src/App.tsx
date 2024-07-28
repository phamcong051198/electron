import { useEffect, useState } from 'react'
import Versions from './components/Versions'

function App(): JSX.Element {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [users, setUsers] = useState<{ firstName: string; lastName: string }[]>([])

  useEffect(() => {
    // Add an event listener for the getDataResponse event
    window.electron.ipcRenderer.on('getDataResponse', (_, data) => {
      setUsers(data)
    })

    // Clean up the event listener on component unmount
    return (): void => {
      window.electron.ipcRenderer.removeAllListeners('getDataResponse')
    }
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const data = { firstName, lastName }
    window.electron.ipcRenderer.send('setData', data)
    setFirstName('')
    setLastName('')
  }
  const getData = (): void => {
    window.electron.ipcRenderer.send('getData')
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">FirstName:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">LastName:</label>
          <input
            type="lastName"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Data</button>
      </form>
      <button onClick={getData}>Get Data</button>
      <div>
        <h2>Users</h2>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{`${user.firstName} ${user.lastName}`}</li>
          ))}
        </ul>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App
