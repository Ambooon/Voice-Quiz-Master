import { useState } from 'react'

type FormDataType = {
  id: number
  title: string
  description: string
  //datecreated
  qaList: [
    {
      id: number
      question: string
      choices: string[]
      answer: string
      difficulty: 'easy' | 'average' | 'hard'
    }
  ]
}

export default function QAFormModal({ onClick = () => {} }) {
  const [formData, setFormData] = useState<FormDataType>({
    id: 0,
    title: '',
    description: '',
    qaList: [
      {
        id: 1,
        question: '',
        choices: [''],
        answer: '',
        difficulty: 'easy'
      }
    ]
  })
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value
      }
    })
  }
  function handleBack() {
    onClick()
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
  }
  return (
    <div>
      <button onClick={handleBack}>Back</button>
      <h5>Create Question and Answer Set</h5>
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} />
        <br />
        <label htmlFor="description">Description: </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <br />
        <Table />
      </form>
    </div>
  )
}

function Table() {
  const [rowId, setRowId] = useState(1)
  const [rows, setRows] = useState<JSX.Element[]>([])
  function handleAdd() {
    setRows((prevRows) => [
      ...prevRows,
      <TableRow key={rowId} id={rowId} onDelete={handleDelete} />
    ])
    setRowId((prev) => prev + 1)
  }
  function handleDelete(id: number) {
    console.log('Delete', id)
    setRows((prevRows) => prevRows.filter((row) => Number(row.key) !== id))
  }
  return (
    <>
      <button onClick={handleAdd}>Add</button>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Question</th>
            <th>Choices</th>
            <th>Answer</th>
            <th>Difficulty</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </>
  )
}

function TableRow(props: { id: number; onDelete: (id: number) => void }) {
  const [isEditing, setIsEditing] = useState(false)
  const [rowData, setRowData] = useState({
    id: props.id,
    question: '',
    choices: ['test', 'test12'],
    answer: '',
    difficulty: 'easy'
  })
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setRowData((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value
      }
    })
  }
  function handleDelete() {
    props.onDelete(props.id)
  }
  return (
    <tr>
      <td>{rowData.id}</td>
      <td>
        {isEditing ? (
          <input
            className="rounded-md border-2 border-slate-800"
            type="text"
            name="question"
            value={rowData.question}
            onChange={handleChange}
          />
        ) : (
          rowData.question
        )}
      </td>
      <td>
        <ul>
          {/* {isEditing
            ? rowData.choices.map((choice, id) => {
                return (
                  <input
                    key={id}
                    className="rounded-md border-2 border-slate-800"
                    type="text"
                    name="choices"
                    value={choice}
                    onChange={handleChange}
                  />
                );
              })
            : rowData.choices.map((choice, id) => {
                return <li key={id}>{choice}</li>;
              })} */}
          {rowData.choices.map((choice, id) => {
            return <li key={id}>{choice}</li>
          })}
        </ul>
      </td>
      <td>
        {isEditing ? (
          <input
            className="rounded-md border-2 border-slate-800"
            type="text"
            name="answer"
            value={rowData.answer}
            onChange={handleChange}
          />
        ) : (
          rowData.answer
        )}
      </td>
      <td>
        {isEditing ? (
          <select
            name="difficulty"
            id="difficulty"
            value={rowData.difficulty}
            onChange={handleChange}
          >
            <option value="easy">Easy</option>
            <option value="average">Average</option>
            <option value="hard">Hard</option>
          </select>
        ) : (
          rowData.difficulty
        )}
      </td>
      <td>
        <button onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Done' : 'Edit'}</button>
        <button onClick={() => handleDelete()}>Delete</button>
      </td>
    </tr>
  )
}
