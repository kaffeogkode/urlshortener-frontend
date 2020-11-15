import Navbar from './Navbar'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import { useEffect, useState } from 'react'
import moment from 'moment'

const App = () => {
  const [ links, setLinks ] = useState([])
  const [ showLinkVisits, setShowLinkVisits ] = useState(-1)

  useEffect(() => {
    fetch('http://localhost:9000/api/links')
      .then(res => res.json())
      .then(data => setLinks(data))
      .catch(error => alert('Error getting links:', error))
  }, [])

  const handleLinkClick = id => {
    setShowLinkVisits(id)
  }
  
  return (
    <>
      <Navbar />

      <p>{showLinkVisits}</p>

      <div className="first-after-nav container">
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>Hash / Short</th>
              <th>Link</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {links.map(l => (
              <tr key={l.id} onClick={_ => handleLinkClick(l.id)}>
                <th>{l.id}</th>
                <td>{l.hash}</td>
                <td>{l.url}</td>
                <td>
                  <span title={moment.unix(l.created_at).toLocaleString('LLLL')}>
                    {moment.unix(l.created_at).fromNow()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default App
