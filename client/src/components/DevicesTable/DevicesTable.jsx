import React from 'react'

import styles from './DevicesTable.scss'

const DevicesTable = (props) => {
  const { devices, onClick } = props
  if (!devices) {
    return <p>Loading devices...</p>
  }
  return (
    <table className={styles.main} cellPadding="0" cellSpacing="0">
      <thead>
        <tr>
          <td>IP</td>
          <td>MAC</td>
          <td>NAME</td>
        </tr>
      </thead>
      <tbody>
        { devices && devices.map(device => (
          <tr
            key={device._id}
            onClick={onClick}
          >
            <td>
              <b>{device.ipv4}</b> <br/>
              <span className={styles.smallFont}>{device.ipv6}</span>
            </td>
            <td>{device.mac}</td>
            <td><b>{device.name}</b></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default DevicesTable
