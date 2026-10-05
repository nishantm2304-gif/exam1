import { useEffect, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import './App.css'

const emptyForm = {
  name: '',
  email: '',
  mobile: '',
  age: '',
}

const fields = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'mobile', label: 'Mobile', type: 'tel' },
  { name: 'age', label: 'Age', type: 'number' },
]

function App() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState('')
  const [error, setError] = useState(
    db ? '' : 'Firebase is not set up. Add your settings in the .env file.',
  )
  const [loading, setLoading] = useState(Boolean(db))

  useEffect(() => {
    if (!db) return undefined

    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        setUsers(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))
        setLoading(false)
      },
      (firebaseError) => {
        setError(firebaseError.message)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [])

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!db) return

    const user = {
      name: form.name.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim(),
      age: Number(form.age),
    }

    try {
      if (editId) {
        await updateDoc(doc(db, 'users', editId), user)
      } else {
        await addDoc(collection(db, 'users'), user)
      }

      setForm(emptyForm)
      setEditId('')
      setError('')
    } catch (firebaseError) {
      setError(firebaseError.message)
    }
  }

  function handleEdit(user) {
    setForm({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      age: String(user.age),
    })
    setEditId(user.id)
  }

  async function handleDelete(id) {
    if (!db) return

    try {
      await deleteDoc(doc(db, 'users', id))
      if (editId === id) {
        setForm(emptyForm)
        setEditId('')
      }
      setError('')
    } catch (firebaseError) {
      setError(firebaseError.message)
    }
  }

  return (
    <main className="container">
      <h1>User CRUD</h1>
      <p>Add, edit and delete users.</p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <h2>{editId ? 'Edit user' : 'Add user'}</h2>

        {fields.map((field) => (
          <label key={field.name}>
            {field.label}
            <input
              type={field.type}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              min={field.name === 'age' ? '1' : undefined}
              required
            />
          </label>
        ))}

        <button type="submit" disabled={!db}>
          {editId ? 'Update user' : 'Add user'}
        </button>
        {editId && (
          <button
            type="button"
            className="cancel-button"
            onClick={() => {
              setForm(emptyForm)
              setEditId('')
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Users</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users added yet.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Age</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile}</td>
                  <td>{user.age}</td>
                  <td>
                    <button type="button" onClick={() => handleEdit(user)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

export default App
