import type { Trainee } from '@/types'
import { ProgressBar } from './ProgressBar'

type TraineeTableProps = {
  trainees: Trainee[]
}

export function TraineeTable({ trainees }: TraineeTableProps) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Trainee</th>
            <th>Current Level</th>
            <th>Last Score</th>
            <th>Progress</th>
            <th>Profile</th>
          </tr>
        </thead>
        <tbody>
          {trainees.map((trainee) => (
            <tr key={trainee.id}>
              <td>
                <div className="person-cell">
                  <span>{trainee.id}</span>
                  <div>
                    <strong>{trainee.name}</strong>
                    <small>{trainee.joined}</small>
                  </div>
                </div>
              </td>
              <td><span className="level-tag">{trainee.level}</span></td>
              <td><strong>{trainee.score}/100</strong></td>
              <td><ProgressBar value={trainee.progress} /></td>
              <td><button className="link-button" type="button">View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
