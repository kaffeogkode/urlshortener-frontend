import Navbar from './Navbar'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import { useEffect, useState } from 'react'
import moment from 'moment'

const App = () => {
	// links, visits - everything is global in this component (❁´◡`❁)
	const [ links, setLinks ] = useState([])
	const [ showLinkVisits, setShowLinkVisits ] = useState(-1)
	const [ visits, setVisits ] = useState([])
	const [ urlInput, setURLInput ] = useState('')

	useEffect(() => {
		fetch('http://admin.l.kaffeogkode.dk/api/links')
			.then(res => res.json())
			.then(data => setLinks(data))
			.catch(error => alert('Error getting links:', error))
	}, [])

	useEffect(() => {
		// if a link is clicked we fetch the visits
		if (showLinkVisits !== -1) {
			const link = links.find(l => l.id === showLinkVisits)
			if (link) {
				fetch(`http://admin.l.kaffeogkode.dk/api/visits/${link.hash}`)
					.then(res => res.json())
					.then(data => setVisits(data))
					.catch(error => alert('Error getting link visits:', error))
			}
			
		}
	}, [ showLinkVisits ])

	const handleLinkClick = id => {
		setShowLinkVisits(id)
	}

	const createNewLink = () => {
		fetch('http://admin.l.kaffeogkode.dk/api/link',
		{
			method: 'POST',
			body: JSON.stringify({url: urlInput})
		})
			.then(res => res.json())
			.then(data => setLinks([...links, data]))
			.then(setURLInput(''))
			.catch(error => alert('Error creating link:', error))
	}
	
	// show all the links unless we clicked one, if one is clicked we show visits
	if (showLinkVisits !== -1) {
		return (
			<>
				<Navbar />

				<div className="first-after-nav container">
				<button className="btn btn-dark" onClick={() => setShowLinkVisits(-1)}>Back</button>
				</div>

				<div className="first-after-nav container">
				<table className="table">
					<thead className="thead-dark">
						<tr>
							<th>#</th>
							<th>Visitor IP</th>
							<th>Visit Time</th>
						</tr>
					</thead>
					<tbody>
						{visits.map(v => (
							<tr key={v.id}>
								<td>{v.id}</td>
								<td>{v.visitor_ip}</td>
								<td>
									<span title={moment.unix(v.visit_time).toLocaleString('LLLL')}>
										{moment.unix(v.visit_time).fromNow()}
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

	return (
		<>
			<Navbar />

			<div className="container">
				<div className="form-group">
					<label>Link to shorten</label>
					<input type="url" value={urlInput} onChange={e => setURLInput(e.target.value)} className="form-control" />
				</div>
				<button type="submit" className="btn btn-dark" onClick={() => createNewLink()}>Shorten</button>
			</div>

			<div className="first-after-nav container">
				<table className="table">
					<thead className="thead-dark">
						<tr>
							<th>#</th>
							<th>Hash</th>
							<th>Shortened</th>
							<th>Link</th>
							<th>Created At</th>
						</tr>
					</thead>
					<tbody>
						{links.map(l => (
							<tr key={l.id} onClick={_ => handleLinkClick(l.id)}>
								<td>{l.id}</td>
								<td>{l.hash}</td>
								<td>{`http://l.kaffeogkode.dk/${l.hash}`}</td>
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
